"""Phone number related API routes."""

from fastapi import APIRouter, HTTPException, status, Query
from typing import Optional, List
from pydantic import BaseModel
from ..models.phone_number import (
    PhoneNumberAvailable,
    PhoneNumberPurchase,
    PhoneNumberResponse,
    PhoneNumberType,
    AvailableNumbersResponse,
)
from ..database import db
from ..services.twilio_service import twilio_service

router = APIRouter(prefix="/phone-numbers", tags=["Phone Numbers"])


class TwilioStatusResponse(BaseModel):
    """Response for Twilio configuration status."""
    configured: bool
    account_info: Optional[dict] = None
    message: str


@router.get("/status", response_model=TwilioStatusResponse)
async def get_twilio_status():
    """Check if Twilio is configured and get account info."""
    if not twilio_service.is_configured:
        return TwilioStatusResponse(
            configured=False,
            account_info=None,
            message="Twilio is not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env file. Using mock data for development."
        )
    
    account_info = await twilio_service.get_account_info()
    if account_info:
        return TwilioStatusResponse(
            configured=True,
            account_info=account_info,
            message=f"Twilio configured and connected to account: {account_info.get('friendly_name', 'Unknown')}"
        )
    else:
        return TwilioStatusResponse(
            configured=False,
            account_info=None,
            message="Twilio credentials provided but could not connect. Please verify your credentials."
        )


@router.get("/available", response_model=AvailableNumbersResponse)
async def search_available_numbers(
    country_code: str = Query(default="US", description="ISO country code"),
    area_code: Optional[str] = Query(default=None, description="Area code to search in"),
    number_type: PhoneNumberType = Query(default=PhoneNumberType.LOCAL),
    contains: Optional[str] = Query(default=None, description="Pattern the number should contain"),
    limit: int = Query(default=20, ge=1, le=50),
):
    """Search for available phone numbers from Twilio."""
    numbers = await twilio_service.search_available_numbers(
        country_code=country_code,
        area_code=area_code,
        number_type=number_type,
        contains=contains,
        limit=limit
    )
    
    return AvailableNumbersResponse(
        numbers=numbers,
        total=len(numbers)
    )


@router.post("/purchase/{business_id}", response_model=PhoneNumberResponse)
async def purchase_phone_number(
    business_id: str,
    purchase: PhoneNumberPurchase,
):
    """Purchase a phone number for a business."""
    # Validate business exists
    business = db.get_business(business_id)
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Business with ID {business_id} not found"
        )
    
    # Purchase the number via Twilio
    purchased = await twilio_service.purchase_number(
        phone_number=purchase.phone_number,
        friendly_name=purchase.friendly_name or business["name"]
    )
    
    # Save to database (now supports multiple numbers)
    phone_data = {
        "phone_number": purchased["phone_number"],
        "friendly_name": purchased.get("friendly_name"),
        "sid": purchased.get("sid"),
        "status": "active"
    }
    phone_record = db.add_phone_number(business_id, phone_data)
    
    return PhoneNumberResponse(**phone_record)


@router.get("/{business_id}", response_model=List[PhoneNumberResponse])
async def get_business_phone_numbers(business_id: str):
    """Get all phone numbers assigned to a business."""
    # Validate business exists
    business = db.get_business(business_id)
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Business with ID {business_id} not found"
        )
    
    numbers = db.get_phone_numbers(business_id)
    return [PhoneNumberResponse(**n) for n in numbers]


@router.get("/{business_id}/{phone_id}", response_model=PhoneNumberResponse)
async def get_phone_number(business_id: str, phone_id: str):
    """Get a specific phone number."""
    # Validate business exists
    business = db.get_business(business_id)
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Business with ID {business_id} not found"
        )
    
    phone = db.get_phone_number_by_id(business_id, phone_id)
    if not phone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Phone number with ID {phone_id} not found"
        )
    
    return PhoneNumberResponse(**phone)


@router.delete("/{business_id}/{phone_id}")
async def delete_phone_number(business_id: str, phone_id: str):
    """Delete/release a phone number from a business."""
    # Validate business exists
    business = db.get_business(business_id)
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Business with ID {business_id} not found"
        )
    
    phone = db.get_phone_number_by_id(business_id, phone_id)
    if not phone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Phone number with ID {phone_id} not found"
        )
    
    # Release the number via Twilio if it has a SID
    if phone.get("sid") and not phone["sid"].startswith("PN_MOCK_"):
        released = await twilio_service.release_number(phone["sid"])
        if not released:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to release phone number from Twilio"
            )
    
    db.delete_phone_number(business_id, phone_id)
    return {"message": "Phone number deleted successfully", "deleted_id": phone_id}
