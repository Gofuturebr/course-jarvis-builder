
import { AiUpdateResponse, ConversationContext } from "@/types";

/**
 * Provides fallback course step analysis when the API call fails
 */
export const provideFallbackAnalysis = (context: ConversationContext): Promise<AiUpdateResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Analyze last context to determine which step to update
      const lastUserMessage = context.lastUserMessage || '';
      const lastJarvisResponse = context.lastJarvisResponse || '';
      
      // Identify step based on message content
      let stepIndex: number | null = null;
      let summary = "";
      
      // Step 0: Expert Profile
      if (lastJarvisResponse.includes("área de especialização") || 
          lastJarvisResponse.includes("Qual tema principal") || 
          lastJarvisResponse.includes("Qual é sua principal área") ||
          lastUserMessage.includes("experiência") || 
          lastUserMessage.includes("especialista") ||
          lastUserMessage.includes("formação")) {
        stepIndex = 0;
        summary = `Especialização em ${lastUserMessage}. Tema principal relacionado à área de saúde. Público-alvo a ser definido durante o desenvolvimento do curso.`;
      } 
      // Step 1: Market Analysis
      else if (lastJarvisResponse.includes("tendências") || 
              lastJarvisResponse.includes("transformação") ||
              lastUserMessage.includes("mercado") || 
              lastUserMessage.includes("demanda") ||
              lastUserMessage.includes("tendência")) {
        stepIndex = 1;
        summary = `Tendências de mercado relacionadas a ${lastUserMessage}. Foco na transformação do aluno de iniciante para profissional capacitado. Oportunidades identificadas no mercado atual.`;
      }
      // Step 2: Course Structure
      else if (lastJarvisResponse.includes("entregar seu curso") || 
              lastJarvisResponse.includes("tipos de conteúdo") ||
              lastJarvisResponse.includes("nível de complexidade") ||
              lastUserMessage.includes("formato") || 
              lastUserMessage.includes("conteúdo") ||
              lastUserMessage.includes("nível")) {
        stepIndex = 2;
        summary = `Curso em formato ${lastUserMessage.includes("gravado") ? "gravado" : "ao vivo"}. Conteúdo inclui vídeos, textos e exercícios práticos. Nível ${lastUserMessage.includes("avançado") ? "avançado" : lastUserMessage.includes("intermediário") ? "intermediário" : "básico"}.`;
      }
      // Step 3: Methodology
      else if (lastJarvisResponse.includes("como você costuma ensinar") || 
              lastJarvisResponse.includes("quantas etapas") ||
              lastJarvisResponse.includes("metodologia") ||
              lastUserMessage.includes("método") || 
              lastUserMessage.includes("etapas") ||
              lastUserMessage.includes("ensinar")) {
        stepIndex = 3;
        summary = `Metodologia baseada em ${lastUserMessage.includes("5") ? "5" : lastUserMessage.includes("3") ? "3" : "4"} etapas principais. Abordagem prática com foco na aplicação do conhecimento. Método personalizado de ensino.`;
      }
      // Step 4: Modular Structure
      else if (lastJarvisResponse.includes("dividiria seu conteúdo") || 
              lastJarvisResponse.includes("estrutura") ||
              lastJarvisResponse.includes("módulos") ||
              lastUserMessage.includes("módulo") || 
              lastUserMessage.includes("aula") ||
              lastUserMessage.includes("capítulo")) {
        stepIndex = 4;
        summary = `Estrutura modular com ${lastUserMessage.includes("4") ? "4" : "3"} módulos principais. Cada módulo contém capítulos e aulas organizados de forma lógica. Conteúdo distribuído por tópicos com tempo estimado para cada aula.`;
      }
      // Step 5: Final Visualization
      else if (lastJarvisResponse.includes("revisar a estrutura final") || 
              lastJarvisResponse.includes("satisfeito") ||
              lastJarvisResponse.includes("finalizar e publicar") ||
              lastUserMessage.includes("finalizar") || 
              lastUserMessage.includes("publicar") ||
              lastUserMessage.includes("concluir")) {
        stepIndex = 5;
        summary = `Curso completo estruturado e pronto para publicação. Resumo dos módulos, capítulos e aulas definidos. Carga horária total estimada em 40 horas.`;
      }
      
      resolve({
        stepIndex,
        updateData: stepIndex !== null ? { summary } : null
      });
    }, 800);
  });
};
