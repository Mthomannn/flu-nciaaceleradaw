import { TargetLanguage } from '../types';

export interface Milestone100Hours {
  id: string;
  hourRange: string;
  stageName: string;
  focusTitle: string;
  description: string;
  targetPillars: string[];
  keyCompetencies: string[];
  checkpointGoal: string;
  hoursAccumulated: number;
  badge: string;
}

export interface Foundation100HoursPlan {
  totalHours: 100;
  levelSpan: 'Nível 0 ao A1 Completo';
  objective: string;
  methodology: string;
  milestones: Milestone100Hours[];
  hoursDistribution: {
    category: string;
    hours: number;
    percentage: number;
    purpose: string;
    pillars: string[];
  }[];
  weeklyScheduleTemplate: {
    week: string;
    hoursTarget: number;
    phaseTitle: string;
    coreActivities: string;
  }[];
}

export const FOUNDATION_100_HOURS_ROADMAP: Foundation100HoursPlan = {
  totalHours: 100,
  levelSpan: 'Nível 0 ao A1 Completo',
  objective: 'Garantir evolução gradativa estruturada do Nível Zero absoluto até a consolidação plena do Nível A1 com base extremamente sólida em fonética, reflexo oral, decodificação auditiva e vocabulário ativo.',
  methodology: 'Engenharia de Aquisição Progressiva 80/20: sem sobrecarga de gramática abstrata, com 100% de aplicação ativa distribuída em 4 marcos cumulativos.',
  milestones: [
    {
      id: 'm1_zero_fonetica',
      hourRange: 'Horas 01 a 25',
      stageName: 'Marco 1: Fundação Fonética & Sobrevivência Instantânea',
      focusTitle: 'Destravar o Aparelho Fonador & Eliminar Vícios Fonéticos Iniciais',
      description: 'Primeiro contato com o idioma sem bloqueio. Treino motor dos músculos da boca para sons inexistentes no português (TH /θ/ /ð/, R retroflexo, vogais curtas vs longas, eliminação do "i" parasita). Aquisição dos 50 blocos de sobrevivência imediata.',
      targetPillars: ['Pronúncia & Fonética', 'Treinador de Ouvido', 'Vocabulário 80/20'],
      keyCompetencies: [
        'Produção limpa dos sons primários e pares mínimos sem epêntese',
        'Cumprimentos, apresentações pessoais, identificação de números e alfabeto',
        'Pedir socorro comunicativo ("Speak slowly", "I don\'t understand", "Could you repeat?")',
        'Reconhecer 50 blocos de alta frequência auditiva com áudio nativo',
      ],
      checkpointGoal: 'Avaliação do Marco 1: Gravar autoapresentação limpa de 60 segundos e acertar 90%+ dos pares mínimos fundamentais.',
      hoursAccumulated: 25,
      badge: 'Brotando Sons (0-25h)',
    },
    {
      id: 'm2_a1_estruturas',
      hourRange: 'Horas 26 a 50',
      stageName: 'Marco 2: Blocos Funcionais & Eliminação da Tradução Mental',
      focusTitle: 'Automatização de 150 Blocos Nativos sem Traduzir',
      description: 'Transição do vocabulário isolado para chunks naturais de conversação. Início dos drills de substituição rápida (5 segundos). Conexão direta entre conceito visual/sensorial e som no idioma, desligando o português mental.',
      targetPillars: ['Vocabulário de Alta Frequência', 'Pensar no Idioma', 'Resposta Rápida'],
      keyCompetencies: [
        'Dominar 150 blocos cotidianos (necessidades, pedidos, compras, horários e transporte)',
        'Etapas 1 e 2 do Pensamento Direto: nomear objetos ao redor e narrar micro-ações físicas',
        'Substituição automática de sujeito e verbos chave no presente contínuo e simples',
        'Responder perguntas diretas em menos de 5 segundos sem formular frases em português',
      ],
      checkpointGoal: 'Avaliação do Marco 2: Responder 15 perguntas de reflexo consecutivas em menos de 5s cada.',
      hoursAccumulated: 50,
      badge: 'Raízes Fortes (26-50h)',
    },
    {
      id: 'm3_a1_listening',
      hourRange: 'Horas 51 a 75',
      stageName: 'Marco 3: Decodificação Auditiva Real & Fala Conectada',
      focusTitle: 'Destravar o Ouvido para Fala Nativa e Reduções Cotidianas',
      description: 'Treino intensivo de ouvido com sessões cronometradas (3 e 5 minutos) e vídeos curtos com legenda tríplice. Decodificação de reduções ("gonna", "wanna", "coulda", linked sounds) para não travar quando o nativo falar em ritmo natural.',
      targetPillars: ['Treinador de Ouvido', 'Conversação Real', 'Imersão 360°'],
      keyCompetencies: [
        'Compreensão de 80%+ de diálogos estruturados de 3 e 5 minutos em velocidade nativa',
        'Prática de shadowing sincronizado em frases completas mantendo entonação e ritmo',
        'Simulações de situações práticas: pedir comida no restaurante, direções na rua, compras',
        'Micro-blocos diários de imersão passiva e ativa em casa sem necessidade de viagem',
      ],
      checkpointGoal: 'Avaliação do Marco 3: Shadowing contínuo de 2 minutos sem interrupção e 85%+ de acerto na compreensão de áudio nativo.',
      hoursAccumulated: 75,
      badge: 'Ouvido Desperto (51-75h)',
    },
    {
      id: 'm4_a1_consolidacao',
      hourRange: 'Horas 76 a 100',
      stageName: 'Marco 4: Consolidação Plena A1 & Autonomia de Conversação',
      focusTitle: 'Base Extremamente Sólida & Diálogos Spontâneos de 5 a 10 Minutos',
      description: 'Consolidação das 300 palavras de máxima frequência (65% de cobertura de qualquer conversa real). Diálogos com o parceiro IA, monólogo diário solitário de 1 a 3 minutos e prova de autonomia para avanço com segurança ao Nível A2.',
      targetPillars: ['Conversação Real', 'Arquiteto da Fluência', 'Resposta Rápida', 'Pensar no Idioma'],
      keyCompetencies: [
        'Manter 5 a 10 minutos de diálogo contínuo sem travar sobre temas do cotidiano',
        'Monólogo solitário espontâneo de 3 minutos falando sobre sua rotina e planos imediatos',
        'Uso natural de conectivos de continuidade ("actually", "so", "because", "I mean")',
        '300 cartões Anki SRS consolidados no estágio "dominada" ou "revisão espaçada"',
      ],
      checkpointGoal: 'Avaliação do Marco 4 (Certificação A1 Sólida): Diálogo completo de 7 minutos com o Parceiro IA e auditoria fonética aprovada.',
      hoursAccumulated: 100,
      badge: 'Base Inabalável A1 (76-100h)',
    },
  ],
  hoursDistribution: [
    {
      category: 'Input Auditivo & Decodificação',
      hours: 30,
      percentage: 30,
      purpose: 'Treinar o cérebro para reconhecer padrões sonoros, contrações nativas e entonação sem esforço consciente.',
      pillars: ['Treinador de Ouvido', 'Imersão 360°'],
    },
    {
      category: 'Reflexo Oral & Drills de Fala',
      hours: 25,
      percentage: 25,
      purpose: 'Quebrar o hábito da tradução mental através de repetição rápida contra o relógio (limite de 5s).',
      pillars: ['Resposta Rápida', 'Conversação Real'],
    },
    {
      category: 'Vocabulário SRS 80/20 & Chunks',
      hours: 20,
      percentage: 20,
      purpose: 'Fixação de 300 blocos essenciais com repetição espaçada e frases de contexto real.',
      pillars: ['Vocabulário de Alta Frequência'],
    },
    {
      category: 'Fonética, Pronúncia & Mecânica Muscular',
      hours: 15,
      percentage: 15,
      purpose: 'Ajuste anatômico de língua e lábios, eliminação do "i" parasita e auditoria contínua de inteligibilidade.',
      pillars: ['Pronúncia & Fonética'],
    },
    {
      category: 'Pensamento Direto & Monólogo Solitário',
      hours: 10,
      percentage: 10,
      purpose: 'Treino de conexão direta estímulo-som, narração mental e prática de falar sozinho.',
      pillars: ['Pensar no Idioma', 'Arquiteto da Fluência'],
    },
  ],
  weeklyScheduleTemplate: [
    {
      week: 'Semanas 1 a 3 (0-25h)',
      hoursTarget: 25,
      phaseTitle: 'Fase Inicial: Nível Zero Absoluto',
      coreActivities: 'Foco em sons básicos, alfabeto fonético, 50 frases de sobrevivência, números e autoapresentação.',
    },
    {
      week: 'Semanas 4 a 6 (26-50h)',
      hoursTarget: 25,
      phaseTitle: 'Fase de Construção: Transição para o A1',
      coreActivities: 'Expansão para 150 blocos, drills de substituição de 5s, rotina diária e primeiras perguntas de reflexo.',
    },
    {
      week: 'Semanas 7 a 9 (51-75h)',
      hoursTarget: 25,
      phaseTitle: 'Fase de Decodificação: Escuta & Fala Conectada',
      coreActivities: 'Áudios cronometrados (3 e 5 min), shadowing intensivo, decodificação de reduções e diálogos guiados.',
    },
    {
      week: 'Semanas 10 a 12 (76-100h)',
      hoursTarget: 25,
      phaseTitle: 'Fase de Consolidação: Base Extremamente Sólida',
      coreActivities: 'Consolidação dos 300 blocos no Anki, diálogos contínuos com IA, monólogo diário e prova de autonomia A1.',
    },
  ],
};

/**
 * Retorna o progresso atual do aluno dentro do roadmap de 100 horas (0 a A1).
 * @param completedHours Horas já praticadas
 */
export function getMilestoneForHours(completedHours: number): {
  currentMilestone: Milestone100Hours;
  milestoneIndex: number;
  progressPercent: number;
  remainingHoursToA1: number;
} {
  const safeHours = Math.max(0, Math.min(100, completedHours));
  const remaining = Math.max(0, 100 - safeHours);
  const percent = Math.round((safeHours / 100) * 100);

  let milestoneIndex = 0;
  if (safeHours > 75) milestoneIndex = 3;
  else if (safeHours > 50) milestoneIndex = 2;
  else if (safeHours > 25) milestoneIndex = 1;
  else milestoneIndex = 0;

  return {
    currentMilestone: FOUNDATION_100_HOURS_ROADMAP.milestones[milestoneIndex],
    milestoneIndex,
    progressPercent: percent,
    remainingHoursToA1: remaining,
  };
}
