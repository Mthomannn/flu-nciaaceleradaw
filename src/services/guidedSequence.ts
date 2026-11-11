import { ModuleId } from '../types';

export interface GuidedStep {
  stepNumber: number;
  phaseNumber: 1 | 2 | 3 | 4;
  phaseTitle: string;
  hourRange: string;
  title: string;
  shortTitle: string;
  targetModule: ModuleId;
  subTab?: string;
  description: string;
  learningGoal: string;
  actionText: string;
  xpReward: number;
  iconName: string;
}

export const GUIDED_EVOLUTIONARY_STEPS: GuidedStep[] = [
  // FASE 1: DESBLOQUEIO FONÉTICO E PRÉ-A1 (Horas 1 a 25)
  {
    stepNumber: 1,
    phaseNumber: 1,
    phaseTitle: 'Fase 1: Fundação Fonética & Pré-A1 (Horas 1-25)',
    hourRange: 'Horas 01 a 08',
    title: 'Desbloqueio Fonético & Eliminação do "i" Parasita',
    shortTitle: '1. Desbloqueio Fonético',
    targetModule: 'pronunciation',
    subTab: 'tenTraps',
    description: 'Treino da musculatura facial e eliminação do vício brasileiro de adicionar som de "i" ao final de consoantes mudas (like, need, good, stop).',
    learningGoal: 'Falar 10 palavras com consoantes mudas travando a respiração sem soltar vogal de apoio no final.',
    actionText: 'Praticar Fonética Forense',
    xpReward: 30,
    iconName: 'Mic',
  },
  {
    stepNumber: 2,
    phaseNumber: 1,
    phaseTitle: 'Fase 1: Fundação Fonética & Pré-A1 (Horas 1-25)',
    hourRange: 'Horas 09 a 16',
    title: 'As 100 Palavras Vitais & Pronomes em Fluxo Oral',
    shortTitle: '2. As 100 Palavras Vitais',
    targetModule: 'vocabulary',
    subTab: 'anki',
    description: 'Memorização sólida com repetição espaçada (SRS) dos pronomes, preposições e termos que compõem 50% de qualquer conversa cotidiana.',
    learningGoal: 'Consolidar as primeiras 25 cartas Anki com avaliação "Bom" ou "Fácil" e áudio nativo.',
    actionText: 'Estudar Flashcards SRS',
    xpReward: 35,
    iconName: 'BookOpen',
  },
  {
    stepNumber: 3,
    phaseNumber: 1,
    phaseTitle: 'Fase 1: Fundação Fonética & Pré-A1 (Horas 1-25)',
    hourRange: 'Horas 17 a 25',
    title: 'Ritmo Acentual & O Som Schwa (/ə/)',
    shortTitle: '3. Ritmo & Schwa',
    targetModule: 'listening',
    subTab: 'timed-audios',
    description: 'Destravar o ouvido para o ritmo "stress-timed" do inglês: palavras de conteúdo são enfatizadas e palavras gramaticais são encurtadas no som neutro /ə/.',
    learningGoal: 'Ouvir e decodificar 3 áudios em velocidade normal (1.0x) e pausada (0.75x) identificando o ritmo.',
    actionText: 'Treinar Decodificação de Ouvido',
    xpReward: 40,
    iconName: 'Headphones',
  },

  // FASE 2: PILARES ESTRUTURAIS & CHUNKS (Horas 26 a 50)
  {
    stepNumber: 4,
    phaseNumber: 2,
    phaseTitle: 'Fase 2: Pilares Estruturais & Chunks (Horas 26-50)',
    hourRange: 'Horas 26 a 33',
    title: 'Os 20 Verbos Fundamentais em Ação Real',
    shortTitle: '4. Verbos de Ação',
    targetModule: 'vocabulary',
    subTab: 'cards',
    description: 'Automatização imediata dos verbos mais poderosos (get, do, make, take, go, have) em blocos funcionais sem decorar listas gramaticais.',
    learningGoal: 'Compreender o uso de chunks de alta ocorrência em situações práticas do dia a dia.',
    actionText: 'Praticar Verbos em Chunks',
    xpReward: 40,
    iconName: 'Layers',
  },
  {
    stepNumber: 5,
    phaseNumber: 2,
    phaseTitle: 'Fase 2: Pilares Estruturais & Chunks (Horas 26-50)',
    hourRange: 'Horas 34 a 41',
    title: 'Perguntas Automáticas de Sobrevivência (Drills de 5s)',
    shortTitle: '5. Drills de 5 Segundos',
    targetModule: 'drills',
    subTab: 'levelDrills',
    description: 'Treino intensivo contra o relógio: formular e responder perguntas (Who, What, Where, When, Why, How) em menos de 5 segundos para quebrar a tradução interna.',
    learningGoal: 'Responder 5 perguntas consecutivas antes do cronômetro de 5 segundos zerar.',
    actionText: 'Iniciar Drills de Reflexo',
    xpReward: 45,
    iconName: 'Timer',
  },
  {
    stepNumber: 6,
    phaseNumber: 2,
    phaseTitle: 'Fase 2: Pilares Estruturais & Chunks (Horas 26-50)',
    hourRange: 'Horas 42 a 50',
    title: 'Conectivos de Conversação & Primeiro Diálogo IA',
    shortTitle: '6. Diálogo Guiado',
    targetModule: 'conversation',
    description: 'Prática de conversação ativa com o parceiro IA utilizando conectores de fluxo ("because", "so", "actually", "I mean") para unir ideias com naturalidade.',
    learningGoal: 'Completar 3 turnos de conversa recebendo feedback pontual do parceiro IA.',
    actionText: 'Conversar com Parceiro IA',
    xpReward: 50,
    iconName: 'MessageSquare',
  },

  // FASE 3: CONTRAÇÕES & CONNECTED SPEECH (Horas 51 a 75)
  {
    stepNumber: 7,
    phaseNumber: 3,
    phaseTitle: 'Fase 3: Contrações & Connected Speech (Horas 51-75)',
    hourRange: 'Horas 51 a 58',
    title: 'As 15 Grandes Contrações Orais do Cotidiano',
    shortTitle: '7. Contrações Orais',
    targetModule: 'vocabulary',
    subTab: 'contractions',
    description: 'Domínio das fusões fonéticas que nativos usam o tempo todo: gonna, wanna, gotta, lemme, gimme, kinda, outta, shoulda.',
    learningGoal: 'Acertar 10 desafios do quiz de contrações e entender seu som exato em fala acelerada.',
    actionText: 'Desafio de Contrações',
    xpReward: 50,
    iconName: 'Zap',
  },
  {
    stepNumber: 8,
    phaseNumber: 3,
    phaseTitle: 'Fase 3: Contrações & Connected Speech (Horas 51-75)',
    hourRange: 'Horas 59 a 66',
    title: 'Linking Words & Shadowing de Escuta Ativa',
    shortTitle: '8. Shadowing Conectado',
    targetModule: 'listening',
    subTab: 'connected-speech',
    description: 'Entenda como nativos ligam a consoante final de uma palavra na vogal inicial da próxima ("pick it up" ➔ "pi-ki-tâp").',
    learningGoal: 'Gravar sua voz em shadowing reproduzindo o mesmo fluxo contínuo do áudio nativo.',
    actionText: 'Praticar Shadowing',
    xpReward: 55,
    iconName: 'Volume2',
  },
  {
    stepNumber: 9,
    phaseNumber: 3,
    phaseTitle: 'Fase 3: Contrações & Connected Speech (Horas 51-75)',
    hourRange: 'Horas 67 a 75',
    title: 'Simulação de Situações Reais (Café, Hotel, Viagem)',
    shortTitle: '9. Simulação na Prática',
    targetModule: 'conversation',
    description: 'Roleplays práticos com a IA personificando atendente de café, recepcionista de hotel ou motorista, testando autonomia em situações imprevisíveis.',
    learningGoal: 'Fazer um pedido completo em inglês com perguntas e respostas sem travar.',
    actionText: 'Iniciar Roleplay Prático',
    xpReward: 60,
    iconName: 'Sparkles',
  },

  // FASE 4: AUTONOMIA BÁSICA & DRILLS FINAIS (Horas 76 a 100)
  {
    stepNumber: 10,
    phaseNumber: 4,
    phaseTitle: 'Fase 4: Autonomia Básica & Base Sólida (Horas 76-100)',
    hourRange: 'Horas 76 a 83',
    title: 'Pensamento Direto: Parar de Traduzir Mentalmente',
    shortTitle: '10. Pensar Direto',
    targetModule: 'thinking',
    subTab: 'fourStages',
    description: 'Aplicação das 4 fases neuro-linguísticas para eliminar a ponte com o português: rotular objetos, narração interna e falar sozinho em micro-blocos.',
    learningGoal: 'Praticar a etapa de narração mental de 2 minutos sobre o que você está fazendo agora.',
    actionText: 'Treinar Pensamento Direto',
    xpReward: 60,
    iconName: 'Brain',
  },
  {
    stepNumber: 11,
    phaseNumber: 4,
    phaseTitle: 'Fase 4: Autonomia Básica & Base Sólida (Horas 76-100)',
    hourRange: 'Horas 84 a 92',
    title: 'Bateria de 40 Rodadas de Reflexo Rápido',
    shortTitle: '11. Bateria 40 Drills',
    targetModule: 'drills',
    subTab: 'rapid40',
    description: 'O teste definitivo de agilidade: 40 perguntas inesperadas consecutivas para consolidar automatismo total sem hesitação.',
    learningGoal: 'Responder a rodada de 20 perguntas com índice de acerto imediato acima de 85%.',
    actionText: 'Enfrentar Bateria de Drills',
    xpReward: 70,
    iconName: 'Flame',
  },
  {
    stepNumber: 12,
    phaseNumber: 4,
    phaseTitle: 'Fase 4: Autonomia Básica & Base Sólida (Horas 76-100)',
    hourRange: 'Horas 93 a 100',
    title: 'Consolidação Plena A1 & Prova de Conversação Contínua',
    shortTitle: '12. Consolidação A1',
    targetModule: 'conversation',
    description: 'Marco final das 100 horas: conversa contínua de 10 minutos abordando rotina, gostos, opiniões simples e planos com pronúncia limpa e auditada.',
    learningGoal: 'Concluir a avaliação de conversação do Marco 4 e receber a certificação de base sólida.',
    actionText: 'Fazer Avaliação A1 Final',
    xpReward: 100,
    iconName: 'Award',
  },
];

const GUIDED_STEP_STORAGE_KEY = 'fluency_guided_current_step';
const COMPLETED_STEPS_STORAGE_KEY = 'fluency_guided_completed_steps';

export function getSavedGuidedStep(): number {
  try {
    const raw = localStorage.getItem(GUIDED_STEP_STORAGE_KEY);
    if (raw) {
      const num = parseInt(raw, 10);
      if (!isNaN(num) && num >= 1 && num <= 12) return num;
    }
  } catch {}
  return 1; // Padrão: Passo 1
}

export function saveGuidedStep(step: number): void {
  try {
    const safe = Math.max(1, Math.min(12, step));
    localStorage.setItem(GUIDED_STEP_STORAGE_KEY, safe.toString());
  } catch {}
}

export function getCompletedGuidedSteps(): number[] {
  try {
    const raw = localStorage.getItem(COMPLETED_STEPS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function markStepAsCompleted(stepNumber: number): number[] {
  const current = getCompletedGuidedSteps();
  if (!current.includes(stepNumber)) {
    const updated = [...current, stepNumber].sort((a, b) => a - b);
    try {
      localStorage.setItem(COMPLETED_STEPS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    // Avançar automaticamente para o próximo passo se o concluído for o atual
    const currentStep = getSavedGuidedStep();
    if (currentStep === stepNumber && stepNumber < 12) {
      saveGuidedStep(stepNumber + 1);
    }
    return updated;
  }
  return current;
}

export function getGuidedStepData(stepNumber: number): GuidedStep {
  const found = GUIDED_EVOLUTIONARY_STEPS.find((s) => s.stepNumber === stepNumber);
  return found || GUIDED_EVOLUTIONARY_STEPS[0];
}
