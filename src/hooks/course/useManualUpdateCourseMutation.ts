
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, CourseData } from '@/types';
import { saveCourseData } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export const useManualUpdateCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      stepId, 
      summary 
    }: { 
      stepId: number; 
      summary: string; 
    }) => {
      return Promise.resolve({ stepId, summary });
    },
    onSuccess: ({ stepId, summary }) => {
      queryClient.setQueryData<CourseData>(queryKeys.courseData, (oldData) => {
        if (!oldData) return;

        const updatedSteps = oldData.steps.map((step) => {
          if (step.id === stepId) {
            return {
              ...step,
              summary,
              isDefined: Boolean(summary.trim()),
            };
          }
          return step;
        });

        // Calculate new progress
        const definedSteps = updatedSteps.filter(step => step.isDefined).length;
        const progress = Math.round((definedSteps / updatedSteps.length) * 100);

        const updatedData = {
          ...oldData,
          steps: updatedSteps,
          progress,
        };

        // Persist updated data
        saveCourseData(updatedData);

        return updatedData;
      });

      toast({
        title: "Curso atualizado",
        description: "Suas edições foram salvas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar suas edições. Tente novamente.",
        variant: "destructive",
      });
    }
  });
};
