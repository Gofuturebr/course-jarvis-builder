
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Edit, Check, X } from "lucide-react";
import { CourseStepData } from "@/types";

interface CourseStepCardProps {
  step: CourseStepData;
  isUpdating?: boolean;
  onEdit: (stepId: number, summary: string) => void;
}

export default function CourseStepCard({ step, isUpdating = false, onEdit }: CourseStepCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState(step.summary);

  const handleEdit = () => {
    setEditedSummary(step.summary);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedSummary(step.summary);
  };

  const handleSave = () => {
    onEdit(step.id, editedSummary);
    setIsEditing(false);
  };

  return (
    <Card className={cn(
      "transition-all duration-300",
      step.isDefined 
        ? "border-jarvis-dark shadow-md" 
        : "border-gray-200 opacity-70",
      isUpdating && "border-jarvis bg-jarvis-light/30 animate-pulse-light"
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            {step.icon && <span className="mr-2 text-xl">{step.icon}</span>}
            <span>{step.title}</span>
          </div>
          {isUpdating ? (
            <Spinner className="text-jarvis-dark" size={18} />
          ) : (
            !isEditing && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handleEdit}
              >
                <Edit size={16} />
              </Button>
            )
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={editedSummary}
            onChange={(e) => setEditedSummary(e.target.value)}
            className="min-h-24 text-sm"
            placeholder="Digite o resumo desta etapa do curso..."
          />
        ) : (
          <div className={cn(
            "text-sm",
            !step.isDefined && "text-muted-foreground italic",
            step.isDefined && "animate-fade-in"
          )}>
            {step.summary}
          </div>
        )}
      </CardContent>
      {isEditing && (
        <CardFooter className="flex justify-end gap-2 pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCancel} 
            className="h-8 gap-1"
          >
            <X size={14} /> Cancelar
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={handleSave} 
            className="h-8 gap-1 bg-jarvis hover:bg-jarvis-dark text-jarvis-foreground"
          >
            <Check size={14} /> Salvar
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

import { cn } from "@/lib/utils";
