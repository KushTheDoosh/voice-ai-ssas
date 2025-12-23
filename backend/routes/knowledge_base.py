"""Knowledge base related API routes."""

import os
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, status
from typing import List
from ..models.knowledge_base import (
    KnowledgeBaseFileResponse,
    KnowledgeBaseUploadResponse,
    KnowledgeBaseDeleteResponse,
)
from ..database import db
from ..config import settings
from ..services.storage_service import storage_service

router = APIRouter(prefix="/knowledge-base", tags=["Knowledge Base"])


@router.post("/upload/{business_id}", response_model=KnowledgeBaseUploadResponse)
async def upload_files(
    business_id: str,
    files: List[UploadFile] = File(...),
):
    """Upload files to a business's knowledge base."""
    # Validate business exists
    business = db.get_business(business_id)
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Business with ID {business_id} not found"
        )
    
    uploaded_files = []
    
    for file in files:
        # Validate file type
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in settings.allowed_file_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type {file_ext} not allowed. Allowed types: {settings.allowed_file_types}"
            )
        
        # Read file content
        content = await file.read()
        file_size = len(content)
        
        # Validate file size
        if file_size > settings.max_file_size_mb * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File {file.filename} exceeds maximum size of {settings.max_file_size_mb}MB"
            )
        
        # Save file using storage service
        saved_path = await storage_service.save_file(
            business_id=business_id,
            filename=file.filename,
            content=content
        )
        
        # Create database record
        file_data = {
            "filename": file.filename,
            "file_type": file_ext,
            "file_size": file_size,
            "storage_path": saved_path,
        }
        file_record = db.add_knowledge_base_file(business_id, file_data)
        uploaded_files.append(KnowledgeBaseFileResponse(**file_record))
    
    return KnowledgeBaseUploadResponse(
        message=f"Successfully uploaded {len(uploaded_files)} file(s)",
        files=uploaded_files,
        total_files=len(uploaded_files)
    )


@router.get("/{business_id}", response_model=List[KnowledgeBaseFileResponse])
async def get_knowledge_base_files(business_id: str):
    """Get all files in a business's knowledge base."""
    # Validate business exists
    business = db.get_business(business_id)
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Business with ID {business_id} not found"
        )
    
    files = db.get_knowledge_base_files(business_id)
    return [KnowledgeBaseFileResponse(**f) for f in files]


@router.delete("/{business_id}/{file_id}", response_model=KnowledgeBaseDeleteResponse)
async def delete_file(business_id: str, file_id: str):
    """Delete a file from a business's knowledge base."""
    # Validate business exists
    business = db.get_business(business_id)
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Business with ID {business_id} not found"
        )
    
    # Find the file
    files = db.get_knowledge_base_files(business_id)
    file_record = next((f for f in files if f["id"] == file_id), None)
    
    if not file_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"File with ID {file_id} not found"
        )
    
    # Delete from storage
    await storage_service.delete_file(file_record.get("storage_path", ""))
    
    # Delete from database
    db.delete_knowledge_base_file(business_id, file_id)
    
    return KnowledgeBaseDeleteResponse(
        message="File deleted successfully",
        deleted_file_id=file_id
    )

