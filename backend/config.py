"""Configuration settings for the Voice AI SaaS backend."""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    app_name: str = "Voice AI SaaS"
    debug: bool = True
    api_v1_prefix: str = "/api/v1"
    
    # CORS
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:3001"]
    
    # Twilio Configuration
    twilio_account_sid: Optional[str] = None
    twilio_auth_token: Optional[str] = None
    
    # ElevenLabs Configuration
    elevenlabs_api_key: Optional[str] = None
    
    # File Upload
    upload_dir: str = "uploads"
    max_file_size_mb: int = 50
    allowed_file_types: list[str] = [".pdf", ".csv", ".txt", ".docx", ".doc"]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()

