
/**
 * Environment configuration
 * Note: In production, API keys should NEVER be stored in frontend code
 * This is a temporary solution for development purposes
 */

// Check if there's a stored API key
const getStoredApiKey = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('groq_api_key') || '';
  }
  return '';
};

// Environment configuration
export const env = {
  GROQ_API_KEY: getStoredApiKey(),
};

// Function to set the API key and store it in localStorage
export const setGroqApiKey = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('groq_api_key', key);
  }
};
