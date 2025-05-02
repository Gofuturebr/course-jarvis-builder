
import { useState, useRef, useEffect } from "react";
import { useUpdateCourseStepMutation } from "@/hooks/useCourseData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, Bot, Lightbulb, User, Menu, Send } from "lucide-react";
import { Message, ConversationContext, stepsQuestions } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";

function ChatMessage({ message }: { message: Message }) {
  return (
    <div 
      className={`flex gap-3 p-3 rounded-lg message-appear ${
        message.role === "jarvis" 
          ? "bg-jarvis-light" 
          : "bg-gray-100"
      }`}
    >
      <div className={`flex-shrink-0 rounded-full w-8 h-8 flex items-center justify-center ${
        message.role === "jarvis" 
          ? "bg-jarvis text-jarvis-foreground" 
          : "bg-gray-200 text-gray-700"
      }`}>
        {message.role === "jarvis" ? <Bot size={18} /> : <User size={18} />}
      </div>
      <div className="flex-1 space-y-1">
        <div className="text-sm font-medium">
          {message.role === "jarvis" ? "Jarvis" : "Você"}
        </div>
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      role: "jarvis",
      content: "Olá! Sou o Jarvis, seu assistente para criar cursos incríveis. Vamos começar falando sobre sua experiência profissional. Qual é sua principal área de atuação?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
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

  // Generate dynamic questions based on current step
  const getNextQuestion = (step: number, userMessage: string): string => {
    const currentStep = stepsQuestions[step as keyof typeof stepsQuestions];
    if (!currentStep) return "Poderia me falar mais sobre isso?";
    
    // Simple logic to choose next question
    const questionIndex = userMessage.length % currentStep.questions.length;
    return currentStep.questions[questionIndex];
  };

  // Simulate a response from Jarvis based on current step
  const simulateJarvisResponse = (userMessage: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate next question based on current step
        const response = getNextQuestion(currentStepIndex, userMessage);
        resolve(response);
      }, 1000);
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;
    
    // Add the user message to the chat
    const userMessage: Message = {
      id: uuidv4(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);
    
    try {
      // Simulate Jarvis response
      const jarvisResponse = await simulateJarvisResponse(userMessage.content);
      
      // Add Jarvis response to the chat
      const jarvisMessage: Message = {
        id: uuidv4(),
        content: jarvisResponse,
        role: "jarvis",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, jarvisMessage]);
      
      // Prepare context for updating course data
      const context: ConversationContext = {
        lastUserMessage: userMessage.content,
        lastJarvisResponse: jarvisResponse,
        recentHistory: [userMessage, jarvisMessage],
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

  // Suggestion chips for the chat based on current step
  const getSuggestions = () => {
    const currentStep = stepsQuestions[currentStepIndex as keyof typeof stepsQuestions];
    if (!currentStep) return [];
    
    // Generate simple suggestions based on questions
    return currentStep.questions.map(q => {
      const suggestion = q.replace(/[?]/g, '').substring(0, 30);
      return suggestion.length > 25 ? `${suggestion}...` : suggestion;
    });
  };

  const suggestions = getSuggestions();

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header with branding */}
      <header className="flex items-center px-4 py-3 border-b">
        <Menu className="mr-3 h-5 w-5 text-gray-600" />
        <div className="flex items-center">
          <span className="text-xl font-bold text-jarvis-foreground">
            GO
            <span className="font-black">cursos</span>
          </span>
        </div>
      </header>

      {/* Messages area with independent scroll */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {/* Invisible element for scroll reference */}
          <div ref={lastMessageRef} className="h-0.5" />

          {/* Suggestion chips */}
          <div className="pt-2">
            <div className="flex items-center gap-1 mb-2 text-sm text-gray-500">
              <Lightbulb size={16} />
              <span>Sugestões para esta etapa:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-sm rounded-full py-1 h-auto border-jarvis-dark text-jarvis-foreground hover:bg-jarvis-light"
                  onClick={() => setInputValue(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Message input */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Digite sua resposta..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isProcessing}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className="bg-jarvis hover:bg-jarvis-dark text-jarvis-foreground"
          >
            {isProcessing ? (
              <Spinner className="text-jarvis-foreground" size={18} />
            ) : (
              <Send size={18} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
