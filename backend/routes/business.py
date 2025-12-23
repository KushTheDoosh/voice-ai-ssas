"""Business-related API routes."""

from fastapi import APIRouter, HTTPException, status
from ..models.business import BusinessCreate, BusinessUpdate, BusinessResponse
from ..database import db

router = APIRouter(prefix="/business", tags=["Business"])


@router.post("", response_model=BusinessResponse, status_code=status.HTTP_201_CREATED)
async def create_business(business: BusinessCreate):
    """Create a new business profile."""
    business_data = business.model_dump()
    created_business = db.create_business(business_data)
    return BusinessResponse(**created_business)


@router.get("/{business_id}", response_model=BusinessResponse)
async def get_business(business_id: str):
    """Get a business by ID."""
    business = db.get_business(business_id)
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Business with ID {business_id} not found"
        )
    return BusinessResponse(**business)


@router.patch("/{business_id}", response_model=BusinessResponse)
async def update_business(business_id: str, business_update: BusinessUpdate):
    """Update a business profile."""
    existing = db.get_business(business_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Business with ID {business_id} not found"
        )
    
    update_data = business_update.model_dump(exclude_unset=True)
    updated_business = db.update_business(business_id, update_data)
    return BusinessResponse(**updated_business)


@router.delete("/{business_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_business(business_id: str):
    """Delete a business profile."""
    existing = db.get_business(business_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Business with ID {business_id} not found"
        )
    
    # Remove business from database
    del db.businesses[business_id]
    return None

