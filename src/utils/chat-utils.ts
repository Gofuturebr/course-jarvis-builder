
import { Message } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { askGroq, createGroqChatMessage } from "@/lib/groq-api";

// Create a user message object
export const createUserMessage = (content: string): Message => ({
  id: uuidv4(),
  content,
  role: "user",
  timestamp: new Date(),
});

// Create a jarvis message object
export const createJarvisMessage = (content: string): Message => ({
  id: uuidv4(),
  content,
  role: "jarvis",
  timestamp: new Date(),
});

// Get suggestions based on current step
export const getSuggestions = (currentStepIndex: number, stepsQuestions: any): string[] => {
  const currentStep = stepsQuestions[currentStepIndex as keyof typeof stepsQuestions];
  if (!currentStep) return [];
  
  // Check if we should offer "move to next step" options
  if (currentStep.showAdvanceOptions) {
    return [
      "Sim, vamos avançar para a próxima etapa",
      "Não, quero modificar esta etapa"
    ];
  }
  
  return currentStep.questions.map((q: string) => {
    const suggestion = q.replace(/[?]/g, '').substring(0, 30);
    return suggestion.length > 25 ? `${suggestion}...` : suggestion;
  });
};

// Process chat with Groq API
export const processChatWithGroq = async (messages: Message[]): Promise<string> => {
  try {
    // Use Groq API to generate response
    const response = await askGroq(messages);
    return response;
  } catch (error) {
    console.error("Error processing chat with Groq:", error);
    return "Desculpe, estou com dificuldades para responder no momento. Poderia reformular sua pergunta?";
  }
};
