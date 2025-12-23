"""API routes for the Voice AI SaaS backend."""

from .business import router as business_router
from .knowledge_base import router as knowledge_base_router
from .phone_numbers import router as phone_numbers_router
from .voice_assistant import router as voice_assistant_router
from .onboarding import router as onboarding_router

__all__ = [
    "business_router",
    "knowledge_base_router",
    "phone_numbers_router",
    "voice_assistant_router",
    "onboarding_router",
]

