
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
  currentStepIndex?: number;
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
      title: "Estrutura do Curso",
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

// Definição das perguntas guiadas por etapa - UPDATED
export const stepsQuestions = {
  0: { // Perfil do Especialista
    questions: [
      "Qual é sua área de especialização na saúde?",
      "Qual é o tema principal que você deseja ensinar neste curso?",
      "Pode me ajudar a definir meu perfil como especialista?"
    ],
    expectations: "Área de especialização, temática principal, público-alvo, habilidades e diferenciais",
    showAdvanceOptions: false
  },
  1: { // Análise de Mercado
    questions: [
      "Faça uma pesquisa e ofereça 5 temas que são tendências nesse assunto",
      "Qual transformação prática quero gerar no meu aluno com este curso?",
      "Me ajude a identificar tendências de mercado para o curso"
    ],
    expectations: "Tema do curso, promessa de transformação ('De... Para...'), tendências do mercado",
    showAdvanceOptions: false
  },
  2: { // Estrutura do Curso
    questions: [
      "Como prefiro entregar meu curso? (Gravado, Ao Vivo, Híbrido)",
      "Quais tipos de conteúdo quero usar no curso?",
      "Pode me ajudar a definir a estrutura ideal?"
    ],
    expectations: "Formato principal, tipos de conteúdo, nível do curso",
    showAdvanceOptions: false
  },
  3: { // Metodologia
    questions: [
      "Como organizo meu método de ensino?",
      "Quantas etapas principais meu método possui?",
      "Pode me ajudar a estruturar uma metodologia eficaz?"
    ],
    expectations: "Nome da metodologia, número de etapas, estrutura das etapas",
    showAdvanceOptions: false
  },
  4: { // Estrutura Modular
    questions: [
      "Como divido o conteúdo em módulos e aulas?",
      "Pode gerar uma estrutura com títulos para as aulas?",
      "Preciso de ajuda para organizar os módulos do curso"
    ],
    expectations: "Módulos, capítulos por módulo, aulas por capítulo com detalhes",
    showAdvanceOptions: false
  },
  5: { // Visualização Final
    questions: [
      "Gostaria de revisar a estrutura completa do curso",
      "Estou pronto para publicar ou preciso ajustar algo?",
      "Me ajude a finalizar o curso para publicação"
    ],
    expectations: "Resumo completo do curso com nome, nível, estrutura e carga horária",
    showAdvanceOptions: false
  }
};
