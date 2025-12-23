"""In-memory database for development. Replace with actual database in production."""

from typing import Dict, List, Optional
from datetime import datetime
import uuid


class InMemoryDB:
    """Simple in-memory storage for development purposes."""
    
    def __init__(self):
        self.businesses: Dict[str, dict] = {}
        self.knowledge_bases: Dict[str, List[dict]] = {}
        self.phone_numbers: Dict[str, dict] = {}
        self.voice_assistants: Dict[str, dict] = {}
        self.onboarding_sessions: Dict[str, dict] = {}
    
    def generate_id(self) -> str:
        """Generate a unique ID."""
        return str(uuid.uuid4())
    
    # Business operations
    def create_business(self, data: dict) -> dict:
        """Create a new business record."""
        business_id = self.generate_id()
        business = {
            "id": business_id,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
            **data
        }
        self.businesses[business_id] = business
        return business
    
    def get_business(self, business_id: str) -> Optional[dict]:
        """Get a business by ID."""
        return self.businesses.get(business_id)
    
    def update_business(self, business_id: str, data: dict) -> Optional[dict]:
        """Update a business record."""
        if business_id in self.businesses:
            self.businesses[business_id].update(data)
            self.businesses[business_id]["updated_at"] = datetime.utcnow().isoformat()
            return self.businesses[business_id]
        return None
    
    # Knowledge base operations
    def add_knowledge_base_file(self, business_id: str, file_data: dict) -> dict:
        """Add a file to a business's knowledge base."""
        if business_id not in self.knowledge_bases:
            self.knowledge_bases[business_id] = []
        
        file_record = {
            "id": self.generate_id(),
            "business_id": business_id,
            "uploaded_at": datetime.utcnow().isoformat(),
            **file_data
        }
        self.knowledge_bases[business_id].append(file_record)
        return file_record
    
    def get_knowledge_base_files(self, business_id: str) -> List[dict]:
        """Get all files for a business's knowledge base."""
        return self.knowledge_bases.get(business_id, [])
    
    def delete_knowledge_base_file(self, business_id: str, file_id: str) -> bool:
        """Delete a file from a business's knowledge base."""
        if business_id in self.knowledge_bases:
            files = self.knowledge_bases[business_id]
            self.knowledge_bases[business_id] = [f for f in files if f["id"] != file_id]
            return True
        return False
    
    # Phone number operations
    def assign_phone_number(self, business_id: str, phone_data: dict) -> dict:
        """Assign a phone number to a business."""
        phone_record = {
            "id": self.generate_id(),
            "business_id": business_id,
            "purchased_at": datetime.utcnow().isoformat(),
            **phone_data
        }
        self.phone_numbers[business_id] = phone_record
        return phone_record
    
    def get_phone_number(self, business_id: str) -> Optional[dict]:
        """Get the phone number assigned to a business."""
        return self.phone_numbers.get(business_id)
    
    # Voice assistant operations
    def create_voice_assistant(self, business_id: str, assistant_data: dict) -> dict:
        """Create a voice assistant for a business."""
        assistant = {
            "id": self.generate_id(),
            "business_id": business_id,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
            **assistant_data
        }
        self.voice_assistants[business_id] = assistant
        return assistant
    
    def get_voice_assistant(self, business_id: str) -> Optional[dict]:
        """Get the voice assistant for a business."""
        return self.voice_assistants.get(business_id)
    
    def update_voice_assistant(self, business_id: str, data: dict) -> Optional[dict]:
        """Update a voice assistant."""
        if business_id in self.voice_assistants:
            self.voice_assistants[business_id].update(data)
            self.voice_assistants[business_id]["updated_at"] = datetime.utcnow().isoformat()
            return self.voice_assistants[business_id]
        return None
    
    # Onboarding session operations
    def create_onboarding_session(self) -> dict:
        """Create a new onboarding session."""
        session_id = self.generate_id()
        session = {
            "id": session_id,
            "created_at": datetime.utcnow().isoformat(),
            "current_step": 1,
            "business_id": None,
            "completed": False
        }
        self.onboarding_sessions[session_id] = session
        return session
    
    def get_onboarding_session(self, session_id: str) -> Optional[dict]:
        """Get an onboarding session."""
        return self.onboarding_sessions.get(session_id)
    
    def update_onboarding_session(self, session_id: str, data: dict) -> Optional[dict]:
        """Update an onboarding session."""
        if session_id in self.onboarding_sessions:
            self.onboarding_sessions[session_id].update(data)
            return self.onboarding_sessions[session_id]
        return None


# Global database instance
db = InMemoryDB()

