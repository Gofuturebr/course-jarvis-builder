
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, AiUpdateResponse, ConversationContext, CourseData } from '@/types';
import { updateCourseStep, saveCourseData } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export const useUpdateCourseStepMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (context: ConversationContext) => updateCourseStep(context),
    onSuccess: (data: AiUpdateResponse) => {
      if (data.stepIndex !== null && data.updateData) {
        queryClient.setQueryData<CourseData>(queryKeys.courseData, (oldData) => {
          if (!oldData) return;

          const updatedSteps = oldData.steps.map((step) => {
            if (step.id === data.stepIndex) {
              return {
                ...step,
                summary: data.updateData!.summary,
                isDefined: true,
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
          description: `Etapa "${data.stepIndex + 1}" foi atualizada com sucesso.`,
        });
      }
    },
    onError: (error) => {
      console.error("Erro ao atualizar curso:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o curso. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};
