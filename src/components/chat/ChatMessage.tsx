
import { Bot, User } from "lucide-react";
import { Message } from "@/types";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
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
