
import { useState } from "react";
import ChatPanel from "@/components/ChatPanel";
import CourseVisualizationPanel from "@/components/CourseVisualizationPanel";
import ApiKeyForm from "@/components/ApiKeyForm";

export default function Index() {
  const [updatingStepId, setUpdatingStepId] = useState<number | null>(null);
  const hasApiKey = Boolean(import.meta.env.VITE_GROQ_API_KEY);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Área de interação (chat) - 2/3 da tela */}
      <div className="w-2/3 h-full border-r flex flex-col">
        {!hasApiKey && (
          <div className="p-4">
            <ApiKeyForm />
          </div>
        )}
        <div className="flex-1">
          <ChatPanel />
        </div>
      </div>
      
      {/* Área de consolidação (cards) - 1/3 da tela */}
      <div className="w-1/3 h-full">
        <CourseVisualizationPanel updatingStepId={updatingStepId} />
      </div>
    </div>
  );
}
