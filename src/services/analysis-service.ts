
import { AiUpdateResponse, ConversationContext } from "@/types";
import { env } from "@/lib/env";

// Function to call the GROQ API for analysis
export const analyzeConversationWithGroq = async (context: ConversationContext): Promise<AiUpdateResponse> => {
  try {
    // Get API key from environment variable
    const apiKey = env.GROQ_API_KEY;
    
    if (!apiKey) {
      console.error("API key not found. Please set your GROQ API key in .env file as VITE_GROQ_API_KEY.");
      throw new Error("Missing GROQ API key");
    }
    
    console.log("Calling GROQ API with conversation context:", context);
    
    // Generate a specific system prompt based on the step index
    const systemPrompt = getStepSpecificPrompt(context.currentStepIndex);
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Aqui está a conversa recente:
            
            Última mensagem do usuário: "${context.lastUserMessage || ''}"
            
            Última resposta do assistente: "${context.lastJarvisResponse || ''}"
            
            Por favor, analise esta conversa e gere um resumo estruturado para a etapa ${context.currentStepIndex}.`
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

// Gets specific prompt for each step
function getStepSpecificPrompt(stepIndex?: number): string {
  const basePrompt = `Você é um assistente inteligente que ajuda a analisar conversas para identificar informações relevantes para a criação de cursos. 
  Baseado na conversa fornecida, identifique qual etapa do curso está sendo discutida e crie um resumo conciso e estruturado.`;
  
  switch (stepIndex) {
    case 0:
      return `${basePrompt}
      
      Você está analisando a etapa de "Perfil do Especialista".
      
      Compile e organize as informações sobre:
      - Área de especialização do autor
      - Formação e credenciais relevantes
      - Tema principal do curso
      - Público-alvo definido
      - Experiência profissional relevante
      
      O resumo deve ser estruturado, reutilizável e exportável para as próximas etapas. Ele também poderá servir como base para a biografia pública do autor na plataforma.
      
      Responda APENAS com um objeto JSON no seguinte formato:
      {
        "stepIndex": 0,
        "updateData": {
          "summary": resumo estruturado (máximo 100 palavras)
        }
      }`;
      
    case 1:
      return `${basePrompt}
      
      Você está analisando a etapa de "Análise de Mercado".
      
      Identifique e organize as informações sobre:
      - Tendências atuais que se conectam com o perfil do curso
      - Tema central escolhido
      - Transformação pedagógica proposta ("De... Para...")
      - Oportunidades de mercado identificadas
      
      O resumo deve conter dados organizados para consulta futura e auxiliar a fundamentar a construção da metodologia.
      
      Responda APENAS com um objeto JSON no seguinte formato:
      {
        "stepIndex": 1,
        "updateData": {
          "summary": resumo estruturado (máximo 100 palavras)
        }
      }`;
      
    case 2:
      return `${basePrompt}
      
      Você está analisando a etapa de "Estrutura do Curso".
      
      Registre de forma clara:
      - Modelo pedagógico escolhido (gravado, ao vivo ou híbrido)
      - Tipos de conteúdo a serem utilizados (vídeos, quizzes, textos, etc.)
      - Nível de profundidade do curso (básico, intermediário, avançado)
      
      Esse resumo é essencial para orientar a criação das aulas e validar a coerência da experiência de aprendizagem.
      
      Responda APENAS com um objeto JSON no seguinte formato:
      {
        "stepIndex": 2,
        "updateData": {
          "summary": resumo estruturado (máximo 100 palavras)
        }
      }`;
      
    case 3:
      return `${basePrompt}
      
      Você está analisando a etapa de "Metodologia".
      
      Traduza a forma de ensinar do especialista em:
      - Conjunto sequencial de etapas personalizadas
      - Nomes das etapas metodológicas
      - Objetivos de cada etapa
      - Importância pedagógica
      - Orientações práticas
      
      O resumo deve estar em formato editável e reutilizável, servindo como espinha dorsal da estrutura lógica do curso.
      
      Responda APENAS com um objeto JSON no seguinte formato:
      {
        "stepIndex": 3,
        "updateData": {
          "summary": resumo estruturado (máximo 100 palavras)
        }
      }`;
      
    case 4:
      return `${basePrompt}
      
      Você está analisando a etapa de "Estrutura Didática (Módulos, Capítulos e Aulas)".
      
      Represente a organização hierárquica completa do curso:
      - Módulos principais
      - Capítulos em cada módulo
      - Aulas em cada capítulo
      - Títulos, sequenciamento e tipo de conteúdo
      - Tempo estimado por aula
      
      Essa estrutura serve como roteiro pedagógico e blueprint técnico para apresentação do curso.
      
      Responda APENAS com um objeto JSON no seguinte formato:
      {
        "stepIndex": 4,
        "updateData": {
          "summary": resumo estruturado (máximo 100 palavras)
        }
      }`;
      
    case 5:
      return `${basePrompt}
      
      Você está analisando a etapa de "Visualização Final".
      
      Consolide todas as decisões tomadas ao longo do processo de criação:
      - Nome e nível do curso
      - Perfil do instrutor
      - Público-alvo
      - Metodologia utilizada
      - Estrutura modular completa
      - Carga horária total
      
      Esse resumo deve servir tanto para revisão do autor quanto para exportação e publicação no catálogo de cursos.
      
      Responda APENAS com um objeto JSON no seguinte formato:
      {
        "stepIndex": 5,
        "updateData": {
          "summary": resumo estruturado (máximo 100 palavras)
        }
      }`;
      
    default:
      return `${basePrompt}
      
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
          "summary": resumo conciso e estruturado da etapa (máximo 100 palavras)
        }
      }`;
  }
}

// Fallback analysis if API fails
export const fallbackAnalysis = (context: ConversationContext): Promise<AiUpdateResponse> => {
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
