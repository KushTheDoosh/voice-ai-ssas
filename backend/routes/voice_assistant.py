"""Voice assistant related API routes."""

from fastapi import APIRouter, HTTPException, status
from ..models.voice_assistant import (
    VoiceAssistantCreate,
    VoiceAssistantUpdate,
    VoiceAssistantResponse,
    VoiceOptionsResponse,
    ModelProvider,
    ModelName,
    ElevenLabsVoice,
)
from ..database import db

router = APIRouter(prefix="/voice-assistant", tags=["Voice Assistant"])


@router.get("/options", response_model=VoiceOptionsResponse)
async def get_voice_options():
    """Get available options for voice assistant configuration."""
    providers = [
        {
            "id": ModelProvider.OPENAI.value,
            "name": "OpenAI",
            "models": [
                {"id": ModelName.GPT_4O.value, "name": "GPT-4o", "description": "Most capable model"},
                {"id": ModelName.GPT_4O_MINI.value, "name": "GPT-4o Mini", "description": "Fast and efficient"},
                {"id": ModelName.GPT_4_TURBO.value, "name": "GPT-4 Turbo", "description": "High performance"},
            ]
        },
        {
            "id": ModelProvider.ANTHROPIC.value,
            "name": "Anthropic",
            "models": [
                {"id": ModelName.CLAUDE_3_5_SONNET.value, "name": "Claude 3.5 Sonnet", "description": "Best balance"},
                {"id": ModelName.CLAUDE_3_OPUS.value, "name": "Claude 3 Opus", "description": "Most powerful"},
                {"id": ModelName.CLAUDE_3_HAIKU.value, "name": "Claude 3 Haiku", "description": "Fastest"},
            ]
        },
        {
            "id": ModelProvider.GOOGLE.value,
            "name": "Google",
            "models": [
                {"id": ModelName.GEMINI_PRO.value, "name": "Gemini Pro", "description": "General purpose"},
                {"id": ModelName.GEMINI_PRO_VISION.value, "name": "Gemini Pro Vision", "description": "Multimodal"},
            ]
        },
        {
            "id": ModelProvider.GROQ.value,
            "name": "Groq",
            "models": [
                {"id": ModelName.LLAMA_3_70B.value, "name": "Llama 3 70B", "description": "Open source powerhouse"},
                {"id": ModelName.MIXTRAL_8X7B.value, "name": "Mixtral 8x7B", "description": "Fast MoE model"},
            ]
        },
    ]
    
    voices = [
        {"id": voice.value, "name": voice.value.title(), "gender": "female" if voice.value in ["rachel", "domi", "bella", "elli", "nicole", "glinda", "charlotte", "matilda", "lily"] else "male"}
        for voice in ElevenLabsVoice
    ]
    
    return VoiceOptionsResponse(providers=providers, voices=voices)


@router.post("/{business_id}", response_model=VoiceAssistantResponse, status_code=status.HTTP_201_CREATED)
async def create_voice_assistant(business_id: str, assistant: VoiceAssistantCreate):
    """Create a voice assistant for a business."""
    # Validate business exists
    business = db.get_business(business_id)
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Business with ID {business_id} not found"
        )
    
    # Check if business already has a voice assistant
    existing = db.get_voice_assistant(business_id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Business already has a voice assistant. Use PATCH to update."
        )
    
    assistant_data = assistant.model_dump()
    # Convert enums to string values for storage
    assistant_data["model_provider"] = assistant_data["model_provider"].value
    assistant_data["model_name"] = assistant_data["model_name"].value
    assistant_data["voice"] = assistant_data["voice"].value
    
    created = db.create_voice_assistant(business_id, assistant_data)
    return VoiceAssistantResponse(**created)


@router.get("/{business_id}", response_model=VoiceAssistantResponse)
async def get_voice_assistant(business_id: str):
    """Get the voice assistant for a business."""
    # Validate business exists
    business = db.get_business(business_id)
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Business with ID {business_id} not found"
        )
    
    assistant = db.get_voice_assistant(business_id)
    if not assistant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No voice assistant found for business {business_id}"
        )
    
    return VoiceAssistantResponse(**assistant)


@router.patch("/{business_id}", response_model=VoiceAssistantResponse)
async def update_voice_assistant(business_id: str, update: VoiceAssistantUpdate):
    """Update a voice assistant."""
    # Validate business exists
    business = db.get_business(business_id)
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Business with ID {business_id} not found"
        )
    
    existing = db.get_voice_assistant(business_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No voice assistant found for business {business_id}"
        )
    
    update_data = update.model_dump(exclude_unset=True)
    
    # Convert enums to string values for storage
    if "model_provider" in update_data and update_data["model_provider"]:
        update_data["model_provider"] = update_data["model_provider"].value
    if "model_name" in update_data and update_data["model_name"]:
        update_data["model_name"] = update_data["model_name"].value
    if "voice" in update_data and update_data["voice"]:
        update_data["voice"] = update_data["voice"].value
    
    updated = db.update_voice_assistant(business_id, update_data)
    return VoiceAssistantResponse(**updated)

