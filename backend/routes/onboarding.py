"""Onboarding flow API routes."""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from ..database import db

router = APIRouter(prefix="/onboarding", tags=["Onboarding"])


class OnboardingSessionResponse(BaseModel):
    """Response model for onboarding session."""
    id: str
    created_at: str
    current_step: int
    business_id: Optional[str] = None
    completed: bool


class OnboardingCompleteRequest(BaseModel):
    """Request model for completing onboarding."""
    business_id: str


class OnboardingCompleteResponse(BaseModel):
    """Response model for completed onboarding."""
    message: str
    business_id: str
    dashboard_url: str


@router.post("/session", response_model=OnboardingSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_onboarding_session():
    """Create a new onboarding session."""
    session = db.create_onboarding_session()
    return OnboardingSessionResponse(**session)


@router.get("/session/{session_id}", response_model=OnboardingSessionResponse)
async def get_onboarding_session(session_id: str):
    """Get an onboarding session."""
    session = db.get_onboarding_session(session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Onboarding session {session_id} not found"
        )
    return OnboardingSessionResponse(**session)


@router.patch("/session/{session_id}")
async def update_onboarding_session(
    session_id: str,
    current_step: Optional[int] = None,
    business_id: Optional[str] = None,
):
    """Update an onboarding session."""
    session = db.get_onboarding_session(session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Onboarding session {session_id} not found"
        )
    
    update_data = {}
    if current_step is not None:
        update_data["current_step"] = current_step
    if business_id is not None:
        update_data["business_id"] = business_id
    
    updated = db.update_onboarding_session(session_id, update_data)
    return OnboardingSessionResponse(**updated)


@router.post("/complete", response_model=OnboardingCompleteResponse)
async def complete_onboarding(request: OnboardingCompleteRequest):
    """Complete the onboarding process and get dashboard URL."""
    # Validate business exists
    business = db.get_business(request.business_id)
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Business with ID {request.business_id} not found"
        )
    
    # Validate all required data is present
    knowledge_base = db.get_knowledge_base_files(request.business_id)
    phone_number = db.get_phone_number(request.business_id)
    voice_assistant = db.get_voice_assistant(request.business_id)
    
    if not knowledge_base:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Knowledge base documents are required"
        )
    
    if not phone_number:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number is required"
        )
    
    if not voice_assistant:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Voice assistant configuration is required"
        )
    
    # Generate dashboard URL
    dashboard_url = f"/dashboard/{request.business_id}"
    
    return OnboardingCompleteResponse(
        message="Onboarding completed successfully!",
        business_id=request.business_id,
        dashboard_url=dashboard_url
    )

