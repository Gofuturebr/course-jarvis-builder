
import { AiUpdateResponse, ConversationContext, CourseData, initialCourseData } from "@/types";
import { env } from "./env";

// Function to call the GROQ API
const callGroqAPI = async (context: ConversationContext): Promise<AiUpdateResponse> => {
  try {
    // Get API key from environment variable
    const apiKey = env.GROQ_API_KEY;
    
    if (!apiKey) {
      console.error("API key not found. Please set your GROQ API key in .env file as VITE_GROQ_API_KEY.");
      throw new Error("Missing GROQ API key");
    }
    
    console.log("Calling GROQ API with conversation context:", context);
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Updated to an available model
        messages: [
          {
            role: "system",
            content: `Você é um assistente inteligente que ajuda a analisar conversas para identificar informações relevantes para a criação de cursos. 
            Baseado na conversa fornecida, identifique qual etapa do curso está sendo discutida e crie um resumo conciso.
            
            As etapas são:
            0: Perfil do Especialista - informações sobre a experiência profissional e especialização do criador do curso, público-alvo, tema principal
            1: Análise de Mercado - informações sobre tendências, transformação no aluno e demanda de mercado
            2: Estrutura do Curso - informações sobre formato, tipos de conteúdo e nível de complexidade
            3: Metodologia - informações sobre abordagem pedagógica, etapas do método e técnicas de ensino
            4: Estrutura Modular - informações sobre módulos, capítulos e organização do conteúdo
            5: Visualização Final - resumo e finalização do curso
            
            Responda APENAS com um objeto JSON no seguinte formato:
            {
              "stepIndex": número da etapa (0-5) ou null se não for possível identificar,
              "updateData": {
                "summary": resumo conciso da etapa (máximo 100 palavras)
              }
            }`
          },
          {
            role: "user",
            content: `Aqui está a conversa recente:
            
            Última mensagem do usuário: "${context.lastUserMessage || ''}"
            
            Última resposta do assistente: "${context.lastJarvisResponse || ''}"
            
            Por favor, identifique a etapa relevante e gere um resumo adequado.`
          }
        ],
        temperature: 0.2,
        max_tokens: 500,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na resposta da API GROQ:", errorText);
      throw new Error(`Erro na chamada da API GROQ: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("GROQ API response:", data);
    
    const content = data.choices[0].message.content;
    
    try {
      // Parse the JSON content from the API response
      const parsedContent = JSON.parse(content);
      return parsedContent;
    } catch (parseError) {
      console.error("Erro ao parsear resposta da API:", parseError);
      throw new Error("Resposta da API em formato inválido");
    }
  } catch (error) {
    console.error("Erro ao chamar API GROQ:", error);
    return { stepIndex: null, updateData: null };
  }
};

// This function now uses the GROQ API for context analysis and response generation
export const updateCourseStep = async (
  context: ConversationContext
): Promise<AiUpdateResponse> => {
  console.log("Enviando contexto para API:", context);
  
  try {
    return await callGroqAPI(context);
  } catch (error) {
    console.error("Erro ao processar atualização do curso:", error);
    
    // Fallback if API fails
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
  }
};

// Functions for local persistence
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
  
  // Return initial data if no saved data or error occurs
  return { ...initialCourseData };
};

// This function is deprecated with .env approach
export const setApiKey = (key: string): void => {
  console.warn('setApiKey is deprecated when using .env files');
};
