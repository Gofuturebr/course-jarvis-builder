
import { useState, useRef, useEffect } from "react";
import { useUpdateCourseStepMutation } from "@/hooks/useCourseData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message, ConversationContext, stepsQuestions } from "@/types";
import { toast } from "@/hooks/use-toast";
import { ChatMessage } from "./ChatMessage";
import { SuggestionChips } from "./SuggestionChips";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
import { 
  createUserMessage, 
  createJarvisMessage,
  processChatWithGroq,
  getSuggestions
} from "@/utils/chat-utils";

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      role: "jarvis",
      content: "Olá! Sou o Jarvis, seu assistente para criar cursos incríveis na área de saúde. Vamos começar pelo seu perfil profissional. Qual é sua área de especialização na saúde?",
      timestamp: new Date(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // Track current step
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const updateCourseMutation = useUpdateCourseStepMutation();
  
  // Function for auto-scrolling when adding new messages
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (inputValue: string) => {
    if (!inputValue.trim() || isProcessing) return;
    
    // Add the user message to the chat
    const userMessage = createUserMessage(inputValue);
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    try {
      // Create the array of messages for context (previous messages + new user message)
      const contextMessages = [...messages, userMessage];
      
      // Get response from Groq API
      const jarvisResponse = await processChatWithGroq(contextMessages);
      
      // Add Jarvis response to the chat
      const jarvisMessage = createJarvisMessage(jarvisResponse);
      
      setMessages(prev => [...prev, jarvisMessage]);
      
      // Get the most recent messages for better context
      const recentMessages = contextMessages.slice(-6); // Last 6 messages for context
      
      // Prepare context for updating course data with enhanced information
      const context: ConversationContext = {
        lastUserMessage: userMessage.content,
        lastJarvisResponse: jarvisResponse,
        recentHistory: [...recentMessages, jarvisMessage],
        currentStepIndex: currentStepIndex
      };
      
      // Call mutation to update course data
      updateCourseMutation.mutate(context, {
        onSuccess: (data) => {
          if (data.stepIndex !== null && data.stepIndex !== currentStepIndex) {
            // Update current step if changed
            setCurrentStepIndex(data.stepIndex);
          }
        }
      });
      
    } catch (error) {
      console.error("Erro ao processar mensagem:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Set the suggestion as input value
    handleSendMessage(suggestion);
  };

  const suggestions = getSuggestions(currentStepIndex, stepsQuestions);

  return (
    <div className="flex flex-col h-full bg-white">
      <ChatHeader />

      {/* Messages area with independent scroll */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {/* Invisible element for scroll reference */}
          <div ref={lastMessageRef} className="h-0.5" />

          {/* Suggestion chips */}
          <SuggestionChips 
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        </div>
      </ScrollArea>

      <ChatInput 
        onSendMessage={handleSendMessage}
        isProcessing={isProcessing}
      />
    </div>
  );
}
