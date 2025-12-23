"""Twilio service for phone number management."""

from typing import List, Optional
from ..config import settings
from ..models.phone_number import PhoneNumberAvailable, PhoneNumberType


class TwilioService:
    """Service for interacting with Twilio API."""
    
    def __init__(self):
        self.account_sid = settings.twilio_account_sid
        self.auth_token = settings.twilio_auth_token
        self._client = None
    
    @property
    def client(self):
        """Lazy load Twilio client."""
        if self._client is None and self.account_sid and self.auth_token:
            try:
                from twilio.rest import Client
                self._client = Client(self.account_sid, self.auth_token)
            except ImportError:
                pass
        return self._client
    
    async def search_available_numbers(
        self,
        country_code: str = "US",
        area_code: Optional[str] = None,
        number_type: PhoneNumberType = PhoneNumberType.LOCAL,
        contains: Optional[str] = None,
        limit: int = 20,
    ) -> List[PhoneNumberAvailable]:
        """Search for available phone numbers."""
        
        # If Twilio is not configured, return mock data
        if not self.client:
            return self._get_mock_numbers(country_code, area_code, number_type, limit)
        
        try:
            # Build search parameters
            search_params = {
                "limit": limit,
            }
            
            if area_code:
                search_params["area_code"] = area_code
            if contains:
                search_params["contains"] = contains
            
            # Get available numbers based on type
            if number_type == PhoneNumberType.LOCAL:
                numbers = self.client.available_phone_numbers(country_code).local.list(**search_params)
            elif number_type == PhoneNumberType.TOLL_FREE:
                numbers = self.client.available_phone_numbers(country_code).toll_free.list(**search_params)
            elif number_type == PhoneNumberType.MOBILE:
                numbers = self.client.available_phone_numbers(country_code).mobile.list(**search_params)
            else:
                numbers = self.client.available_phone_numbers(country_code).local.list(**search_params)
            
            return [
                PhoneNumberAvailable(
                    phone_number=n.phone_number,
                    friendly_name=n.friendly_name,
                    locality=getattr(n, 'locality', None),
                    region=getattr(n, 'region', None),
                    country_code=country_code,
                    capabilities={
                        "voice": getattr(n.capabilities, 'voice', True),
                        "sms": getattr(n.capabilities, 'sms', True),
                        "mms": getattr(n.capabilities, 'mms', False),
                    },
                    price_monthly=1.15,  # Default Twilio price
                    number_type=number_type,
                )
                for n in numbers
            ]
        except Exception as e:
            print(f"Twilio API error: {e}")
            return self._get_mock_numbers(country_code, area_code, number_type, limit)
    
    def _get_mock_numbers(
        self,
        country_code: str,
        area_code: Optional[str],
        number_type: PhoneNumberType,
        limit: int,
    ) -> List[PhoneNumberAvailable]:
        """Return mock phone numbers for development."""
        area_codes = ["415", "650", "408", "510", "925", "707", "831", "209", "559", "661"]
        if area_code:
            area_codes = [area_code]
        
        mock_numbers = []
        for i in range(min(limit, 20)):
            ac = area_codes[i % len(area_codes)]
            mock_numbers.append(
                PhoneNumberAvailable(
                    phone_number=f"+1{ac}555{str(i).zfill(4)}",
                    friendly_name=f"({ac}) 555-{str(i).zfill(4)}",
                    locality="San Francisco" if ac == "415" else "California",
                    region="CA",
                    country_code=country_code,
                    capabilities={"voice": True, "sms": True, "mms": False},
                    price_monthly=1.15,
                    number_type=number_type,
                )
            )
        return mock_numbers
    
    async def purchase_number(
        self,
        phone_number: str,
        friendly_name: Optional[str] = None,
    ) -> dict:
        """Purchase a phone number."""
        
        # If Twilio is not configured, return mock data
        if not self.client:
            return {
                "phone_number": phone_number,
                "friendly_name": friendly_name or phone_number,
                "sid": f"PN_MOCK_{phone_number.replace('+', '')}",
                "status": "active",
            }
        
        try:
            # Purchase the number
            incoming_phone_number = self.client.incoming_phone_numbers.create(
                phone_number=phone_number,
                friendly_name=friendly_name,
            )
            
            return {
                "phone_number": incoming_phone_number.phone_number,
                "friendly_name": incoming_phone_number.friendly_name,
                "sid": incoming_phone_number.sid,
                "status": "active",
            }
        except Exception as e:
            print(f"Twilio purchase error: {e}")
            # Return mock data on error
            return {
                "phone_number": phone_number,
                "friendly_name": friendly_name or phone_number,
                "sid": f"PN_MOCK_{phone_number.replace('+', '')}",
                "status": "active",
            }
    
    async def release_number(self, sid: str) -> bool:
        """Release a phone number."""
        if not self.client:
            return True
        
        try:
            self.client.incoming_phone_numbers(sid).delete()
            return True
        except Exception as e:
            print(f"Twilio release error: {e}")
            return False


# Global service instance
twilio_service = TwilioService()

