"""Configuration API routes for dynamic form data."""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from ..models.voice_assistant import ModelProvider, ModelName, ElevenLabsVoice

router = APIRouter(prefix="/config", tags=["Configuration"])


class FieldConfig(BaseModel):
    """Configuration for a form field."""
    name: str
    label: str
    placeholder: str
    required: bool
    type: str  # text, textarea, select, number
    max_length: Optional[int] = None
    min_value: Optional[int] = None
    max_value: Optional[int] = None
    options: Optional[List[dict]] = None


class StepConfig(BaseModel):
    """Configuration for an onboarding step."""
    id: int
    title: str
    description: str
    icon: str


class ModelConfig(BaseModel):
    """Model configuration."""
    id: str
    name: str
    description: str


class ProviderConfig(BaseModel):
    """Provider configuration with models."""
    id: str
    name: str
    models: List[ModelConfig]


class VoiceConfig(BaseModel):
    """Voice configuration."""
    id: str
    name: str
    gender: str
    accent: str


class DurationPreset(BaseModel):
    """Duration preset configuration."""
    value: int
    label: str


class CountryConfig(BaseModel):
    """Country configuration."""
    code: str
    name: str
    flag: str


class NumberTypeConfig(BaseModel):
    """Number type configuration."""
    id: str
    name: str
    description: str


class FileTypeConfig(BaseModel):
    """File type configuration."""
    extension: str
    label: str
    icon: str
    mimeTypes: List[str]


class OnboardingConfigResponse(BaseModel):
    """Complete onboarding configuration response."""
    steps: List[StepConfig]
    business: dict
    knowledgeBase: dict
    phoneNumber: dict
    voiceAssistant: dict


@router.get("/onboarding", response_model=OnboardingConfigResponse)
async def get_onboarding_config():
    """Get all configuration needed for the onboarding flow."""
    
    # Steps configuration
    steps = [
        StepConfig(id=1, title="Business Info", description="Company details", icon="building"),
        StepConfig(id=2, title="Knowledge Base", description="Upload documents", icon="document"),
        StepConfig(id=3, title="Phone Number", description="Select a number", icon="phone"),
        StepConfig(id=4, title="Voice Assistant", description="Configure AI", icon="microphone"),
    ]
    
    # Business registration configuration
    business_config = {
        "title": "Business Information",
        "subtitle": "Tell us about your company to personalize your voice assistant",
        "fields": [
            {
                "name": "name",
                "label": "Business Name",
                "placeholder": "Enter your company name",
                "required": True,
                "type": "text",
                "maxLength": 255,
            },
            {
                "name": "description",
                "label": "Description",
                "placeholder": "Briefly describe what your company does (optional)",
                "required": False,
                "type": "textarea",
                "maxLength": 2000,
            },
        ],
        "api": {
            "endpoint": "/api/v1/business",
        },
    }
    
    # Knowledge base configuration
    knowledge_base_config = {
        "title": "Knowledge Base",
        "subtitle": "Upload documents to train your voice assistant with your business knowledge",
        "maxFileSize": 50 * 1024 * 1024,  # 50MB
        "maxFiles": 10,
        "acceptedFileTypes": [
            {"extension": ".pdf", "label": "PDF Document", "icon": "📄", "mimeTypes": ["application/pdf"]},
            {"extension": ".csv", "label": "CSV Spreadsheet", "icon": "📊", "mimeTypes": ["text/csv"]},
            {"extension": ".txt", "label": "Text File", "icon": "📝", "mimeTypes": ["text/plain"]},
            {"extension": ".docx", "label": "Word Document", "icon": "📃", "mimeTypes": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"]},
            {"extension": ".doc", "label": "Word Document", "icon": "📃", "mimeTypes": ["application/msword"]},
        ],
        "api": {
            "uploadEndpoint": "/api/v1/knowledge-base/upload",
            "listEndpoint": "/api/v1/knowledge-base",
            "deleteEndpoint": "/api/v1/knowledge-base",
        },
    }
    
    # Phone number configuration - USA only
    phone_number_config = {
        "title": "Select Phone Number",
        "subtitle": "Choose a US phone number for your voice assistant to receive calls",
        "pricePerNumber": 5.00,
        "countries": [
            {"code": "US", "name": "United States", "flag": "🇺🇸"},
        ],
        "numberTypes": [
            {"id": "local", "name": "Local", "description": "Local presence in your area"},
        ],
        "api": {
            "searchEndpoint": "/api/v1/phone-numbers/available",
            "purchaseEndpoint": "/api/v1/phone-numbers/purchase",
            "listEndpoint": "/api/v1/phone-numbers",
        },
    }
    
    # Voice assistant configuration
    voice_assistant_config = {
        "title": "Configure Voice Assistant",
        "subtitle": "Set up how your AI assistant will interact with callers",
        "providers": [
            {
                "id": "openai",
                "name": "OpenAI",
                "models": [
                    {"id": "gpt-4o", "name": "GPT-4o", "description": "Most capable model"},
                    {"id": "gpt-4o-mini", "name": "GPT-4o Mini", "description": "Fast and efficient"},
                    {"id": "gpt-4-turbo", "name": "GPT-4 Turbo", "description": "High performance"},
                ],
            },
            {
                "id": "anthropic",
                "name": "Anthropic",
                "models": [
                    {"id": "claude-3-5-sonnet-20241022", "name": "Claude 3.5 Sonnet", "description": "Best balance"},
                    {"id": "claude-3-opus-20240229", "name": "Claude 3 Opus", "description": "Most powerful"},
                    {"id": "claude-3-haiku-20240307", "name": "Claude 3 Haiku", "description": "Fastest"},
                ],
            },
            {
                "id": "google",
                "name": "Google",
                "models": [
                    {"id": "gemini-pro", "name": "Gemini Pro", "description": "General purpose"},
                    {"id": "gemini-pro-vision", "name": "Gemini Pro Vision", "description": "Multimodal"},
                ],
            },
            {
                "id": "groq",
                "name": "Groq",
                "models": [
                    {"id": "llama-3-70b", "name": "Llama 3 70B", "description": "Open source powerhouse"},
                    {"id": "mixtral-8x7b", "name": "Mixtral 8x7B", "description": "Fast MoE model"},
                ],
            },
        ],
        "voices": [
            {"id": "rachel", "name": "Rachel", "gender": "female", "accent": "American"},
            {"id": "domi", "name": "Domi", "gender": "female", "accent": "American"},
            {"id": "bella", "name": "Bella", "gender": "female", "accent": "American"},
            {"id": "antoni", "name": "Antoni", "gender": "male", "accent": "American"},
            {"id": "elli", "name": "Elli", "gender": "female", "accent": "American"},
            {"id": "josh", "name": "Josh", "gender": "male", "accent": "American"},
            {"id": "arnold", "name": "Arnold", "gender": "male", "accent": "American"},
            {"id": "adam", "name": "Adam", "gender": "male", "accent": "American"},
            {"id": "sam", "name": "Sam", "gender": "male", "accent": "American"},
            {"id": "nicole", "name": "Nicole", "gender": "female", "accent": "American"},
            {"id": "glinda", "name": "Glinda", "gender": "female", "accent": "American"},
            {"id": "clyde", "name": "Clyde", "gender": "male", "accent": "American"},
            {"id": "paul", "name": "Paul", "gender": "male", "accent": "American"},
            {"id": "callum", "name": "Callum", "gender": "male", "accent": "British"},
            {"id": "charlotte", "name": "Charlotte", "gender": "female", "accent": "British"},
            {"id": "matilda", "name": "Matilda", "gender": "female", "accent": "Australian"},
            {"id": "lily", "name": "Lily", "gender": "female", "accent": "British"},
        ],
        "durationPresets": [
            {"value": 60, "label": "1 min"},
            {"value": 120, "label": "2 min"},
            {"value": 300, "label": "5 min"},
            {"value": 600, "label": "10 min"},
            {"value": 900, "label": "15 min"},
            {"value": 1800, "label": "30 min"},
            {"value": 3600, "label": "60 min"},
        ],
        "defaults": {
            "systemPrompt": """You are a helpful AI assistant for {business_name}. Your role is to:
- Answer questions about our products and services
- Help customers with their inquiries
- Provide accurate information based on the knowledge base
- Be professional, friendly, and concise

Always maintain a helpful and professional tone.""",
            "firstMessage": "Hello! Thank you for calling. How can I assist you today?",
            "endCallMessage": "Thank you for calling. Have a great day!",
            "maxCallDurationSeconds": 300,
        },
        "api": {
            "endpoint": "/api/v1/voice-assistant",
            "completeEndpoint": "/api/v1/onboarding/complete",
        },
    }
    
    return OnboardingConfigResponse(
        steps=steps,
        business=business_config,
        knowledgeBase=knowledge_base_config,
        phoneNumber=phone_number_config,
        voiceAssistant=voice_assistant_config,
    )

