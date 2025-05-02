
import { AiUpdateResponse, ConversationContext, CourseData, initialCourseData } from "@/types";

// Esta é uma simulação do backend. Em um ambiente real, esta função
// faria uma chamada de API para um servidor que integraria com a API Groq
export const updateCourseStep = async (
  context: ConversationContext
): Promise<AiUpdateResponse> => {
  console.log("Enviando contexto para API:", context);
  
  // Em um ambiente real, este seria um POST para seu backend:
  // 
  // const response = await fetch('/api/update-course-step', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ context })
  // });
  // return response.json();
  
  // Simulando uma resposta da API - em produção, substituir por chamada real
  // que integra com o Groq
  return new Promise((resolve) => {
    setTimeout(() => {
      // Analisar o último contexto para determinar qual etapa atualizar
      const lastUserMessage = context.lastUserMessage || '';
      
      // Identificar a etapa com base no conteúdo da mensagem
      // Em um ambiente real, isso seria feito pela API Groq
      let stepIndex: number | null = null;
      let summary = "";
      
      if (lastUserMessage.toLowerCase().includes("fisioterapeuta") || 
          lastUserMessage.toLowerCase().includes("experiência") ||
          lastUserMessage.toLowerCase().includes("especializado")) {
        stepIndex = 0;
        summary = "Fisioterapeuta especializado em reabilitação esportiva, com experiência em tratamento de atletas e recuperação de lesões esportivas.";
      } else if (lastUserMessage.toLowerCase().includes("mercado") || 
                lastUserMessage.toLowerCase().includes("público") || 
                lastUserMessage.toLowerCase().includes("alvo")) {
        stepIndex = 1;
        summary = "Mercado focado em profissionais de educação física e fisioterapia que buscam especialização em reabilitação esportiva. Demanda crescente devido ao aumento de praticantes de atividades físicas.";
      } else if (lastUserMessage.toLowerCase().includes("formato") || 
                lastUserMessage.toLowerCase().includes("complexidade")) {
        stepIndex = 2;
        summary = "Curso online com 8 módulos, incluindo aulas teóricas e estudos de caso práticos. Nível intermediário a avançado, com duração total de 40 horas.";
      }
      
      resolve({
        stepIndex,
        updateData: stepIndex !== null ? { summary } : null
      });
    }, 1500); // Simula latência de rede
  });
};

// Funções para persistência local
export const saveCourseData = (data: CourseData): void => {
  try {
    localStorage.setItem('jarvisEduCourseData', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving course data:', error);
  }
};

export const fetchCourseData = async (): Promise<CourseData> => {
  try {
    const storedData = localStorage.getItem('jarvisEduCourseData');
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error('Error fetching course data:', error);
  }
  
  // Se não houver dados salvos ou ocorrer um erro, retorna os dados iniciais
  return { ...initialCourseData };
};
