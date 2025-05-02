
import { useState } from "react";
import ChatPanel from "@/components/ChatPanel";
import CourseVisualizationPanel from "@/components/CourseVisualizationPanel";

export default function Index() {
  const [updatingStepId, setUpdatingStepId] = useState<number | null>(null);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Área de interação (chat) - 2/3 da tela */}
      <div className="w-2/3 h-full border-r">
        <ChatPanel />
      </div>
      
      {/* Área de consolidação (cards) - 1/3 da tela */}
      <div className="w-1/3 h-full">
        <CourseVisualizationPanel updatingStepId={updatingStepId} />
      </div>
    </div>
  );
}
