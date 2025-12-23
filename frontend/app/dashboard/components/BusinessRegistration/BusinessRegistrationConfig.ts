/**
 * Configuration for Business Registration step
 */
export class BusinessRegistrationConfig {
  static readonly title = "Business Information";
  static readonly subtitle = "Tell us about your company to personalize your voice assistant";
  
  static readonly fields = {
    name: {
      label: "Business Name",
      placeholder: "Enter your company name",
      required: true,
      maxLength: 255,
    },
    description: {
      label: "Description",
      placeholder: "Briefly describe what your company does (optional)",
      required: false,
      maxLength: 2000,
    },
  };
  
  static readonly api = {
    endpoint: "http://localhost:8000/api/v1/business",
  };
}

