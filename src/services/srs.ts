import { AnkiCardData, AnkiRating, VocabularyItem, TargetLanguage } from '../types';

/**
 * Motor de Repetição Espaçada (SRS) idêntico ao Anki / AnkiDroid
 * Baseado no algoritmo SM-2 calibrado para aquisição acelerada de idiomas.
 */

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDaysToDate(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isDue(dueDate: string): boolean {
  const today = getTodayDateString();
  return dueDate <= today;
}

export function createDefaultAnkiData(): AnkiCardData {
  return {
    intervalDays: 0,
    easeFactor: 2.5,
    repetitions: 0,
    lapses: 0,
    dueDate: getTodayDateString(),
    state: 'new',
  };
}

export interface AnkiIntervalPreviews {
  again: string;
  hard: string;
  good: string;
  easy: string;
}

/**
 * Calcula os rótulos de intervalo previstos para os 4 botões do AnkiDroid
 */
export function getAnkiIntervalPreviews(cardData: AnkiCardData = createDefaultAnkiData()): AnkiIntervalPreviews {
  const { intervalDays, easeFactor, repetitions, state } = cardData;

  // Errei: sempre volta para o primeiro passo imediato
  const againLabel = '< 1 min';

  // Difícil:
  let hardLabel = '1 d';
  if (state === 'new') {
    hardLabel = '1 d';
  } else if (state === 'learning') {
    hardLabel = '1 d';
  } else {
    const hardInterval = Math.max(1, Math.round(intervalDays * 1.2));
    hardLabel = `${hardInterval} d`;
  }

  // Bom:
  let goodLabel = '1 d';
  if (state === 'new') {
    goodLabel = '1 d';
  } else if (repetitions === 0) {
    goodLabel = '1 d';
  } else if (repetitions === 1) {
    goodLabel = '3 d';
  } else {
    const goodInterval = Math.max(2, Math.round(intervalDays * easeFactor));
    goodLabel = `${goodInterval} d`;
  }

  // Fácil:
  let easyLabel = '4 d';
  if (state === 'new') {
    easyLabel = '4 d';
  } else if (repetitions === 0) {
    easyLabel = '4 d';
  } else {
    const easyInterval = Math.max(4, Math.round(intervalDays * easeFactor * 1.3));
    easyLabel = `${easyInterval} d`;
  }

  return {
    again: againLabel,
    hard: hardLabel,
    good: goodLabel,
    easy: easyLabel,
  };
}

/**
 * Processa a classificação do usuário nos 4 botões do AnkiDroid
 */
export function processAnkiRating(
  currentData: AnkiCardData = createDefaultAnkiData(),
  rating: AnkiRating
): AnkiCardData {
  const today = getTodayDateString();
  let { intervalDays, easeFactor, repetitions, lapses } = currentData;

  switch (rating) {
    case 'again': {
      lapses += 1;
      repetitions = 0;
      intervalDays = 0; // Volta para estudo imediato no mesmo dia
      easeFactor = Math.max(1.3, Number((easeFactor - 0.2).toFixed(2)));
      return {
        intervalDays,
        easeFactor,
        repetitions,
        lapses,
        dueDate: today, // Deve ser revisto hoje
        state: 'learning',
        lastReviewed: today,
      };
    }

    case 'hard': {
      repetitions += 1;
      if (currentData.state === 'new' || currentData.state === 'learning') {
        intervalDays = 1;
      } else {
        intervalDays = Math.max(1, Math.round(intervalDays * 1.2));
      }
      easeFactor = Math.max(1.3, Number((easeFactor - 0.15).toFixed(2)));
      return {
        intervalDays,
        easeFactor,
        repetitions,
        lapses,
        dueDate: addDaysToDate(today, intervalDays),
        state: 'review',
        lastReviewed: today,
      };
    }

    case 'good': {
      repetitions += 1;
      if (currentData.state === 'new') {
        intervalDays = 1;
      } else if (repetitions === 1) {
        intervalDays = 1;
      } else if (repetitions === 2) {
        intervalDays = 3;
      } else {
        intervalDays = Math.max(2, Math.round(intervalDays * easeFactor));
      }
      return {
        intervalDays,
        easeFactor,
        repetitions,
        lapses,
        dueDate: addDaysToDate(today, intervalDays),
        state: 'review',
        lastReviewed: today,
      };
    }

    case 'easy': {
      repetitions += 1;
      if (currentData.state === 'new' || repetitions <= 1) {
        intervalDays = 4;
      } else {
        intervalDays = Math.max(4, Math.round(intervalDays * easeFactor * 1.3));
      }
      easeFactor = Math.min(3.0, Number((easeFactor + 0.15).toFixed(2)));
      return {
        intervalDays,
        easeFactor,
        repetitions,
        lapses,
        dueDate: addDaysToDate(today, intervalDays),
        state: 'review',
        lastReviewed: today,
      };
    }
  }
}

import { getActiveStudentId } from './studentService';

/**
 * Inicializa os baralhos Anki e vocabulário customizado 100% zerados para um novo aluno.
 */
export function initializeCleanUserSRS(userId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`fluency_user_${userId}_srs_fresh`, 'true');
    const languages: TargetLanguage[] = ['Inglês'];
    languages.forEach((lang) => {
      localStorage.setItem(`ankidroid_deck_${userId}_${lang}`, JSON.stringify({}));
      localStorage.setItem(`custom_learned_words_${userId}_${lang}`, JSON.stringify([]));
    });
  } catch (e) {
    console.error('Falha ao inicializar SRS limpo:', e);
  }
}

/**
 * Salva e carrega o estado do baralho Anki por idioma no LocalStorage isolado por usuário
 */
export function getSavedAnkiDeck(language: TargetLanguage, userId?: string | null): Record<string, AnkiCardData> {
  if (typeof window === 'undefined') return {};
  try {
    const uid = userId !== undefined ? userId : getActiveStudentId();
    const key = uid ? `ankidroid_deck_${uid}_${language}` : `ankidroid_deck_guest_${language}`;
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);

    // Se é usuário existente sem chave de usuário, migra legado se não for novo aluno
    if (uid) {
      const isFresh = localStorage.getItem(`fluency_user_${uid}_srs_fresh`);
      if (isFresh) return {};

      const legacy = localStorage.getItem(`ankidroid_deck_${language}`);
      if (legacy) {
        try {
          const d = JSON.parse(legacy);
          localStorage.setItem(key, JSON.stringify(d));
          return d;
        } catch {}
      }
    }

    return {};
  } catch (e) {
    return {};
  }
}

export function saveAnkiDeck(
  language: TargetLanguage,
  data: Record<string, AnkiCardData>,
  userId?: string | null
): void {
  if (typeof window === 'undefined') return;
  try {
    const uid = userId !== undefined ? userId : getActiveStudentId();
    const key = uid ? `ankidroid_deck_${uid}_${language}` : `ankidroid_deck_guest_${language}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Falha ao salvar baralho Anki:', e);
  }
}

/**
 * Gerencia palavras e frases customizadas adicionadas pelo usuário ou pelo chat com IA
 */
export function getCustomLearnedItems(language: TargetLanguage, userId?: string | null): VocabularyItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const uid = userId !== undefined ? userId : getActiveStudentId();
    const key = uid ? `custom_learned_words_${uid}_${language}` : `custom_learned_words_guest_${language}`;
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);

    // Migração de usuário antigo
    if (uid) {
      const isFresh = localStorage.getItem(`fluency_user_${uid}_srs_fresh`);
      if (isFresh) return [];

      const legacy = localStorage.getItem(`custom_learned_words_${language}`);
      if (legacy) {
        try {
          const d = JSON.parse(legacy);
          localStorage.setItem(key, JSON.stringify(d));
          return d;
        } catch {}
      }
    }

    return [];
  } catch (e) {
    return [];
  }
}

export function saveCustomLearnedItem(language: TargetLanguage, item: VocabularyItem, userId?: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    const uid = userId !== undefined ? userId : getActiveStudentId();
    const existing = getCustomLearnedItems(language, uid);
    const updated = [item, ...existing.filter((i) => i.id !== item.id)];
    const key = uid ? `custom_learned_words_${uid}_${language}` : `custom_learned_words_guest_${language}`;
    localStorage.setItem(key, JSON.stringify(updated));

    // Inicializar no baralho Anki
    const deck = getSavedAnkiDeck(language, uid);
    if (!deck[item.id]) {
      deck[item.id] = createDefaultAnkiData();
      saveAnkiDeck(language, deck, uid);
    }
  } catch (e) {
    console.error('Falha ao salvar palavra aprendida customizada:', e);
  }
}

export function saveMultipleCustomLearnedItems(
  language: TargetLanguage,
  newItems: VocabularyItem[],
  userId?: string | null
): void {
  if (typeof window === 'undefined' || newItems.length === 0) return;
  try {
    const uid = userId !== undefined ? userId : getActiveStudentId();
    const existing = getCustomLearnedItems(language, uid);
    const existingIds = new Set(existing.map((i) => i.id));
    const toAdd = newItems.filter((i) => !existingIds.has(i.id));
    const updated = [...toAdd, ...existing];
    const key = uid ? `custom_learned_words_${uid}_${language}` : `custom_learned_words_guest_${language}`;
    localStorage.setItem(key, JSON.stringify(updated));

    // Inicializar todos no baralho Anki
    const deck = getSavedAnkiDeck(language, uid);
    let changed = false;
    toAdd.forEach((it) => {
      if (!deck[it.id]) {
        deck[it.id] = createDefaultAnkiData();
        changed = true;
      }
    });
    if (changed) {
      saveAnkiDeck(language, deck, uid);
    }
  } catch (e) {
    console.error('Falha ao salvar lote de palavras aprendidas customizadas:', e);
  }
}

export function removeCustomLearnedItem(language: TargetLanguage, id: string, userId?: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    const uid = userId !== undefined ? userId : getActiveStudentId();
    const existing = getCustomLearnedItems(language, uid);
    const updated = existing.filter((i) => i.id !== id);
    const key = uid ? `custom_learned_words_${uid}_${language}` : `custom_learned_words_guest_${language}`;
    localStorage.setItem(key, JSON.stringify(updated));

    const deck = getSavedAnkiDeck(language, uid);
    delete deck[id];
    saveAnkiDeck(language, deck, uid);
  } catch (e) {
    console.error('Falha ao remover palavra aprendida:', e);
  }
}
