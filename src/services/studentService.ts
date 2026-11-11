import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from 'firebase/firestore';
import { db } from './firebase';
import { TargetLanguage, FluencyLevel, MainObjective } from '../types';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  targetLanguage: TargetLanguage;
  level: FluencyLevel;
  objective: string;
  minutesPerDay: number;
  streakDays: number;
  totalXp: number;
  createdAt: string;
  lastActiveAt: string;
}

export interface StudentAccountRecord {
  email: string;
  passwordHash: string;
  userId: string;
  profile: StudentProfile;
  updatedAt: string;
}

export interface StudentEvolutionRecord {
  id: string;
  userId: string;
  date: string;
  overallScore: number;
  level: FluencyLevel;
  phoneticsScore: number;
  oralReflexScore: number;
  vocabScore: number;
  listeningScore: number;
  stagnationRisk: string;
  prescribedAction: string;
  completedMinutes: number;
  xpEarned: number;
  createdAt: string;
}

// Helper para obter o ID do aluno atualmente ativo
export function getActiveStudentId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('fluency_profile_active');
    if (raw) {
      const p = JSON.parse(raw);
      return p?.id || null;
    }
  } catch {}
  return null;
}

// Helper para calcular e atualizar streak de dias consecutivos
export function checkAndUpdateStreak(profile: StudentProfile): StudentProfile {
  if (!profile.lastActiveAt) {
    return {
      ...profile,
      lastActiveAt: new Date().toISOString(),
    };
  }

  const lastDate = new Date(profile.lastActiveAt);
  const now = new Date();
  
  // Normalizar datas para meia-noite
  const lastMidnight = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate()).getTime();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const diffDays = Math.round((todayMidnight - lastMidnight) / (1000 * 60 * 60 * 24));

  let updatedStreak = profile.streakDays;
  if (diffDays === 1) {
    // Estudou no dia anterior consecutivo!
    updatedStreak = (profile.streakDays || 0) + 1;
  } else if (diffDays > 1) {
    // Quebrou a sequência
    updatedStreak = 1;
  } else if (diffDays === 0 && (!profile.streakDays || profile.streakDays === 0)) {
    // Primeiro dia de estudo
    updatedStreak = 1;
  }

  return {
    ...profile,
    streakDays: updatedStreak,
    lastActiveAt: now.toISOString(),
  };
}

// Helper para gerar chave segura de documento a partir do e-mail
export function getEmailDocKey(email: string): string {
  return email.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
}

// Salvar conta completa com credenciais no Firestore e no dispositivo
export async function saveStudentAccount(
  email: string,
  pass: string,
  profile: StudentProfile
): Promise<boolean> {
  const normEmail = email.trim().toLowerCase();
  const key = getEmailDocKey(normEmail);
  const account: StudentAccountRecord = {
    email: normEmail,
    passwordHash: pass,
    userId: profile.id,
    profile,
    updatedAt: new Date().toISOString(),
  };

  // 1. Salvar no cache local com garantia imediata
  try {
    const rawMap = localStorage.getItem('fluency_accounts_map');
    const map = rawMap ? JSON.parse(rawMap) : {};
    map[normEmail] = account;
    localStorage.setItem('fluency_accounts_map', JSON.stringify(map));
    localStorage.setItem(`fluency_profile_${profile.id}`, JSON.stringify(profile));
    localStorage.setItem('fluency_profile_active', JSON.stringify(profile));
    localStorage.setItem('fluency_lang', profile.targetLanguage);
    localStorage.setItem('fluency_level', profile.level);
    localStorage.setItem('fluency_streak', String(profile.streakDays));
    localStorage.setItem('fluency_xp', String(profile.totalXp));
  } catch (e) {
    console.warn('[studentService] Erro ao salvar conta no localStorage:', e);
  }

  // 2. Salvar no Firestore (coleções 'users' e 'accounts')
  try {
    const accRef = doc(db, 'accounts', key);
    await setDoc(accRef, account, { merge: true });
    const userRef = doc(db, 'users', profile.id);
    await setDoc(userRef, profile, { merge: true });
    console.log('[studentService] Conta de aluno salva e sincronizada no Firestore:', normEmail);
    return true;
  } catch (err) {
    console.warn('[studentService] Firestore offline ou restrito. Conta salva no dispositivo:', err);
    return true;
  }
}

// Buscar dados de conta e verificar credenciais
export async function verifyStudentCredentials(
  email: string,
  pass: string
): Promise<{ success: boolean; profile?: StudentProfile; error?: string }> {
  const normEmail = email.trim().toLowerCase();
  const key = getEmailDocKey(normEmail);

  // 1. Tentar buscar no Firestore
  try {
    const accRef = doc(db, 'accounts', key);
    const snap = await getDoc(accRef);
    if (snap.exists()) {
      const acc = snap.data() as StudentAccountRecord;
      if (!acc.passwordHash || acc.passwordHash === pass) {
        // Tentar obter o perfil mais atualizado do usuário
        const latestProfile = await getStudentProfile(acc.userId);
        return { success: true, profile: latestProfile || acc.profile };
      } else {
        return { success: false, error: 'Senha incorreta para este e-mail.' };
      }
    }
  } catch (err) {
    console.warn('[studentService] Consulta no Firestore offline, buscando no cache local:', err);
  }

  // 2. Tentar buscar no cache local
  try {
    const rawMap = localStorage.getItem('fluency_accounts_map');
    if (rawMap) {
      const map = JSON.parse(rawMap);
      if (map[normEmail]) {
        const acc = map[normEmail] as StudentAccountRecord;
        if (!acc.passwordHash || acc.passwordHash === pass) {
          // Checar se há versão mais recente salva em fluency_profile_${userId}
          try {
            const rawUser = localStorage.getItem(`fluency_profile_${acc.userId}`);
            if (rawUser) {
              const u = JSON.parse(rawUser) as StudentProfile;
              return { success: true, profile: u };
            }
          } catch {}
          return { success: true, profile: acc.profile };
        } else {
          return { success: false, error: 'Senha incorreta para este e-mail.' };
        }
      }
    }

    const activeRaw = localStorage.getItem('fluency_profile_active');
    if (activeRaw) {
      const p = JSON.parse(activeRaw) as StudentProfile;
      if (p.email?.toLowerCase() === normEmail) {
        return { success: true, profile: p };
      }
    }
  } catch (e) {
    console.warn('[studentService] Erro ao verificar credenciais locais:', e);
  }

  return {
    success: false,
    error: 'Conta não encontrada com este e-mail. Alterne para a aba "Novo Aluno (Cadastrar)" para criar seu perfil.',
  };
}

// Obter perfil do aluno
export async function getStudentProfile(userId: string): Promise<StudentProfile | null> {
  // Tentar buscar no Firestore
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data() as StudentProfile;
      try {
        localStorage.setItem(`fluency_profile_${userId}`, JSON.stringify(data));
        localStorage.setItem('fluency_profile_active', JSON.stringify(data));
      } catch {}
      return data;
    }
  } catch (err) {
    console.warn('Firestore offline ou inacessível, consultando dados locais:', err);
  }

  // Fallback: buscar no cache local
  try {
    const local = localStorage.getItem(`fluency_profile_${userId}`) || localStorage.getItem('fluency_profile_active');
    if (local) {
      return JSON.parse(local) as StudentProfile;
    }
  } catch (e) {
    console.warn('Erro ao ler cache local de perfil:', e);
  }

  return null;
}

// Salvar ou atualizar perfil do aluno
export async function saveStudentProfile(profile: StudentProfile): Promise<boolean> {
  // Salva no armazenamento local primeiro para garantia imediata
  try {
    localStorage.setItem(`fluency_profile_${profile.id}`, JSON.stringify(profile));
    localStorage.setItem('fluency_profile_active', JSON.stringify(profile));
    localStorage.setItem('fluency_lang', profile.targetLanguage);
    localStorage.setItem('fluency_level', profile.level);
    localStorage.setItem('fluency_streak', String(profile.streakDays));
    localStorage.setItem('fluency_xp', String(profile.totalXp));

    // Manter atualizado o mapa de contas cadastradas para preservar histórico em futuros logins
    const rawMap = localStorage.getItem('fluency_accounts_map');
    if (rawMap) {
      const map = JSON.parse(rawMap);
      const normEmail = profile.email?.trim().toLowerCase();
      if (normEmail && map[normEmail]) {
        map[normEmail].profile = { ...profile };
        map[normEmail].updatedAt = new Date().toISOString();
        localStorage.setItem('fluency_accounts_map', JSON.stringify(map));
      }
    }
  } catch (e) {
    console.warn('Erro ao salvar perfil no localStorage:', e);
  }

  // Sincroniza com o Firestore
  if (!profile.id.startsWith('local_')) {
    try {
      const userRef = doc(db, 'users', profile.id);
      await setDoc(userRef, {
        ...profile,
        lastActiveAt: new Date().toISOString(),
      }, { merge: true });

      // Atualiza também o registro de conta no Firestore se houver e-mail
      if (profile.email) {
        const accKey = getEmailDocKey(profile.email);
        const accRef = doc(db, 'accounts', accKey);
        await setDoc(accRef, {
          profile,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }

      return true;
    } catch (err) {
      console.warn('Aviso: Perfil salvo localmente, mas sincronização do Firestore pendente:', err);
      return true;
    }
  }

  return true;
}

// Registrar marco de evolução do aluno
export async function recordStudentEvolution(
  userId: string,
  record: Omit<StudentEvolutionRecord, 'id' | 'createdAt'>
): Promise<string | null> {
  const localId = 'evo_' + Date.now().toString(36);
  const fullRecord: StudentEvolutionRecord = {
    id: localId,
    createdAt: new Date().toISOString(),
    ...record,
  };

  // Salva no histórico local
  try {
    const key = `fluency_evolution_${userId}`;
    const raw = localStorage.getItem(key);
    const list: StudentEvolutionRecord[] = raw ? JSON.parse(raw) : [];
    list.unshift(fullRecord);
    localStorage.setItem(key, JSON.stringify(list.slice(0, 30)));
  } catch (e) {
    console.warn('Erro ao salvar evolução local:', e);
  }

  // Tenta sincronizar com Firestore se autenticado
  if (!userId.startsWith('local_')) {
    try {
      const evoCol = collection(db, 'users', userId, 'evolution');
      const docRef = await addDoc(evoCol, {
        ...record,
        createdAt: fullRecord.createdAt,
      });

      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        totalXp: record.xpEarned,
        lastActiveAt: new Date().toISOString(),
      });

      return docRef.id;
    } catch (err) {
      console.warn('Evolução registrada localmente (Firestore offline):', err);
    }
  }

  return localId;
}

// Listar histórico de evolução do aluno para acompanhamento
export async function getStudentEvolutionHistory(userId: string): Promise<StudentEvolutionRecord[]> {
  if (!userId.startsWith('local_')) {
    try {
      const evoCol = collection(db, 'users', userId, 'evolution');
      const q = query(evoCol, orderBy('createdAt', 'desc'), limit(30));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<StudentEvolutionRecord, 'id'>),
        }));
      }
    } catch (err) {
      console.warn('Erro ao buscar histórico no Firestore, usando cache local:', err);
    }
  }

  // Fallback cache local
  try {
    const key = `fluency_evolution_${userId}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw) as StudentEvolutionRecord[];
    }
  } catch (e) {
    console.warn('Erro ao ler evolução local:', e);
  }

  return [];
}

/**
 * Inicializa a plataforma 100% zerada para um novo usuário cadastrado:
 * - 0 XP
 * - 0 dias de ofensiva
 * - 0 minutos praticados hoje
 * - Nenhuma lição concluída previamente (isolado de outros alunos)
 * - Baralhos Anki e vocabulário vazios
 * - Desafios de imersão zerados
 */
export function initializeCleanStudentState(userId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const todayKey = new Date().toISOString().split('T')[0];
    localStorage.setItem(`fluency_user_${userId}_is_fresh`, 'true');
    localStorage.setItem(`fluency_user_${userId}_srs_fresh`, 'true');

    // Zerar meta e minutos de hoje para o novo usuário
    localStorage.setItem(`fluency_daily_minutes_${userId}_${todayKey}`, '0');
    localStorage.setItem(`fluency_goal_xp_claimed_${userId}_${todayKey}`, 'false');
    localStorage.setItem(`fluency_daily_target_minutes_${userId}`, '25');

    // Chaves de evolução vazias para o novo usuário
    localStorage.setItem(`fluency_evolution_${userId}`, JSON.stringify([]));

    // Despachar evento para componentes recalcularem e renderizarem a plataforma zerada
    window.dispatchEvent(
      new CustomEvent('fluency_user_changed', {
        detail: { userId, isNew: true },
      })
    );
  } catch (e) {
    console.error('Erro ao inicializar estado limpo para o novo aluno:', e);
  }
}

