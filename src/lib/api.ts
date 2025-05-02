
import { AiUpdateResponse, ConversationContext, CourseData, initialCourseData } from "@/types";

// Function to call the GROQ API
const callGroqAPI = async (context: ConversationContext): Promise<AiUpdateResponse> => {
  try {
    // In production, this would be handled by a secure backend service
    // This direct API call from frontend is just for demonstration purposes
    // NEVER include API keys directly in frontend code in production!
    
    // For security, the API key should be stored in environment variables on your backend
    const apiKey = ""; // Remove the actual key for security
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: `Você é um assistente inteligente que ajuda a analisar conversas para identificar informações relevantes para a criação de cursos. 
            Baseado na conversa fornecida, identifique qual etapa do curso está sendo discutida e crie um resumo conciso.
            
            As etapas são:
            0: Perfil do Especialista - informações sobre a experiência profissional e especialização do criador do curso
            1: Análise de Mercado - informações sobre público-alvo e demanda de mercado
            2: Formato e Complexidade - informações sobre duração, nível de dificuldade e formato do curso
            3: Metodologia - informações sobre abordagem pedagógica e métodos de ensino
            4: Estrutura Modular - informações sobre módulos, tópicos e organização do conteúdo
            5: Visualização Final - informações sobre o resultado final e diferenciais do curso
            
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
      console.error("Erro na resposta da API GROQ:", await response.text());
      throw new Error(`Erro na chamada da API GROQ: ${response.status}`);
    }

    const data = await response.json();
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

// Esta função agora usa o GROQ API para análise do contexto e geração de resposta
export const updateCourseStep = async (
  context: ConversationContext
): Promise<AiUpdateResponse> => {
  console.log("Enviando contexto para API:", context);
  
  // Em um ambiente real de produção, você deveria:
  // 1. Enviar o contexto para seu backend
  // 2. O backend usaria a API key da GROQ armazenada com segurança
  // 3. O backend chamaria a API GROQ e retornaria o resultado
  
  try {
    // Simulação removida - agora chamamos a API real
    return await callGroqAPI(context);
  } catch (error) {
    console.error("Erro ao processar atualização do curso:", error);
    
    // Fallback para a simulação anterior em caso de erro
    return new Promise((resolve) => {
      setTimeout(() => {
        // Analisar o último contexto para determinar qual etapa atualizar
        const lastUserMessage = context.lastUserMessage || '';
        
        // Identificar a etapa com base no conteúdo da mensagem
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
  }
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
