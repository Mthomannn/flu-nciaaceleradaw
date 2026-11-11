import { TargetLanguage, FluencyLevel, ModuleId } from '../types';
import { getCurriculumFor } from '../data/curriculum';
import { getTimedAudioSessions, getShortVideoLessons } from '../data/listeningMediaData';
import { addDaysToDate, getTodayDateString } from './srs';
import { getActiveStudentId } from './studentService';

export type LessonMasteryStatus = 'new' | 'completed' | 'mastered' | 'review_due';

export interface LessonProgressEntry {
  lessonId: string;
  module: ModuleId | string;
  language: TargetLanguage;
  level: FluencyLevel;
  title: string;
  status: LessonMasteryStatus;
  completedCount: number;
  intervalDays: number;
  dueDate: string; // YYYY-MM-DD
  lastReviewed: string; // YYYY-MM-DD
  easeFactor: number;
}

export interface SuggestedLessonItem {
  id: string;
  module: ModuleId;
  moduleTitle: string;
  title: string;
  description: string;
  typeBadge: string;
  estimatedMinutes: number;
}

const STORAGE_PREFIX = 'fluency_lesson_progress_v2_';

function getStorageKey(language: TargetLanguage, level: FluencyLevel, userId?: string | null): string {
  const uid = userId !== undefined ? userId : getActiveStudentId();
  if (uid) {
    return `${STORAGE_PREFIX}${uid}_${language}_${level}`;
  }
  return `${STORAGE_PREFIX}guest_${language}_${level}`;
}

/**
 * Inicializa a plataforma 100% zerada para um novo usuário cadastrado.
 * Garante que lições concluídas ou dominadas de outros usuários não apareçam para o novo aluno.
 */
export function initializeCleanUserProgress(userId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`fluency_user_${userId}_is_fresh`, 'true');
    const languages: TargetLanguage[] = ['Inglês'];
    const levels: FluencyLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
    languages.forEach((lang) => {
      levels.forEach((lvl) => {
        localStorage.setItem(getStorageKey(lang, lvl, userId), JSON.stringify({}));
      });
    });
    window.dispatchEvent(
      new CustomEvent('fluency_lesson_progress_updated', {
        detail: { userId },
      })
    );
  } catch (e) {
    console.error('Erro ao inicializar progresso limpo para novo usuário:', e);
  }
}

export function getAllProgressForLevel(
  language: TargetLanguage,
  level: FluencyLevel,
  userId?: string | null
): Record<string, LessonProgressEntry> {
  if (typeof window === 'undefined') return {};
  try {
    const uid = userId !== undefined ? userId : getActiveStudentId();
    const key = getStorageKey(language, level, uid);
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }

    // Se é um usuário existente logando pela primeira vez após o isolamento de contas,
    // verifica se é um usuário antigo com histórico prévio na chave legada
    if (uid) {
      // Se este usuário foi criado como novo/zerado, mantém zerado
      const isFresh = localStorage.getItem(`fluency_user_${uid}_is_fresh`);
      if (isFresh) {
        return {};
      }

      // Usuário já cadastrado anteriormente: preserva histórico migrando da chave legada
      const legacyKey = `${STORAGE_PREFIX}${language}_${level}`;
      const legacyRaw = localStorage.getItem(legacyKey);
      if (legacyRaw) {
        try {
          const data = JSON.parse(legacyRaw);
          localStorage.setItem(key, JSON.stringify(data));
          return data;
        } catch {}
      }
    }

    return {};
  } catch {
    return {};
  }
}

export function saveAllProgressForLevel(
  language: TargetLanguage,
  level: FluencyLevel,
  data: Record<string, LessonProgressEntry>,
  userId?: string | null
): void {
  if (typeof window === 'undefined') return;
  try {
    const uid = userId !== undefined ? userId : getActiveStudentId();
    localStorage.setItem(getStorageKey(language, level, uid), JSON.stringify(data));
    window.dispatchEvent(
      new CustomEvent('fluency_lesson_progress_updated', {
        detail: { language, level, userId: uid },
      })
    );
  } catch (e) {
    console.error('Erro ao salvar progresso de lição:', e);
  }
}

export function getLessonStatus(
  language: TargetLanguage,
  level: FluencyLevel,
  lessonId: string
): LessonProgressEntry | null {
  const all = getAllProgressForLevel(language, level);
  return all[lessonId] || null;
}

export function isLessonCompleted(
  language: TargetLanguage,
  level: FluencyLevel,
  lessonId: string
): boolean {
  const entry = getLessonStatus(language, level, lessonId);
  return !!entry && (entry.status === 'completed' || entry.status === 'mastered');
}

export function isLessonMastered(
  language: TargetLanguage,
  level: FluencyLevel,
  lessonId: string
): boolean {
  const entry = getLessonStatus(language, level, lessonId);
  return !!entry && entry.status === 'mastered';
}

/**
 * Marca o exercício como feito (ao concluir uma tentativa)
 */
export function markLessonDone(
  language: TargetLanguage,
  level: FluencyLevel,
  lessonId: string,
  title: string,
  module: ModuleId | string,
  options?: { preserveMastered?: boolean }
): LessonProgressEntry {
  const all = getAllProgressForLevel(language, level);
  const existing = all[lessonId];
  const today = getTodayDateString();

  const isMastered = options?.preserveMastered && existing?.status === 'mastered';
  const newStatus: LessonMasteryStatus = isMastered ? 'mastered' : 'completed';
  const count = (existing?.completedCount || 0) + 1;
  const interval = existing?.intervalDays || 1;

  const updated: LessonProgressEntry = {
    lessonId,
    module,
    language,
    level,
    title,
    status: newStatus,
    completedCount: count,
    intervalDays: interval,
    dueDate: existing?.dueDate || addDaysToDate(today, 1),
    lastReviewed: today,
    easeFactor: existing?.easeFactor || 2.5,
  };

  all[lessonId] = updated;
  saveAllProgressForLevel(language, level, all);
  return updated;
}

/**
 * Marca a lição como "Já aprendida / Dominada"
 * Aplica intervalo de repetição espaçada mais longo (7 dias) e registra domínio.
 */
export function markLessonMastered(
  language: TargetLanguage,
  level: FluencyLevel,
  lessonId: string,
  title: string,
  module: ModuleId | string
): LessonProgressEntry {
  const all = getAllProgressForLevel(language, level);
  const existing = all[lessonId];
  const today = getTodayDateString();

  // Escalar repetição espaçada: se já era dominado, expandir para 14 ou 21 dias
  const previousInterval = existing?.intervalDays || 3;
  const nextInterval = Math.max(7, Math.round(previousInterval * 2));

  const updated: LessonProgressEntry = {
    lessonId,
    module,
    language,
    level,
    title,
    status: 'mastered',
    completedCount: (existing?.completedCount || 0) + 1,
    intervalDays: nextInterval,
    dueDate: addDaysToDate(today, nextInterval),
    lastReviewed: today,
    easeFactor: Math.min(3.0, (existing?.easeFactor || 2.5) + 0.15),
  };

  all[lessonId] = updated;
  saveAllProgressForLevel(language, level, all);
  return updated;
}

/**
 * Opção "Refazer":
 * Reseta o status para aprendizado e agenda nova repetição espaçada (ex: 1 dia ou imediata).
 */
export function refazerLesson(
  language: TargetLanguage,
  level: FluencyLevel,
  lessonId: string,
  title: string,
  module: ModuleId | string,
  srsIntervalDays: number = 1
): LessonProgressEntry {
  const all = getAllProgressForLevel(language, level);
  const existing = all[lessonId];
  const today = getTodayDateString();

  const updated: LessonProgressEntry = {
    lessonId,
    module,
    language,
    level,
    title,
    status: 'completed',
    completedCount: existing?.completedCount || 1,
    intervalDays: srsIntervalDays,
    dueDate: addDaysToDate(today, srsIntervalDays),
    lastReviewed: today,
    easeFactor: Math.max(1.3, (existing?.easeFactor || 2.5) - 0.2),
  };

  all[lessonId] = updated;
  saveAllProgressForLevel(language, level, all);
  return updated;
}

/**
 * Agenda intervalo de repetição espaçada manual (SRS)
 */
export function scheduleLessonSRS(
  language: TargetLanguage,
  level: FluencyLevel,
  lessonId: string,
  intervalDays: number,
  title: string,
  module: ModuleId | string
): LessonProgressEntry {
  const all = getAllProgressForLevel(language, level);
  const existing = all[lessonId];
  const today = getTodayDateString();

  const updated: LessonProgressEntry = {
    lessonId,
    module,
    language,
    level,
    title,
    status: existing?.status === 'mastered' ? 'mastered' : 'completed',
    completedCount: (existing?.completedCount || 0) + 1,
    intervalDays,
    dueDate: addDaysToDate(today, intervalDays),
    lastReviewed: today,
    easeFactor: existing?.easeFactor || 2.5,
  };

  all[lessonId] = updated;
  saveAllProgressForLevel(language, level, all);
  return updated;
}

/**
 * Sugere novos conteúdos no nível atual (A1, A2, etc.)
 * Filtrando o que já foi dominado e priorizando o próximo passo lógico.
 */
export function getSuggestedNextLessons(
  language: TargetLanguage,
  level: FluencyLevel,
  currentModule: ModuleId | string,
  currentLessonId?: string
): SuggestedLessonItem[] {
  const all = getAllProgressForLevel(language, level);
  const curriculum = getCurriculumFor(language, level);
  const suggestions: SuggestedLessonItem[] = [];

  // 1. Verificar Fast Drills do nível
  if (curriculum.fastDrills && curriculum.fastDrills.length > 0) {
    const unmasteredDrill = curriculum.fastDrills.find(
      (d) => !all[d.id] || all[d.id].status !== 'mastered'
    );
    if (unmasteredDrill && unmasteredDrill.id !== currentLessonId) {
      suggestions.push({
        id: unmasteredDrill.id,
        module: 'drills',
        moduleTitle: 'Speech Drills',
        title: `Drill de Reflexo: "${unmasteredDrill.promptQuestion}"`,
        description: `Pratique resposta imediata em 5s com a estrutura "${unmasteredDrill.suggestedPattern}".`,
        typeBadge: 'Drill de Fala',
        estimatedMinutes: 3,
      });
    }
  }

  // 2. Verificar Sessões de Áudio Cronometrado
  const audioSessions = getTimedAudioSessions(language, level);
  if (audioSessions && audioSessions.length > 0) {
    const unmasteredAudio = audioSessions.find(
      (s) => !all[s.id] || all[s.id].status !== 'mastered'
    );
    if (unmasteredAudio && unmasteredAudio.id !== currentLessonId) {
      suggestions.push({
        id: unmasteredAudio.id,
        module: 'listening',
        moduleTitle: 'Escuta Ativa',
        title: `${unmasteredAudio.title} (${unmasteredAudio.durationMinutes} min)`,
        description: unmasteredAudio.summary || 'Treino de compreensão de nativos sem legendas.',
        typeBadge: 'Áudio 100% Nativo',
        estimatedMinutes: unmasteredAudio.durationMinutes,
      });
    }
  }

  // 3. Verificar Vídeos Curtos com Legendas
  const videoLessons = getShortVideoLessons(language, level);
  if (videoLessons && videoLessons.length > 0) {
    const unmasteredVideo = videoLessons.find(
      (v) => !all[v.id] || all[v.id].status !== 'mastered'
    );
    if (unmasteredVideo && unmasteredVideo.id !== currentLessonId) {
      suggestions.push({
        id: unmasteredVideo.id,
        module: 'listening',
        moduleTitle: 'Vídeo Interativo',
        title: `${unmasteredVideo.title} (${unmasteredVideo.duration})`,
        description: unmasteredVideo.culturalContext || 'Treino com legendas interativas e vocabulário chave.',
        typeBadge: 'Vídeo Curto',
        estimatedMinutes: unmasteredVideo.durationMinutes || 3,
      });
    }
  }

  // 4. Estruturas de Substituição
  if (curriculum.substitutionDrills && curriculum.substitutionDrills.length > 0) {
    const unmasteredSub = curriculum.substitutionDrills.find(
      (s) => !all[s.id] || all[s.id].status !== 'mastered'
    );
    if (unmasteredSub && unmasteredSub.id !== currentLessonId) {
      suggestions.push({
        id: unmasteredSub.id,
        module: 'drills',
        moduleTitle: 'Autonomia Frasal',
        title: `Substituição: "${unmasteredSub.basePattern}"`,
        description: 'Construa 5 variações da mesma frase sem travar pensando na gramática.',
        typeBadge: 'Padrão Mental',
        estimatedMinutes: 4,
      });
    }
  }

  // 5. Se quase tudo estiver dominado, sugerir conversação ou vocabulário do nível
  if (suggestions.length < 2) {
    suggestions.push({
      id: `conversation-${level}`,
      module: 'conversation',
      moduleTitle: 'Conversação Ativa',
      title: `Simulação de Diálogo do Nível ${level}`,
      description: 'Aplique as frases e padrões aprendidos em um diálogo fluido e contextualizado.',
      typeBadge: 'Conversação',
      estimatedMinutes: 5,
    });
  }

  return suggestions.slice(0, 2);
}
