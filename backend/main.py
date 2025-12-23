"""FastAPI application entry point for Voice AI SaaS."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routes import (
    business_router,
    knowledge_base_router,
    phone_numbers_router,
    voice_assistant_router,
    onboarding_router,
)

# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    description="Voice AI SaaS - AI-powered voice agents for modern business",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(business_router, prefix=settings.api_v1_prefix)
app.include_router(knowledge_base_router, prefix=settings.api_v1_prefix)
app.include_router(phone_numbers_router, prefix=settings.api_v1_prefix)
app.include_router(voice_assistant_router, prefix=settings.api_v1_prefix)
app.include_router(onboarding_router, prefix=settings.api_v1_prefix)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to Voice AI SaaS API",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

