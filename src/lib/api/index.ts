
import { AiUpdateResponse, ConversationContext } from "@/types";
import { callGroqAPI } from "./groq";
import { provideFallbackAnalysis } from "./fallback";
import { saveCourseData, fetchCourseData } from "./storage";

// This function uses the GROQ API for context analysis with fallback
export const updateCourseStep = async (
  context: ConversationContext
): Promise<AiUpdateResponse> => {
  console.log("Enviando contexto para API:", context);
  
  try {
    return await callGroqAPI(context);
  } catch (error) {
    console.error("Erro ao processar atualização do curso:", error);
    
    // Use fallback if API fails
    return provideFallbackAnalysis(context);
  }
};

// Re-export storage functions
export { saveCourseData, fetchCourseData };

// This function is deprecated with .env approach
export const setApiKey = (key: string): void => {
  console.warn('setApiKey is deprecated when using .env files');
};
