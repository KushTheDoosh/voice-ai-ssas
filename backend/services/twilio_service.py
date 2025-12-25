"""Twilio service for phone number management."""

import logging
from typing import List, Optional
from ..config import settings
from ..models.phone_number import PhoneNumberAvailable, PhoneNumberType

logger = logging.getLogger(__name__)


class TwilioService:
    """Service for interacting with Twilio API."""
    
    # Fixed price per number (our pricing, not Twilio's)
    PRICE_PER_NUMBER = 5.00
    
    def __init__(self):
        self.account_sid = settings.twilio_account_sid
        self.auth_token = settings.twilio_auth_token
        self._client = None
        self._initialized = False
    
    @property
    def client(self):
        """Lazy load Twilio client."""
        if not self._initialized:
            self._initialized = True
            if self.account_sid and self.auth_token:
                try:
                    from twilio.rest import Client
                    self._client = Client(self.account_sid, self.auth_token)
                    logger.info("Twilio client initialized successfully")
                except ImportError:
                    logger.warning("Twilio package not installed. Using mock data.")
                except Exception as e:
                    logger.error(f"Failed to initialize Twilio client: {e}")
            else:
                logger.info("Twilio credentials not configured. Using mock data.")
        return self._client
    
    @property
    def is_configured(self) -> bool:
        """Check if Twilio is properly configured."""
        return self.client is not None
    
    async def search_available_numbers(
        self,
        country_code: str = "US",
        area_code: Optional[str] = None,
        number_type: PhoneNumberType = PhoneNumberType.LOCAL,
        contains: Optional[str] = None,
        limit: int = 20,
    ) -> List[PhoneNumberAvailable]:
        """Search for available phone numbers from Twilio."""
        
        # If Twilio is not configured, return mock data
        if not self.client:
            logger.debug("Using mock phone numbers (Twilio not configured)")
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
            
            logger.info(f"Searching Twilio for {number_type.value} numbers in {country_code}, area_code={area_code}")
            
            # Get available numbers based on type
            if number_type == PhoneNumberType.LOCAL:
                numbers = self.client.available_phone_numbers(country_code).local.list(**search_params)
            elif number_type == PhoneNumberType.TOLL_FREE:
                numbers = self.client.available_phone_numbers(country_code).toll_free.list(**search_params)
            elif number_type == PhoneNumberType.MOBILE:
                numbers = self.client.available_phone_numbers(country_code).mobile.list(**search_params)
            else:
                numbers = self.client.available_phone_numbers(country_code).local.list(**search_params)
            
            logger.info(f"Found {len(numbers)} available numbers from Twilio")
            
            result = []
            for n in numbers:
                # Handle capabilities - Twilio returns them as a dict or object
                caps = getattr(n, 'capabilities', {})
                if hasattr(caps, 'voice'):
                    # Object-style capabilities
                    voice = bool(caps.voice)
                    sms = bool(caps.sms)
                    mms = bool(getattr(caps, 'mms', False))
                elif isinstance(caps, dict):
                    # Dict-style capabilities
                    voice = caps.get('voice', True)
                    sms = caps.get('sms', True)
                    mms = caps.get('mms', False)
                else:
                    voice, sms, mms = True, True, False
                
                result.append(
                    PhoneNumberAvailable(
                        phone_number=n.phone_number,
                        friendly_name=n.friendly_name or n.phone_number,
                        locality=getattr(n, 'locality', None),
                        region=getattr(n, 'region', None),
                        country_code=country_code,
                        capabilities={
                            "voice": voice,
                            "sms": sms,
                            "mms": mms,
                        },
                        price_monthly=self.PRICE_PER_NUMBER,
                        number_type=number_type,
                    )
                )
            
            return result
            
        except Exception as e:
            logger.error(f"Twilio API error: {e}", exc_info=True)
            # Fall back to mock data on error
            return self._get_mock_numbers(country_code, area_code, number_type, limit)
    
    def _get_mock_numbers(
        self,
        country_code: str,
        area_code: Optional[str],
        number_type: PhoneNumberType,
        limit: int,
    ) -> List[PhoneNumberAvailable]:
        """Return mock phone numbers for development."""
        import random
        
        # US area codes with city info
        us_area_codes = {
            "212": ("New York", "NY"),
            "213": ("Los Angeles", "CA"),
            "312": ("Chicago", "IL"),
            "415": ("San Francisco", "CA"),
            "512": ("Austin", "TX"),
            "615": ("Nashville", "TN"),
            "617": ("Boston", "MA"),
            "702": ("Las Vegas", "NV"),
            "786": ("Miami", "FL"),
            "206": ("Seattle", "WA"),
        }
        
        # Filter by area code if specified
        if area_code and area_code in us_area_codes:
            area_codes_list = [(area_code, us_area_codes[area_code])]
        elif area_code:
            # Use provided area code with generic location
            area_codes_list = [(area_code, ("Unknown", "US"))]
        else:
            area_codes_list = list(us_area_codes.items())
            random.shuffle(area_codes_list)
        
        mock_numbers = []
        for i in range(min(limit, len(area_codes_list) * 2)):
            ac, (city, state) = area_codes_list[i % len(area_codes_list)]
            # Generate random last 4 digits for variety
            suffix = str(random.randint(1000, 9999))
            exchange = str(random.randint(200, 999))
            
            mock_numbers.append(
                PhoneNumberAvailable(
                    phone_number=f"+1{ac}{exchange}{suffix}",
                    friendly_name=f"({ac}) {exchange}-{suffix}",
                    locality=city,
                    region=state,
                    country_code=country_code,
                    capabilities={"voice": True, "sms": True, "mms": False},
                    price_monthly=5.00,
                    number_type=number_type,
                )
            )
        return mock_numbers
    
    async def purchase_number(
        self,
        phone_number: str,
        friendly_name: Optional[str] = None,
    ) -> dict:
        """Purchase a phone number from Twilio."""
        
        # If Twilio is not configured, return mock data
        if not self.client:
            logger.info(f"Mock purchase: {phone_number}")
            return {
                "phone_number": phone_number,
                "friendly_name": friendly_name or phone_number,
                "sid": f"PN_MOCK_{phone_number.replace('+', '')}",
                "status": "active",
            }
        
        try:
            logger.info(f"Purchasing number from Twilio: {phone_number}")
            
            # Purchase the number
            incoming_phone_number = self.client.incoming_phone_numbers.create(
                phone_number=phone_number,
                friendly_name=friendly_name,
            )
            
            logger.info(f"Successfully purchased: {incoming_phone_number.phone_number} (SID: {incoming_phone_number.sid})")
            
            return {
                "phone_number": incoming_phone_number.phone_number,
                "friendly_name": incoming_phone_number.friendly_name,
                "sid": incoming_phone_number.sid,
                "status": "active",
            }
        except Exception as e:
            logger.error(f"Twilio purchase error for {phone_number}: {e}", exc_info=True)
            raise Exception(f"Failed to purchase number: {str(e)}")
    
    async def release_number(self, sid: str) -> bool:
        """Release a phone number back to Twilio."""
        if not self.client:
            logger.info(f"Mock release: {sid}")
            return True
        
        try:
            logger.info(f"Releasing number from Twilio: {sid}")
            self.client.incoming_phone_numbers(sid).delete()
            logger.info(f"Successfully released: {sid}")
            return True
        except Exception as e:
            logger.error(f"Twilio release error for {sid}: {e}", exc_info=True)
            return False
    
    async def get_account_info(self) -> Optional[dict]:
        """Get Twilio account information to verify credentials."""
        if not self.client:
            return None
        
        try:
            account = self.client.api.accounts(self.account_sid).fetch()
            return {
                "sid": account.sid,
                "friendly_name": account.friendly_name,
                "status": account.status,
                "type": account.type,
            }
        except Exception as e:
            logger.error(f"Failed to get account info: {e}")
            return None


# Global service instance
twilio_service = TwilioService()

