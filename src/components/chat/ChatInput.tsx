
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

export function ChatInput({ onSendMessage, isProcessing }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim() || isProcessing) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  return (
    <div className="p-4 border-t">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Digite sua resposta..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={isProcessing}
          className="flex-1"
        />
        <Button
          onClick={handleSend}
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
  );
}
