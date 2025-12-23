"""Phone number related Pydantic models."""

from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class PhoneNumberType(str, Enum):
    """Type of phone number."""
    LOCAL = "local"
    TOLL_FREE = "toll_free"
    MOBILE = "mobile"


class PhoneNumberAvailable(BaseModel):
    """Model for an available phone number from Twilio."""
    
    phone_number: str
    friendly_name: str
    locality: Optional[str] = None
    region: Optional[str] = None
    country_code: str
    capabilities: dict
    price_monthly: float
    number_type: PhoneNumberType


class PhoneNumberSearchParams(BaseModel):
    """Model for phone number search parameters."""
    
    country_code: str = Field(default="US", description="ISO country code")
    area_code: Optional[str] = Field(None, description="Area code to search in")
    number_type: PhoneNumberType = Field(default=PhoneNumberType.LOCAL)
    contains: Optional[str] = Field(None, description="Pattern the number should contain")
    limit: int = Field(default=20, ge=1, le=50)


class PhoneNumberPurchase(BaseModel):
    """Model for purchasing a phone number."""
    
    phone_number: str = Field(..., description="The phone number to purchase")
    friendly_name: Optional[str] = Field(None, description="A friendly name for the number")


class PhoneNumberResponse(BaseModel):
    """Model for phone number response after purchase."""
    
    id: str
    business_id: str
    phone_number: str
    friendly_name: Optional[str] = None
    sid: Optional[str] = None  # Twilio SID
    status: str
    purchased_at: str
    
    class Config:
        from_attributes = True


class AvailableNumbersResponse(BaseModel):
    """Response model for available phone numbers."""
    
    numbers: List[PhoneNumberAvailable]
    total: int

