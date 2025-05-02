
import { useState, useRef, useEffect } from "react";
import { useUpdateCourseStepMutation } from "@/hooks/useCourseData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ArrowRight, Bot, Lightbulb, User, Menu, Send } from "lucide-react";
import { Message, ConversationContext } from "@/types";
import { v4 as uuidv4 } from "uuid";

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
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const updateCourseMutation = useUpdateCourseStepMutation();
  
  // Referência para o elemento de fundo do chat para rolagem
  const lastMessageRef = useRef<HTMLDivElement>(null);
  
  // Função para auto-rolagem ao adicionar novas mensagens
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Simula uma resposta do Jarvis
  const simulateJarvisResponse = (userMessage: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Resposta baseada na entrada do usuário
        if (userMessage.toLowerCase().includes("fisioterapeuta") || 
            userMessage.toLowerCase().includes("reabilitação")) {
          resolve("Excelente! E qual conhecimento específico você gostaria de compartilhar em seu curso? Pode me contar sobre suas principais competências na área de reabilitação esportiva?");
        } else if (userMessage.toLowerCase().includes("competência") || 
                  userMessage.toLowerCase().includes("conhecimento")) {
          resolve("Ótimo! Vamos agora analisar o mercado e o público-alvo para o seu curso. Você tem uma ideia de quem seria seu público principal?");
        } else {
          resolve("Entendi! Isso é muito interessante. Vamos avançar um pouco mais. Poderia me falar sobre o formato que você imagina para o seu curso? Pense em aspectos como duração, complexidade e tipo de entrega.");
        }
      }, 1500);
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;
    
    // Adiciona a mensagem do usuário ao chat
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
      // Simula resposta do Jarvis
      const jarvisResponse = await simulateJarvisResponse(userMessage.content);
      
      // Adiciona a resposta do Jarvis ao chat
      const jarvisMessage: Message = {
        id: uuidv4(),
        content: jarvisResponse,
        role: "jarvis",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, jarvisMessage]);
      
      // Prepara o contexto para atualizar os dados do curso
      const context: ConversationContext = {
        lastUserMessage: userMessage.content,
        lastJarvisResponse: jarvisResponse,
        recentHistory: [userMessage, jarvisMessage],
      };
      
      // Chama a mutação para atualizar os dados do curso
      updateCourseMutation.mutate(context);
      
    } catch (error) {
      console.error("Erro ao processar mensagem:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Suggestion chips for the chat
  const suggestions = [
    "Tenho experiência em fisioterapia esportiva",
    "Meu público-alvo são profissionais de saúde",
    "Quero um curso prático com estudos de caso"
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header com branding */}
      <header className="flex items-center px-4 py-3 border-b">
        <Menu className="mr-3 h-5 w-5 text-gray-600" />
        <div className="flex items-center">
          <span className="text-xl font-bold text-jarvis-foreground">
            GO
            <span className="font-black">cursos</span>
          </span>
        </div>
      </header>

      {/* Área de mensagens */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {/* Elemento invisível para referência de rolagem */}
        <div ref={lastMessageRef} />

        {/* Suggestion chips */}
        {messages.length === 1 && (
          <div className="pt-2">
            <div className="flex items-center gap-1 mb-2 text-sm text-gray-500">
              <Lightbulb size={16} />
              <span>Ver sugestões de tópicos populares</span>
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
        )}
      </div>

      {/* Input de mensagem */}
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
