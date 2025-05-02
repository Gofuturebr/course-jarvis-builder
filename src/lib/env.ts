
/**
 * Environment configuration
 * Note: In production, API keys should NEVER be stored in frontend code
 * This is a temporary solution for development purposes
 */

// Environment configuration
export const env = {
  GROQ_API_KEY: import.meta.env.VITE_GROQ_API_KEY || '',
};

// Function to set the API key (no longer used with .env approach)
export const setGroqApiKey = (key: string): void => {
  console.warn('setGroqApiKey is deprecated when using .env files');
};

