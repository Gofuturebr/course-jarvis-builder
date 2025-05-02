
import { v4 as uuidv4 } from "uuid";
import { Message } from "@/types";
import { env } from "./env";

interface GroqChatOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

const defaultOptions: GroqChatOptions = {
  systemPrompt: "Você é o Jarvis, um assistente especializado em ajudar a criar cursos. Seja amigável, profissional e conciso. Ajude o usuário a definir e estruturar seu curso de forma eficaz.",
  temperature: 0.7,
  maxTokens: 2000,
  model: "llama3-8b-8192"
};

export const createGroqChatMessage = (content: string): Message => ({
  id: uuidv4(),
  content,
  role: "jarvis",
  timestamp: new Date(),
});

export async function askGroq(
  messages: Message[],
  options: GroqChatOptions = {}
): Promise<string> {
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Get API key from environment variable
  const apiKey = env.GROQ_API_KEY;
  
  if (!apiKey) {
    console.error("API key not found. Please set your GROQ API key in .env file as VITE_GROQ_API_KEY.");
    throw new Error("Missing GROQ API key");
  }

  // Format messages for the Groq API
  const formattedMessages = [
    {
      role: "system",
      content: mergedOptions.systemPrompt
    },
    ...messages.map(msg => ({
      role: msg.role === "jarvis" ? "assistant" : "user",
      content: msg.content
    }))
  ];

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: mergedOptions.model,
        messages: formattedMessages,
        temperature: mergedOptions.temperature,
        max_tokens: mergedOptions.maxTokens
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na resposta da API GROQ:", errorText);
      throw new Error(`Erro na chamada da API GROQ: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Erro ao chamar API GROQ:", error);
    throw new Error("Não foi possível obter uma resposta do assistente neste momento.");
  }
}
