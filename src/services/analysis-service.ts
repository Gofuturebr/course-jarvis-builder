
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
  const basePrompt = `Você é um assistente inteligente que ajuda a analisar conversas para identificar informações relevantes para a criação de cursos na área da saúde. 
  Baseado na conversa fornecida, identifique qual etapa do curso está sendo discutida e crie um resumo conciso e estruturado.`;
  
  switch (stepIndex) {
    case 0:
      return `${basePrompt}
      
      Você está analisando a etapa de "Perfil do Especialista".
      
      Compile e organize as informações sobre:
      - Área de especialização do autor na saúde
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
      - 5 tendências atuais na área da saúde que se conectam com o perfil do curso
      - Tema central escolhido
      - Transformação pedagógica prática proposta ("De... Para...")
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
      
      Você está analisando a etapa de "Estrutura Modular".
      
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
      1: Análise de Mercado - informações sobre 5 tendências, transformação prática no aluno e demanda de mercado
      2: Estrutura do Curso - informações sobre formato (gravado, ao vivo, híbrido), tipos de conteúdo e nível de complexidade
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
          lastJarvisResponse.includes("tema principal") || 
          lastUserMessage.includes("especialização") || 
          lastUserMessage.includes("saúde") ||
          lastUserMessage.includes("formação")) {
        stepIndex = 0;
        summary = `Especialização em ${lastUserMessage.includes("nutri") ? "nutrição" : "saúde"}. Tema principal relacionado à área de ${lastUserMessage.includes("mental") ? "saúde mental" : "saúde"}. Público-alvo a ser definido durante o desenvolvimento do curso.`;
      } 
      // Step 1: Market Analysis
      else if (lastJarvisResponse.includes("tendências") || 
              lastJarvisResponse.includes("transformação") ||
              lastUserMessage.includes("mercado") || 
              lastUserMessage.includes("tendência") ||
              lastUserMessage.includes("transformação")) {
        stepIndex = 1;
        summary = `5 Tendências de mercado na área da saúde: 1) Telemedicina, 2) Saúde preventiva, 3) Saúde mental, 4) Nutrição funcional, 5) Bem-estar integrado. Foco na transformação prática do aluno com aplicação imediata do conhecimento.`;
      }
      // Step 2: Course Structure
      else if (lastJarvisResponse.includes("entregar seu curso") || 
              lastJarvisResponse.includes("tipos de conteúdo") ||
              lastUserMessage.includes("gravado") || 
              lastUserMessage.includes("vídeo") ||
              lastUserMessage.includes("híbrido")) {
        stepIndex = 2;
        summary = `Curso em formato ${lastUserMessage.includes("gravado") ? "gravado" : lastUserMessage.includes("híbrido") ? "híbrido" : "ao vivo"}. Conteúdo inclui vídeos, estudos de caso e exercícios práticos. Nível ${lastUserMessage.includes("avançado") ? "avançado" : lastUserMessage.includes("intermediário") ? "intermediário" : "básico"}.`;
      }
      // Step 3: Methodology
      else if (lastJarvisResponse.includes("método de ensino") || 
              lastJarvisResponse.includes("etapas principais") ||
              lastUserMessage.includes("método") || 
              lastUserMessage.includes("etapas") ||
              lastUserMessage.includes("metodologia")) {
        stepIndex = 3;
        summary = `Metodologia baseada em ${lastUserMessage.includes("5") ? "5" : lastUserMessage.includes("3") ? "3" : "4"} etapas principais. Abordagem prática com foco na aplicação do conhecimento. Método personalizado com etapas sequenciais e lógicas para o aprendizado progressivo.`;
      }
      // Step 4: Modular Structure
      else if (lastJarvisResponse.includes("dividiria o conteúdo") || 
              lastJarvisResponse.includes("módulos e aulas") ||
              lastUserMessage.includes("módulo") || 
              lastUserMessage.includes("aula") ||
              lastUserMessage.includes("estrutura")) {
        stepIndex = 4;
        summary = `Estrutura modular com ${lastUserMessage.includes("4") ? "4" : "3"} módulos principais. Cada módulo contém capítulos e aulas organizados progressivamente. Aulas com duração média de 15-20 minutos e conteúdos práticos para aplicação imediata.`;
      }
      // Step 5: Final Visualization
      else if (lastJarvisResponse.includes("revisar a estrutura") || 
              lastJarvisResponse.includes("pronto para publicar") ||
              lastUserMessage.includes("revisar") || 
              lastUserMessage.includes("publicar") ||
              lastUserMessage.includes("finalizar")) {
        stepIndex = 5;
        summary = `Curso completo estruturado na área da saúde, pronto para publicação. Estrutura de módulos definida com metodologia clara e aulas práticas. Carga horária total estimada em 20 horas com certificação para os alunos.`;
      }
      
      resolve({
        stepIndex,
        updateData: stepIndex !== null ? { summary } : null
      });
    }, 800);
  });
};
