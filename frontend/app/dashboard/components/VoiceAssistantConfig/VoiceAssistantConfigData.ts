/**
 * Configuration for Voice Assistant step
 */
export class VoiceAssistantConfigData {
  static readonly title = "Configure Voice Assistant";
  static readonly subtitle = "Set up how your AI assistant will interact with callers";
  
  static readonly modelProviders = [
    {
      id: "openai",
      name: "OpenAI",
      models: [
        { id: "gpt-4o", name: "GPT-4o", description: "Most capable model" },
        { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "Fast and efficient" },
        { id: "gpt-4-turbo", name: "GPT-4 Turbo", description: "High performance" },
      ],
    },
    {
      id: "anthropic",
      name: "Anthropic",
      models: [
        { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", description: "Best balance" },
        { id: "claude-3-opus-20240229", name: "Claude 3 Opus", description: "Most powerful" },
        { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku", description: "Fastest" },
      ],
    },
    {
      id: "google",
      name: "Google",
      models: [
        { id: "gemini-pro", name: "Gemini Pro", description: "General purpose" },
        { id: "gemini-pro-vision", name: "Gemini Pro Vision", description: "Multimodal" },
      ],
    },
    {
      id: "groq",
      name: "Groq",
      models: [
        { id: "llama-3-70b", name: "Llama 3 70B", description: "Open source powerhouse" },
        { id: "mixtral-8x7b", name: "Mixtral 8x7B", description: "Fast MoE model" },
      ],
    },
  ];
  
  static readonly voices = [
    { id: "rachel", name: "Rachel", gender: "female", accent: "American" },
    { id: "domi", name: "Domi", gender: "female", accent: "American" },
    { id: "bella", name: "Bella", gender: "female", accent: "American" },
    { id: "antoni", name: "Antoni", gender: "male", accent: "American" },
    { id: "elli", name: "Elli", gender: "female", accent: "American" },
    { id: "josh", name: "Josh", gender: "male", accent: "American" },
    { id: "arnold", name: "Arnold", gender: "male", accent: "American" },
    { id: "adam", name: "Adam", gender: "male", accent: "American" },
    { id: "sam", name: "Sam", gender: "male", accent: "American" },
    { id: "nicole", name: "Nicole", gender: "female", accent: "American" },
    { id: "glinda", name: "Glinda", gender: "female", accent: "American" },
    { id: "clyde", name: "Clyde", gender: "male", accent: "American" },
    { id: "paul", name: "Paul", gender: "male", accent: "American" },
    { id: "callum", name: "Callum", gender: "male", accent: "British" },
    { id: "charlotte", name: "Charlotte", gender: "female", accent: "British" },
    { id: "matilda", name: "Matilda", gender: "female", accent: "Australian" },
    { id: "lily", name: "Lily", gender: "female", accent: "British" },
  ];
  
  static readonly durationPresets = [
    { value: 60, label: "1 min" },
    { value: 120, label: "2 min" },
    { value: 300, label: "5 min" },
    { value: 600, label: "10 min" },
    { value: 900, label: "15 min" },
    { value: 1800, label: "30 min" },
    { value: 3600, label: "60 min" },
  ];
  
  static readonly defaultSystemPrompt = `You are a helpful AI assistant for {business_name}. Your role is to:
- Answer questions about our products and services
- Help customers with their inquiries
- Provide accurate information based on the knowledge base
- Be professional, friendly, and concise

Always maintain a helpful and professional tone.`;

  static readonly defaultFirstMessage = "Hello! Thank you for calling. How can I assist you today?";
  
  static readonly defaultEndCallMessage = "Thank you for calling. Have a great day!";
  
  static readonly api = {
    endpoint: "http://localhost:8000/api/v1/voice-assistant",
    completeEndpoint: "http://localhost:8000/api/v1/onboarding/complete",
  };
}

