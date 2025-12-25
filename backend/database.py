"""In-memory database for development. Replace with actual database in production."""

from typing import Dict, List, Optional
from datetime import datetime
import uuid


class InMemoryDB:
    """Simple in-memory storage for development purposes."""
    
    def __init__(self):
        self.businesses: Dict[str, dict] = {}
        self.knowledge_bases: Dict[str, List[dict]] = {}
        self.phone_numbers: Dict[str, List[dict]] = {}  # Changed to List for multiple numbers
        self.voice_assistants: Dict[str, List[dict]] = {}  # Changed to List for multiple assistants
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
    
    def get_all_businesses(self) -> List[dict]:
        """Get all businesses."""
        return list(self.businesses.values())
    
    def update_business(self, business_id: str, data: dict) -> Optional[dict]:
        """Update a business record."""
        if business_id in self.businesses:
            self.businesses[business_id].update(data)
            self.businesses[business_id]["updated_at"] = datetime.utcnow().isoformat()
            return self.businesses[business_id]
        return None
    
    def delete_business(self, business_id: str) -> bool:
        """Delete a business and all associated data (cascade delete)."""
        if business_id not in self.businesses:
            return False
        
        # Delete all associated data
        if business_id in self.knowledge_bases:
            del self.knowledge_bases[business_id]
        
        if business_id in self.phone_numbers:
            del self.phone_numbers[business_id]
        
        if business_id in self.voice_assistants:
            del self.voice_assistants[business_id]
        
        # Delete the business itself
        del self.businesses[business_id]
        return True
    
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
    
    # Phone number operations - Updated to support multiple numbers
    def add_phone_number(self, business_id: str, phone_data: dict) -> dict:
        """Add a phone number to a business."""
        if business_id not in self.phone_numbers:
            self.phone_numbers[business_id] = []
        
        phone_record = {
            "id": self.generate_id(),
            "business_id": business_id,
            "purchased_at": datetime.utcnow().isoformat(),
            **phone_data
        }
        self.phone_numbers[business_id].append(phone_record)
        return phone_record
    
    def get_phone_numbers(self, business_id: str) -> List[dict]:
        """Get all phone numbers for a business."""
        return self.phone_numbers.get(business_id, [])
    
    def get_phone_number_by_id(self, business_id: str, phone_id: str) -> Optional[dict]:
        """Get a specific phone number by ID."""
        numbers = self.phone_numbers.get(business_id, [])
        return next((n for n in numbers if n["id"] == phone_id), None)
    
    def delete_phone_number(self, business_id: str, phone_id: str) -> bool:
        """Delete a phone number from a business."""
        if business_id in self.phone_numbers:
            numbers = self.phone_numbers[business_id]
            self.phone_numbers[business_id] = [n for n in numbers if n["id"] != phone_id]
            return True
        return False
    
    # Legacy method for backward compatibility
    def assign_phone_number(self, business_id: str, phone_data: dict) -> dict:
        """Assign a phone number to a business (legacy - adds to list)."""
        return self.add_phone_number(business_id, phone_data)
    
    def get_phone_number(self, business_id: str) -> Optional[dict]:
        """Get the first phone number for a business (legacy compatibility)."""
        numbers = self.get_phone_numbers(business_id)
        return numbers[0] if numbers else None
    
    # Voice assistant operations - Updated to support multiple assistants
    def create_voice_assistant(self, business_id: str, assistant_data: dict) -> dict:
        """Create a voice assistant for a business."""
        if business_id not in self.voice_assistants:
            self.voice_assistants[business_id] = []
        
        assistant = {
            "id": self.generate_id(),
            "business_id": business_id,
            "phone_number_id": assistant_data.get("phone_number_id"),  # Link to inbound phone number
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
            **assistant_data
        }
        self.voice_assistants[business_id].append(assistant)
        return assistant
    
    def get_voice_assistants(self, business_id: str) -> List[dict]:
        """Get all voice assistants for a business."""
        return self.voice_assistants.get(business_id, [])
    
    def get_voice_assistant_by_id(self, business_id: str, assistant_id: str) -> Optional[dict]:
        """Get a specific voice assistant by ID."""
        assistants = self.voice_assistants.get(business_id, [])
        return next((a for a in assistants if a["id"] == assistant_id), None)
    
    def get_voice_assistant(self, business_id: str) -> Optional[dict]:
        """Get the first voice assistant for a business (legacy compatibility)."""
        assistants = self.get_voice_assistants(business_id)
        return assistants[0] if assistants else None
    
    def update_voice_assistant(self, business_id: str, assistant_id: str, data: dict) -> Optional[dict]:
        """Update a specific voice assistant."""
        if business_id in self.voice_assistants:
            for i, assistant in enumerate(self.voice_assistants[business_id]):
                if assistant["id"] == assistant_id:
                    self.voice_assistants[business_id][i].update(data)
                    self.voice_assistants[business_id][i]["updated_at"] = datetime.utcnow().isoformat()
                    return self.voice_assistants[business_id][i]
        return None
    
    def delete_voice_assistant(self, business_id: str, assistant_id: str) -> bool:
        """Delete a voice assistant from a business."""
        if business_id in self.voice_assistants:
            assistants = self.voice_assistants[business_id]
            self.voice_assistants[business_id] = [a for a in assistants if a["id"] != assistant_id]
            return True
        return False
    
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
