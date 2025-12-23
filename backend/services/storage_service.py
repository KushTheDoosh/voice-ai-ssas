"""Storage service for file management."""

import os
import aiofiles
from pathlib import Path
from typing import Optional
from ..config import settings


class StorageService:
    """Service for managing file storage."""
    
    def __init__(self):
        self.upload_dir = Path(settings.upload_dir)
    
    def _ensure_dir(self, path: Path) -> None:
        """Ensure a directory exists."""
        path.mkdir(parents=True, exist_ok=True)
    
    def _get_business_dir(self, business_id: str) -> Path:
        """Get the storage directory for a business."""
        return self.upload_dir / business_id
    
    async def save_file(
        self,
        business_id: str,
        filename: str,
        content: bytes,
    ) -> str:
        """Save a file to storage and return the storage path."""
        business_dir = self._get_business_dir(business_id)
        self._ensure_dir(business_dir)
        
        # Create unique filename to avoid collisions
        base_name = Path(filename).stem
        extension = Path(filename).suffix
        
        # Check for existing file with same name
        target_path = business_dir / filename
        counter = 1
        while target_path.exists():
            target_path = business_dir / f"{base_name}_{counter}{extension}"
            counter += 1
        
        # Save file
        async with aiofiles.open(target_path, 'wb') as f:
            await f.write(content)
        
        return str(target_path)
    
    async def read_file(self, file_path: str) -> Optional[bytes]:
        """Read a file from storage."""
        path = Path(file_path)
        if not path.exists():
            return None
        
        async with aiofiles.open(path, 'rb') as f:
            return await f.read()
    
    async def delete_file(self, file_path: str) -> bool:
        """Delete a file from storage."""
        path = Path(file_path)
        if path.exists():
            try:
                os.remove(path)
                return True
            except Exception:
                return False
        return False
    
    async def list_files(self, business_id: str) -> list:
        """List all files for a business."""
        business_dir = self._get_business_dir(business_id)
        if not business_dir.exists():
            return []
        
        return [
            {
                "filename": f.name,
                "path": str(f),
                "size": f.stat().st_size,
            }
            for f in business_dir.iterdir()
            if f.is_file()
        ]


# Global service instance
storage_service = StorageService()

