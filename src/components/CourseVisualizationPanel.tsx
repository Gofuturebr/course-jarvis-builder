
import { useCourseQuery, useManualUpdateCourseMutation } from "@/hooks/useCourseData";
import CourseStepCard from "./CourseStepCard";
import { Spinner } from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CourseVisualizationPanelProps {
  updatingStepId?: number | null;
}

export default function CourseVisualizationPanel({ updatingStepId }: CourseVisualizationPanelProps) {
  const { data: courseData, isLoading } = useCourseQuery();
  const manualUpdateMutation = useManualUpdateCourseMutation();

  const handleEditStep = (stepId: number, summary: string) => {
    manualUpdateMutation.mutate({ stepId, summary });
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner className="text-jarvis" size={40} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 flex-shrink-0">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Resumo do Curso</h2>
          <div className="flex items-center space-x-2 text-sm">
            <span>{courseData?.progress || 0}% completo</span>
          </div>
        </div>
        
        <Progress 
          value={courseData?.progress || 0} 
          className="h-2 mb-6 bg-gray-200" 
        />
      </div>
      
      <ScrollArea className="flex-1">
        <div className="grid gap-4 p-4">
          {courseData?.steps.map((step) => (
            <CourseStepCard
              key={step.id}
              step={step}
              isUpdating={updatingStepId === step.id}
              onEdit={handleEditStep}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
