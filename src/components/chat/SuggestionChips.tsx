
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuggestionChipsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

export function SuggestionChips({ suggestions, onSuggestionClick }: SuggestionChipsProps) {
  if (!suggestions.length) return null;
  
  return (
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
            onClick={() => onSuggestionClick(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
