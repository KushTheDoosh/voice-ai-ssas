"""Phone number related API routes."""

from fastapi import APIRouter, HTTPException, status, Query
from typing import Optional
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
    
    # Check if business already has a phone number
    existing_number = db.get_phone_number(business_id)
    if existing_number:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Business already has a phone number assigned"
        )
    
    # Purchase the number via Twilio
    purchased = await twilio_service.purchase_number(
        phone_number=purchase.phone_number,
        friendly_name=purchase.friendly_name or business["name"]
    )
    
    # Save to database
    phone_data = {
        "phone_number": purchased["phone_number"],
        "friendly_name": purchased.get("friendly_name"),
        "sid": purchased.get("sid"),
        "status": "active"
    }
    phone_record = db.assign_phone_number(business_id, phone_data)
    
    return PhoneNumberResponse(**phone_record)


@router.get("/{business_id}", response_model=PhoneNumberResponse)
async def get_business_phone_number(business_id: str):
    """Get the phone number assigned to a business."""
    # Validate business exists
    business = db.get_business(business_id)
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Business with ID {business_id} not found"
        )
    
    phone = db.get_phone_number(business_id)
    if not phone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No phone number assigned to business {business_id}"
        )
    
    return PhoneNumberResponse(**phone)

