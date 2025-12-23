"""Knowledge base related Pydantic models."""

from pydantic import BaseModel, Field
from typing import List, Optional


class KnowledgeBaseFileResponse(BaseModel):
    """Model for a single knowledge base file."""
    
    id: str
    business_id: str
    filename: str
    file_type: str
    file_size: int  # in bytes
    uploaded_at: str
    
    class Config:
        from_attributes = True


class KnowledgeBaseUploadResponse(BaseModel):
    """Model for knowledge base upload response."""
    
    message: str
    files: List[KnowledgeBaseFileResponse]
    total_files: int


class KnowledgeBaseDeleteResponse(BaseModel):
    """Model for knowledge base delete response."""
    
    message: str
    deleted_file_id: str

