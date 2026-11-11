export type TargetLanguage = 'Inglês';

export type FluencyLevel = 'Zero' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export type MainObjective = 'Conversar' | 'Viagem' | 'Trabalho' | 'Morar Fora' | 'Provas';

export type ModuleId =
  | 'overview'
  | 'architect'
  | 'vocabulary'
  | 'conversation'
  | 'listening'
  | 'drills'
  | 'pronunciation'
  | 'thinking'
  | 'immersion';

export interface UserProfile {
  language: TargetLanguage;
  level: FluencyLevel;
  objective: MainObjective;
  minutesPerDay: number;
  streakDays: number;
  totalXp: number;
  completedItems: string[];
}

export type AnkiRating = 'again' | 'hard' | 'good' | 'easy';

export interface AnkiCardData {
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  lapses: number;
  dueDate: string; // YYYY-MM-DD
  state: 'new' | 'learning' | 'review';
  lastReviewed?: string;
}

export interface VocabularyItem {
  id: string;
  wordOrPhrase: string;
  translation: string;
  phoneticApprox?: string;
  category: string;
  naturalSentence1: string;
  naturalSentence1Tr: string;
  naturalSentence2: string;
  naturalSentence2Tr: string;
  commonCollocation: string;
  isEssential50?: boolean;
  masteryStatus: 'nova' | 'aprendendo' | 'dominada';
  ankiData?: AnkiCardData;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  translation?: string;
  timestamp: string;
  corrections?: {
    mistake: string;
    correct: string;
    explanation: string;
  }[];
  newWords?: {
    word: string;
    translation: string;
    usage: string;
  }[];
  followUpChallenge?: string;
}

export interface TimedAudioSegment {
  speaker: string;
  text: string;
  translation: string;
  timestamp: string; // mm:ss
}

export interface TimedAudioSession {
  id: string;
  title: string;
  durationMinutes: 3 | 5 | 7 | 10;
  language: TargetLanguage;
  level: FluencyLevel;
  topic: string;
  summary: string;
  externalStreamUrl: string;
  streamSourceLabel: string;
  segments: TimedAudioSegment[];
  comprehensionQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface VideoSubtitleLine {
  id: string;
  startTimeSec: number;
  endTimeSec: number;
  speaker?: string;
  originalText: string;
  translatedText: string;
}

export interface ShortVideoLesson {
  id: string;
  title: string;
  duration: string;
  durationMinutes: 3 | 5 | 7 | 10;
  language: TargetLanguage;
  level: FluencyLevel;
  topic: string;
  youtubeId: string;
  culturalContext: string;
  keyPhrases: { phrase: string; translation: string }[];
  subtitles: VideoSubtitleLine[];
}

export interface ListeningItem {
  id: string;
  level: 1 | 2 | 3 | 4 | 5;
  spokenAudioText: string;
  translation: string;
  speed: number;
  connectedSpeechBreakdown: string;
  reductionFocus: string;
  shadowingPrompt: string;
}

export interface FastDrill {
  id: string;
  promptQuestion: string;
  promptTranslation: string;
  suggestedPattern: string;
  sampleNaturalAnswer: string;
  timeLimitSec: number;
}

export interface SubstitutionDrill {
  id: string;
  basePattern: string;
  basePatternTr: string;
  variations: {
    slot: string;
    replacement: string;
    fullSentence: string;
    translation: string;
  }[];
}

export interface PronunciationTrap {
  id: string;
  name: string;
  targetSound: string;
  whatBraziliansDo: string;
  whatYouShouldDo: string;
  mouthGuide: string;
  incorrectExample: string;
  correctExample: string;
  minimalPairs: {
    wordA: string;
    wordB: string;
    meaningA: string;
    meaningB: string;
  }[];
  practiceWords: string[];
}

export interface ThinkingStage {
  stageNumber: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  items: {
    id: string;
    stimulus: string;
    promptHint: string;
    naturalExpression: string;
    literalTranslationMistake?: string;
    whyItMatters?: string;
  }[];
}

export interface ImmersionBlock {
  id: string;
  timeSlot: string;
  periodName: string;
  inputTask: string;
  outputTask: string;
  microVocabTask: string;
  durationMinutes: number;
  completed?: boolean;
}

export interface LinguisticAptitudePillar {
  name: string;
  score: number; // 0-100
  status: 'crítico' | 'em desenvolvimento' | 'sólido' | 'avançado';
  diagnostic: string;
  recommendedModule: ModuleId;
  actionText: string;
}

export interface LinguisticAgentDiagnosis {
  timestamp: string;
  language: TargetLanguage;
  level: FluencyLevel;
  overallAptitudeScore: number; // 0-100
  aptitudeTitle: string;
  pillars: {
    phonetics: LinguisticAptitudePillar;
    oralReflex: LinguisticAptitudePillar;
    activeVocab: LinguisticAptitudePillar;
    listeningDecoding: LinguisticAptitudePillar;
  };
  stagnationRisk: {
    hasRisk: boolean;
    level: 'baixo' | 'moderado' | 'alto';
    identifiedPlateau: string;
    antiPlateauPrescription: string;
    scientificBasis: string;
  };
  dailyLinguisticMissions: {
    id: string;
    title: string;
    pillarId: ModuleId;
    durationMinutes: number;
    methodology: string;
    instruction: string;
  }[];
  seniorLinguisticQuote: {
    concept: string;
    explanation: string;
  };
}

