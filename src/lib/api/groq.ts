
import { AiUpdateResponse, ConversationContext } from "@/types";
import { env } from "../env";

/**
 * Function to call the GROQ API for course context analysis
 */
export const callGroqAPI = async (context: ConversationContext): Promise<AiUpdateResponse> => {
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
        model: "llama3-8b-8192",
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
