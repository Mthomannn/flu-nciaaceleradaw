import { TargetLanguage, FluencyLevel } from '../types';
import {
  FastDrillItem,
  ROUND_1_DRILLS,
  ROUND_2_DRILLS,
  FifteenStructure,
  FIFTEEN_SUBSTITUTION_STRUCTURES,
  UnexpectedTestQuestion,
  UNEXPECTED_QUESTIONS_TEST,
  DetailedPhoneticError,
  TEN_PHONETIC_ERRORS_PORTUGUESE_ENGLISH,
  DailyPhoneticRoutineStep,
  TOP_3_DAILY_ROUTINE_10MIN,
  IntonationPattern,
  INTONATION_PATTERNS,
  WEEKLY_PRONUNCIATION_TEST_15,
  STAGE_1_OBJECTS_20,
  STAGE_2_ACTIONS_SHORT_20,
  STAGE_3_SIMPLE_QUESTIONS_20,
  STAGE_4_MENTAL_ROUTINE_10MIN,
  NativeBlockComparison,
  THIRTY_NATIVE_BLOCKS,
  DirectThinkingTestQuestion,
  DIRECT_THINKING_TEST_20,
} from './fluencyPillarsData';

// 1. ARMADILHAS FONÉTICAS (Inglês exclusivo para falantes de português)
export function getPhoneticErrorsForLanguage(
  _language: TargetLanguage,
  _level: FluencyLevel
): DetailedPhoneticError[] {
  return TEN_PHONETIC_ERRORS_PORTUGUESE_ENGLISH;
}

// 2. DRILLS RÁPIDOS & ESTÍMULOS DE 5 SEGUNDOS
export function getFastDrillsForLanguage(
  _language: TargetLanguage,
  _level: FluencyLevel
): { round1: FastDrillItem[]; round2: FastDrillItem[] } {
  return {
    round1: ROUND_1_DRILLS,
    round2: ROUND_2_DRILLS,
  };
}

export function getFastDrillsData(
  _language: TargetLanguage,
  _level: FluencyLevel
): { round1: FastDrillItem[]; round2: FastDrillItem[] } {
  return {
    round1: ROUND_1_DRILLS,
    round2: ROUND_2_DRILLS,
  };
}

// 3. ESTRUTURAS DE SUBSTITUIÇÃO
export function getSubstitutionStructuresForLanguage(
  _language: TargetLanguage,
  _level: FluencyLevel
): FifteenStructure[] {
  return FIFTEEN_SUBSTITUTION_STRUCTURES;
}

export function getSubstitutionDrillsData(
  _language: TargetLanguage,
  _level: FluencyLevel
): FifteenStructure[] {
  return FIFTEEN_SUBSTITUTION_STRUCTURES;
}

// 4. TREINADOR DE OUVIDO & FALA CONECTADA
export function getListeningPillarsData(
  _language: TargetLanguage,
  _level: FluencyLevel
) {
  return {
    reductions: [],
    contrastAudios: [],
  };
}

// 5. TESTES DE CHECKPOINT E REFLEXO INESPERADO
export function getWeeklyTestForLanguage(_language: TargetLanguage) {
  return WEEKLY_PRONUNCIATION_TEST_15;
}

export function getUnexpectedTestForLanguage(_language: TargetLanguage): UnexpectedTestQuestion[] {
  return UNEXPECTED_QUESTIONS_TEST;
}

export function getDirectThinkingTestForLanguage(_language: TargetLanguage): DirectThinkingTestQuestion[] {
  return DIRECT_THINKING_TEST_20;
}

// 6. PENSAMENTO DIRETO NO IDIOMA
export function getThinkingStagesData(
  _language: TargetLanguage,
  _level: FluencyLevel
) {
  return {
    objects: STAGE_1_OBJECTS_20,
    actions: STAGE_2_ACTIONS_SHORT_20,
    questions: STAGE_3_SIMPLE_QUESTIONS_20,
    routine: STAGE_4_MENTAL_ROUTINE_10MIN,
  };
}

export function getNativeBlocksForLanguage(
  _language: TargetLanguage,
  _level: FluencyLevel
): NativeBlockComparison[] {
  return THIRTY_NATIVE_BLOCKS;
}

export function getIntonationPatternsForLanguage(_language: TargetLanguage): IntonationPattern[] {
  return INTONATION_PATTERNS;
}

export function getPhoneticRoutineForLanguage(_language: TargetLanguage): DailyPhoneticRoutineStep[] {
  return TOP_3_DAILY_ROUTINE_10MIN;
}
