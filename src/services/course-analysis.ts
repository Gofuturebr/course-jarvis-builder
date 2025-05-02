
import { AiUpdateResponse, ConversationContext } from "@/types";
import { analyzeConversationWithGroq, fallbackAnalysis } from "./analysis-service";

// Main function for analyzing conversations and updating course steps
export const updateCourseStep = async (
  context: ConversationContext
): Promise<AiUpdateResponse> => {
  console.log("Enviando contexto para API:", context);
  
  try {
    return await analyzeConversationWithGroq(context);
  } catch (error) {
    console.error("Erro ao processar atualização do curso:", error);
    
    // Use fallback if API fails
    return fallbackAnalysis(context);
  }
};
