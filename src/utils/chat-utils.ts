
import { Message } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Get questions based on current step
export const getNextQuestion = (step: number, userMessage: string, stepsQuestions: any): string => {
  const currentStep = stepsQuestions[step as keyof typeof stepsQuestions];
  if (!currentStep) return "Poderia me falar mais sobre isso?";
  
  // Simple logic to choose next question
  const questionIndex = userMessage.length % currentStep.questions.length;
  return currentStep.questions[questionIndex];
};

// Get suggestions for the current step
export const getSuggestions = (currentStepIndex: number, stepsQuestions: any): string[] => {
  const currentStep = stepsQuestions[currentStepIndex as keyof typeof stepsQuestions];
  if (!currentStep) return [];
  
  // Generate simple suggestions based on questions
  return currentStep.questions.map((q: string) => {
    const suggestion = q.replace(/[?]/g, '').substring(0, 30);
    return suggestion.length > 25 ? `${suggestion}...` : suggestion;
  });
};

// Simulate a response from Jarvis based on current step
export const simulateJarvisResponse = (userMessage: string, currentStepIndex: number, stepsQuestions: any): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate next question based on current step
      const response = getNextQuestion(currentStepIndex, userMessage, stepsQuestions);
      resolve(response);
    }, 1000);
  });
};

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
