
import { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import ChatPanel from "@/components/ChatPanel";
import CourseVisualizationPanel from "@/components/CourseVisualizationPanel";
import { TooltipProvider } from "@/components/ui/tooltip";

// Criar uma instância do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
});

export default function Index() {
  const [updatingStepId, setUpdatingStepId] = useState<number | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
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
      </TooltipProvider>
    </QueryClientProvider>
  );
}
