"""Voice assistant related Pydantic models."""

from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class ModelProvider(str, Enum):
    """Available model providers."""
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GOOGLE = "google"
    GROQ = "groq"


class ModelName(str, Enum):
    """Available model names."""
    # OpenAI
    GPT_4O = "gpt-4o"
    GPT_4O_MINI = "gpt-4o-mini"
    GPT_4_TURBO = "gpt-4-turbo"
    # Anthropic
    CLAUDE_3_5_SONNET = "claude-3-5-sonnet-20241022"
    CLAUDE_3_OPUS = "claude-3-opus-20240229"
    CLAUDE_3_HAIKU = "claude-3-haiku-20240307"
    # Google
    GEMINI_PRO = "gemini-pro"
    GEMINI_PRO_VISION = "gemini-pro-vision"
    # Groq
    LLAMA_3_70B = "llama-3-70b"
    MIXTRAL_8X7B = "mixtral-8x7b"


class ElevenLabsVoice(str, Enum):
    """Available ElevenLabs voices."""
    RACHEL = "rachel"
    DOMI = "domi"
    BELLA = "bella"
    ANTONI = "antoni"
    ELLI = "elli"
    JOSH = "josh"
    ARNOLD = "arnold"
    ADAM = "adam"
    SAM = "sam"
    NICOLE = "nicole"
    GLINDA = "glinda"
    CLYDE = "clyde"
    PAUL = "paul"
    CALLUM = "callum"
    CHARLOTTE = "charlotte"
    MATILDA = "matilda"
    LILY = "lily"


class VoiceAssistantCreate(BaseModel):
    """Model for creating a voice assistant."""
    
    name: str = Field(..., min_length=1, max_length=100, description="Assistant name")
    first_message: str = Field(..., min_length=1, max_length=500, description="First message to greet callers")
    system_prompt: str = Field(..., min_length=1, max_length=4000, description="System prompt for the AI")
    model_provider: ModelProvider = Field(..., description="AI model provider")
    model_name: ModelName = Field(..., description="Specific model to use")
    voice: ElevenLabsVoice = Field(..., description="ElevenLabs voice to use")
    end_call_message: str = Field(..., min_length=1, max_length=500, description="Message before ending call")
    max_call_duration_seconds: int = Field(..., ge=30, le=3600, description="Maximum call duration in seconds")
    phone_number_id: Optional[str] = Field(None, description="ID of phone number for inbound calls")


class VoiceAssistantUpdate(BaseModel):
    """Model for updating a voice assistant."""
    
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    first_message: Optional[str] = Field(None, min_length=1, max_length=500)
    system_prompt: Optional[str] = Field(None, min_length=1, max_length=4000)
    model_provider: Optional[ModelProvider] = None
    model_name: Optional[ModelName] = None
    voice: Optional[ElevenLabsVoice] = None
    end_call_message: Optional[str] = Field(None, min_length=1, max_length=500)
    max_call_duration_seconds: Optional[int] = Field(None, ge=30, le=3600)
    phone_number_id: Optional[str] = Field(None, description="ID of phone number for inbound calls")


class VoiceAssistantResponse(BaseModel):
    """Model for voice assistant response."""
    
    id: str
    business_id: str
    name: str
    first_message: str
    system_prompt: str
    model_provider: str
    model_name: str
    voice: str
    end_call_message: str
    max_call_duration_seconds: int
    phone_number_id: Optional[str] = None
    created_at: str
    updated_at: str
    
    class Config:
        from_attributes = True


class VoiceOptionsResponse(BaseModel):
    """Response model for available voice options."""
    
    providers: List[dict]
    voices: List[dict]

