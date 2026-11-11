import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import {
  StudentProfile,
  getStudentProfile,
  saveStudentProfile,
  saveStudentAccount,
  verifyStudentCredentials,
  checkAndUpdateStreak,
  initializeCleanStudentState,
} from '../services/studentService';
import { initializeCleanUserProgress } from '../services/lessonProgress';
import { initializeCleanUserSRS } from '../services/srs';
import { TargetLanguage, FluencyLevel } from '../types';

export interface AuthResult {
  success: boolean;
  error?: string;
  errorCode?: string;
  canFallback?: boolean;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  studentProfile: StudentProfile | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<AuthResult>;
  register: (
    email: string,
    pass: string,
    name: string,
    language: TargetLanguage,
    level: FluencyLevel,
    objective?: string
  ) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  createLocalProfile: (
    name: string,
    email: string,
    language: TargetLanguage,
    level: FluencyLevel,
    objective?: string
  ) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<StudentProfile>) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(() => {
    try {
      const saved = localStorage.getItem('fluency_profile_active');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('[AuthContext] onAuthStateChanged emitido:', user ? `UID: ${user.uid}` : 'Nenhum usuário Firebase Auth');
      setCurrentUser(user);
      if (user) {
        const profile = await getStudentProfile(user.uid);
        if (profile) {
          console.log('[AuthContext] Perfil de aluno existente carregado com histórico preservado:', profile.name, `XP: ${profile.totalXp}`);
          const updated = checkAndUpdateStreak(profile);
          await saveStudentProfile(updated);
          setStudentProfile(updated);
          window.dispatchEvent(new CustomEvent('fluency_user_changed', { detail: { userId: user.uid, isNew: false } }));
        } else {
          // Usuário autenticou pela primeira vez (Novo aluno: plataforma 100% zerada!)
          console.log('[AuthContext] Novo usuário autenticado: inicializando plataforma 100% zerada');
          initializeCleanUserProgress(user.uid);
          initializeCleanUserSRS(user.uid);
          initializeCleanStudentState(user.uid);

          const newProfile: StudentProfile = {
            id: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'Aluno',
            email: user.email || '',
            targetLanguage: 'Inglês',
            level: 'A1',
            objective: 'Fluência Prática e Comunicação sem Bloqueio',
            minutesPerDay: 30,
            streakDays: 0, // Novo aluno começa com 0 dias!
            totalXp: 0,    // Novo aluno começa com 0 XP!
            createdAt: new Date().toISOString(),
            lastActiveAt: new Date().toISOString(),
          };
          await saveStudentProfile(newProfile);
          setStudentProfile(newProfile);
          window.dispatchEvent(new CustomEvent('fluency_user_changed', { detail: { userId: user.uid, isNew: true } }));
        }
      } else {
        // Se deslogou do Firebase Auth, verifica se há perfil local ativo salvo no aparelho
        try {
          const localActive = localStorage.getItem('fluency_profile_active');
          if (localActive) {
            const parsed = JSON.parse(localActive);
            console.log('[AuthContext] Mantendo perfil de aluno ativo do dispositivo:', parsed.name, `XP: ${parsed.totalXp}`);
            setStudentProfile(parsed);
          } else {
            setStudentProfile(null);
          }
        } catch {
          setStudentProfile(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string): Promise<AuthResult> => {
    console.log('[AuthContext] Executando signIn para:', email);
    // 1. Tentar autenticação nativa do Firebase Auth
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      console.log('[AuthContext] signInWithEmailAndPassword bem-sucedido:', cred.user.uid);
      const profile = await getStudentProfile(cred.user.uid);
      if (profile) {
        const updated = checkAndUpdateStreak(profile);
        await saveStudentProfile(updated);
        setStudentProfile(updated);
        window.dispatchEvent(new CustomEvent('fluency_user_changed', { detail: { userId: updated.id, isNew: false } }));
      }
      return { success: true };
    } catch (err: any) {
      console.warn('[AuthContext] Falha no signInWithEmailAndPassword:', err.code, err.message);

      // 2. Se o Firebase Auth falhar por restrição de provedor ou usuário não cadastrado no Auth,
      // verificar contas salvas no Firestore e dispositivo
      console.log('[AuthContext] Consultando credenciais salvas no banco de dados e dispositivo...');
      const localCheck = await verifyStudentCredentials(email, pass);
      if (localCheck.success && localCheck.profile) {
        console.log('[AuthContext] Login bem-sucedido via contas salvas. Histórico preservado:', localCheck.profile.name, `XP: ${localCheck.profile.totalXp}`);
        const updated = checkAndUpdateStreak(localCheck.profile);
        await saveStudentProfile(updated);
        setStudentProfile(updated);
        window.dispatchEvent(new CustomEvent('fluency_user_changed', { detail: { userId: updated.id, isNew: false } }));
        return { success: true };
      }

      // Se falhou e há erro específico de senha incorreta
      if (localCheck.error && localCheck.error.includes('Senha incorreta')) {
        return { success: false, error: localCheck.error };
      }

      let msg = 'Erro ao realizar login. Verifique seus dados.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'Email ou senha incorretos.';
      } else if (err.code === 'auth/user-not-found') {
        msg = 'Usuário não encontrado com este e-mail. Alterne para "Novo Aluno (Cadastrar)" para criar sua conta.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Formato de email inválido.';
      } else if (localCheck.error) {
        msg = localCheck.error;
      }

      return { success: false, error: msg, errorCode: err.code };
    }
  };

  const register = async (
    email: string,
    pass: string,
    name: string,
    language: TargetLanguage,
    level: FluencyLevel,
    objective: string = 'Fluência Comunicativa e Confiança Oral'
  ): Promise<AuthResult> => {
    console.log('[AuthContext] Executando register para novo aluno:', { email, name, language, level });

    // Validações básicas
    if (!email.trim() || !pass || !name.trim()) {
      return { success: false, error: 'Por favor, preencha nome, e-mail e senha.' };
    }
    if (pass.length < 6) {
      return { success: false, error: 'A senha deve conter no mínimo 6 caracteres.' };
    }

    // 1. Tentar criar no Firebase Auth
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      console.log('[AuthContext] createUserWithEmailAndPassword bem-sucedido com UID:', cred.user.uid);
      try {
        await updateProfile(cred.user, { displayName: name.trim() });
      } catch (e) {
        console.warn('[AuthContext] updateProfile displayName aviso:', e);
      }

      // Novo aluno: inicializa plataforma 100% ZERADA (0 XP, 0 streak, progresso limpo)
      initializeCleanUserProgress(cred.user.uid);
      initializeCleanUserSRS(cred.user.uid);
      initializeCleanStudentState(cred.user.uid);

      const newProfile: StudentProfile = {
        id: cred.user.uid,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        targetLanguage: language,
        level: level,
        objective: objective,
        minutesPerDay: 30,
        streakDays: 0, // NOVO ALUNO: 0 dias!
        totalXp: 0,    // NOVO ALUNO: 0 XP (plataforma zerada)!
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      };

      await saveStudentAccount(email, pass, newProfile);
      setStudentProfile(newProfile);
      window.dispatchEvent(new CustomEvent('fluency_user_changed', { detail: { userId: cred.user.uid, isNew: true } }));
      console.log('[AuthContext] Novo perfil de aluno cadastrado com plataforma 100% zerada:', newProfile);
      return { success: true };
    } catch (err: any) {
      console.warn('[AuthContext] createUserWithEmailAndPassword falhou com código:', err.code, err.message);

      // Tratamento específico de erros impeditivos
      if (err.code === 'auth/email-already-in-use') {
        return {
          success: false,
          error: 'Este e-mail já está cadastrado. Alterne para a aba "Já sou Aluno (Entrar)" para fazer login.',
          errorCode: err.code,
        };
      } else if (err.code === 'auth/weak-password') {
        return {
          success: false,
          error: 'A senha informada é fraca. Ela precisa de no mínimo 6 caracteres.',
          errorCode: err.code,
        };
      } else if (err.code === 'auth/invalid-email') {
        return {
          success: false,
          error: 'O formato do e-mail é inválido. Digite um e-mail válido (ex: aluno@email.com).',
          errorCode: err.code,
        };
      }

      // 2. Se o Firebase Auth falhar por restrição de provedor:
      // Criamos a conta do aluno de forma DEFINITIVA no Firestore e no dispositivo.
      console.log('[AuthContext] Criando conta e perfil de aluno de forma definitiva com plataforma zerada...');
      try {
        const studentUid = 'stu_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
        
        // Novo aluno: inicializa plataforma 100% ZERADA
        initializeCleanUserProgress(studentUid);
        initializeCleanUserSRS(studentUid);
        initializeCleanStudentState(studentUid);

        const newProfile: StudentProfile = {
          id: studentUid,
          name: name.trim() || 'Aluno',
          email: email.trim().toLowerCase(),
          targetLanguage: language,
          level: level,
          objective: objective,
          minutesPerDay: 30,
          streakDays: 0, // NOVO ALUNO: 0 dias!
          totalXp: 0,    // NOVO ALUNO: 0 XP!
          createdAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        };

        await saveStudentAccount(email, pass, newProfile);
        setStudentProfile(newProfile);
        window.dispatchEvent(new CustomEvent('fluency_user_changed', { detail: { userId: studentUid, isNew: true } }));
        console.log('[AuthContext] Conta cadastrada com sucesso com plataforma zerada:', newProfile);
        return { success: true };
      } catch (saveErr: any) {
        console.error('[AuthContext] Erro fatal ao salvar conta:', saveErr);
        return {
          success: false,
          error: 'Erro ao gravar os dados do aluno. Tente novamente em instantes.',
        };
      }
    }
  };

  const signInWithGoogle = async (): Promise<AuthResult> => {
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const profile = await getStudentProfile(cred.user.uid);
      if (profile) {
        console.log('[AuthContext] Login Google existente com histórico preservado:', profile.name, `XP: ${profile.totalXp}`);
        const updated = checkAndUpdateStreak(profile);
        await saveStudentProfile(updated);
        setStudentProfile(updated);
        window.dispatchEvent(new CustomEvent('fluency_user_changed', { detail: { userId: updated.id, isNew: false } }));
      } else {
        // Novo usuário Google: plataforma 100% zerada
        initializeCleanUserProgress(cred.user.uid);
        initializeCleanUserSRS(cred.user.uid);
        initializeCleanStudentState(cred.user.uid);

        const newProfile: StudentProfile = {
          id: cred.user.uid,
          name: cred.user.displayName || 'Aluno',
          email: cred.user.email || '',
          targetLanguage: 'Inglês',
          level: 'A1',
          objective: 'Fluência Prática e Comunicação sem Bloqueio',
          minutesPerDay: 30,
          streakDays: 0, // Novo aluno: 0 dias!
          totalXp: 0,    // Novo aluno: 0 XP!
          createdAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        };
        await saveStudentProfile(newProfile);
        setStudentProfile(newProfile);
        window.dispatchEvent(new CustomEvent('fluency_user_changed', { detail: { userId: cred.user.uid, isNew: true } }));
      }
      return { success: true };
    } catch (err: any) {
      console.warn('Erro ao autenticar com Google:', err);
      let msg = 'Erro ao realizar login com Google.';
      if (err.code === 'auth/popup-closed-by-user') {
        msg = 'Janela de login fechada antes da conclusão.';
      } else if (err.code === 'auth/unauthorized-domain') {
        msg = 'Este domínio precisa ser adicionado na lista de domínios autorizados do Firebase Console.';
      } else if (err.message) {
        msg = `Aviso: ${err.message}`;
      }
      return { success: false, error: msg, errorCode: err.code, canFallback: true };
    }
  };

  const createLocalProfile = async (
    name: string,
    email: string,
    language: TargetLanguage,
    level: FluencyLevel,
    objective: string = 'Fluência Comunicativa e Confiança Oral'
  ): Promise<AuthResult> => {
    try {
      const localId = 'local_' + Date.now().toString(36);
      
      // Novo aluno: plataforma 100% zerada
      initializeCleanUserProgress(localId);
      initializeCleanUserSRS(localId);
      initializeCleanStudentState(localId);

      const newProfile: StudentProfile = {
        id: localId,
        name: name.trim() || 'Aluno',
        email: email.trim(),
        targetLanguage: language,
        level: level,
        objective: objective,
        minutesPerDay: 30,
        streakDays: 0, // Novo aluno: 0 dias!
        totalXp: 0,    // Novo aluno: 0 XP!
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      };

      await saveStudentAccount(email, '', newProfile);
      setStudentProfile(newProfile);
      window.dispatchEvent(new CustomEvent('fluency_user_changed', { detail: { userId: localId, isNew: true } }));
      return { success: true };
    } catch (err: any) {
      console.warn('Erro ao criar perfil local:', err);
      return { success: false, error: 'Erro ao salvar perfil local.' };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setStudentProfile(null);
      localStorage.removeItem('fluency_profile_active');
      window.dispatchEvent(new CustomEvent('fluency_user_changed', { detail: { userId: null } }));
    } catch (err) {
      console.warn('Erro ao sair:', err);
      setStudentProfile(null);
      localStorage.removeItem('fluency_profile_active');
      window.dispatchEvent(new CustomEvent('fluency_user_changed', { detail: { userId: null } }));
    }
  };

  const updateProfileData = async (data: Partial<StudentProfile>): Promise<boolean> => {
    if (!studentProfile) return false;
    const updated: StudentProfile = {
      ...studentProfile,
      ...data,
      lastActiveAt: new Date().toISOString(),
    };
    const ok = await saveStudentProfile(updated);
    if (ok) setStudentProfile(updated);
    return ok;
  };

  const refreshProfile = async () => {
    if (currentUser) {
      const p = await getStudentProfile(currentUser.uid);
      if (p) setStudentProfile(p);
    } else {
      const localActive = localStorage.getItem('fluency_profile_active');
      if (localActive) {
        try {
          setStudentProfile(JSON.parse(localActive));
        } catch {}
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        studentProfile,
        isLoading,
        signIn,
        register,
        signInWithGoogle,
        createLocalProfile,
        logout,
        updateProfileData,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return ctx;
};
