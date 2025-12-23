"""Business-related Pydantic models."""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class BusinessCreate(BaseModel):
    """Model for creating a new business."""
    
    name: str = Field(..., min_length=1, max_length=255, description="Business name")
    description: Optional[str] = Field(None, max_length=2000, description="Business description")


class BusinessUpdate(BaseModel):
    """Model for updating a business."""
    
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)


class BusinessResponse(BaseModel):
    """Model for business response."""
    
    id: str
    name: str
    description: Optional[str] = None
    created_at: str
    updated_at: str
    
    class Config:
        from_attributes = True

