/**
 * Configuration for Phone Number Selection step
 */
export class PhoneNumberConfig {
  static readonly title = "Select Phone Number";
  static readonly subtitle = "Choose a phone number for your voice assistant to receive calls";
  
  static readonly countries = [
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
    { code: "AU", name: "Australia", flag: "🇦🇺" },
  ];
  
  static readonly numberTypes = [
    { id: "local", name: "Local", description: "Local presence in your area" },
    { id: "toll_free", name: "Toll-Free", description: "Free for callers" },
  ];
  
  static readonly api = {
    searchEndpoint: "http://localhost:8000/api/v1/phone-numbers/available",
    purchaseEndpoint: "http://localhost:8000/api/v1/phone-numbers/purchase",
  };
  
  static formatPhoneNumber(number: string): string {
    // Format US numbers: +1XXXXXXXXXX -> (XXX) XXX-XXXX
    if (number.startsWith("+1") && number.length === 12) {
      const cleaned = number.slice(2);
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return number;
  }
}

