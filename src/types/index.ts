
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

// Definição das perguntas guiadas por etapa
export const stepsQuestions = {
  0: { // Perfil do Especialista
    questions: [
      "Qual é sua área de especialização na saúde?",
      "Qual tema principal você deseja ensinar?",
      "Quem é o público-alvo ideal para esse curso?"
    ],
    expectations: "Área de especialização, temática principal, público-alvo, habilidades e diferenciais"
  },
  1: { // Análise de Mercado
    questions: [
      "Quais tendências ou temas atuais se conectam ao seu curso?",
      "Qual transformação você quer gerar no seu aluno?",
      "Deseja sugestões de temas baseados nas tendências de mercado?"
    ],
    expectations: "Tema do curso, promessa de transformação ('De... Para...'), tendências do mercado"
  },
  2: { // Estrutura do Curso
    questions: [
      "Como você deseja entregar seu curso? (ex: gravado, ao vivo)",
      "Quais tipos de conteúdo você quer usar? (ex: vídeo, texto, quiz)",
      "Qual é o nível de complexidade do curso? (básico, intermediário, avançado)"
    ],
    expectations: "Formato principal, tipos de conteúdo, nível do curso"
  },
  3: { // Metodologia
    questions: [
      "Como você costuma ensinar esse conteúdo na prática?",
      "Quantas etapas você costuma seguir no seu método? (3, 5, outro)",
      "Deseja que eu gere uma metodologia com base no seu tema?"
    ],
    expectations: "Nome da metodologia, número de etapas, estrutura das etapas"
  },
  4: { // Estrutura Modular
    questions: [
      "Como você dividiria seu conteúdo em partes lógicas?",
      "Deseja que eu gere uma estrutura com base na sua metodologia?",
      "Deseja incluir tempo estimado e tipo de conteúdo para cada aula?"
    ],
    expectations: "Módulos, capítulos por módulo, aulas por capítulo com detalhes"
  },
  5: { // Visualização Final
    questions: [
      "Deseja revisar a estrutura final do curso?",
      "Está satisfeito com o resultado ou deseja ajustar algo?",
      "Deseja finalizar e publicar o curso agora?"
    ],
    expectations: "Resumo completo do curso com nome, nível, estrutura e carga horária"
  }
};
