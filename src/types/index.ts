
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'jarvis';
  timestamp: Date;
}

export interface CourseStepData {
  id: number;
  title: string;
  summary: string;
  isDefined: boolean;
  icon?: string;
}

export interface CourseData {
  steps: CourseStepData[];
  progress: number;
}

export interface ConversationContext {
  lastUserMessage?: string;
  lastJarvisResponse?: string;
  recentHistory: Message[];
}

export interface AiUpdateResponse {
  stepIndex: number | null;
  updateData: {
    summary: string;
  } | null;
}

export const queryKeys = {
  courseData: ['courseData'] as const,
};

export const initialCourseData: CourseData = {
  progress: 0,
  steps: [
    {
      id: 0,
      title: "Perfil do Especialista",
      summary: "Aguardando informações...",
      isDefined: false,
      icon: "👤",
    },
    {
      id: 1,
      title: "Análise de Mercado",
      summary: "Aguardando informações...",
      isDefined: false,
      icon: "📊",
    },
    {
      id: 2,
      title: "Formato e Complexidade",
      summary: "Aguardando informações...",
      isDefined: false,
      icon: "🧩",
    },
    {
      id: 3,
      title: "Metodologia",
      summary: "Aguardando informações...",
      isDefined: false,
      icon: "🎓",
    },
    {
      id: 4,
      title: "Estrutura Modular",
      summary: "Aguardando informações...",
      isDefined: false,
      icon: "📝",
    },
    {
      id: 5,
      title: "Visualização Final",
      summary: "Aguardando informações...",
      isDefined: false,
      icon: "🏆",
    },
  ]
};
