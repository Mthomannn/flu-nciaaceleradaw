import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Brain,
  Globe,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TargetLanguage, FluencyLevel, MainObjective } from '../types';
import { SUPPORTED_LANGUAGES, FLUENCY_LEVELS } from '../data/curriculum';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  onSuccess,
}) => {
  const { signIn, register, signInWithGoogle, createLocalProfile } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [targetLanguage, setTargetLanguage] = useState<TargetLanguage>('Inglês');
  const [level, setLevel] = useState<FluencyLevel>('A1');
  const [objective, setObjective] = useState<string>('Fluência e Conversação sem Trava');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [canFallback, setCanFallback] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);
    const res = await signInWithGoogle();
    setIsLoading(false);
    if (res.success) {
      setSuccessMsg('Conectado com sucesso com sua conta Google!');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 800);
    } else {
      setErrorMsg(res.error || 'Erro ao autenticar com Google.');
      setCanFallback(true);
    }
  };

  const handleSaveLocalProfile = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    const studentName = name.trim() || email.split('@')[0] || 'Aluno';
    const res = await createLocalProfile(studentName, email.trim(), targetLanguage, level, objective);
    setIsLoading(false);
    if (res.success) {
      setSuccessMsg('Perfil de aluno criado com sucesso no aparelho!');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 900);
    } else {
      setErrorMsg(res.error || 'Erro ao criar perfil local.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setCanFallback(false);
    setIsLoading(true);

    if (mode === 'login') {
      console.log('[AuthModal] Submetendo formulário de login...');
      const res = await signIn(email, password);
      setIsLoading(false);
      if (res.success) {
        setSuccessMsg('Login realizado com sucesso! Sincronizando seus dados...');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1000);
      } else {
        setErrorMsg(res.error || 'Erro ao realizar login.');
        if (res.canFallback) setCanFallback(true);
      }
    } else {
      console.log('[AuthModal] Submetendo formulário de cadastro de novo aluno...');
      if (!name.trim()) {
        setErrorMsg('Por favor, informe seu nome completo.');
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setErrorMsg('A senha deve conter no mínimo 6 caracteres.');
        setIsLoading(false);
        return;
      }

      const res = await register(email, password, name, targetLanguage, level, objective);
      setIsLoading(false);
      if (res.success) {
        console.log('[AuthModal] Cadastro concluído com sucesso!');
        setSuccessMsg('Usuário cadastrado com sucesso! Seu perfil e histórico de evolução foram ativados.');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1200);
      } else {
        setErrorMsg(res.error || 'Erro ao cadastrar usuário.');
        if (res.canFallback) setCanFallback(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg shrink-0">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-amber-300">
                  Portal do Aluno
                </span>
                <span className="text-[10px] text-slate-300">Nuvem Segura</span>
              </div>
              <h2 className="text-lg font-bold mt-0.5">
                {mode === 'login' ? 'Acessar Conta de Aluno' : 'Criar Perfil de Evolução'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas Alternadoras: Login / Cadastro */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              mode === 'login'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Já sou Aluno (Entrar)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              mode === 'register'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Novo Aluno (Cadastrar)
          </button>
        </div>

        {/* Formulário com Scroll Interno */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-2 animate-in fade-in">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
              {errorMsg.includes('Novo Aluno') && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg(null);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Mudar para a aba de Cadastro</span>
                </button>
              )}
              {errorMsg.includes('Já sou Aluno') && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Mudar para a aba de Login</span>
                </button>
              )}
              {canFallback && (
                <div className="pt-2 border-t border-rose-200/80 flex flex-col gap-1.5">
                  <span className="text-[11px] text-rose-700 font-semibold">
                    Deseja salvar seu perfil de aluno diretamente no dispositivo?
                  </span>
                  <button
                    type="button"
                    onClick={handleSaveLocalProfile}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Criar Perfil de Aluno no Dispositivo</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Botão de Autenticação Rápida com Google */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm shadow-2xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.43 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.57 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continuar com o Google</span>
          </button>

          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider relative">
              ou com e-mail
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Seu Nome Completo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Carlos Silva"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-indigo-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aluno@email.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-indigo-600"
                />
              </div>
            </div>

            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Idioma Alvo
                    </label>
                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>🇺🇸</span>
                      <span>Inglês</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nível de Partida
                    </label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as FluencyLevel)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-800"
                    >
                      {FLUENCY_LEVELS.map((lvl) => (
                        <option key={lvl.id} value={lvl.id}>
                          {lvl.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Objetivo Principal
                  </label>
                  <select
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                  >
                    <option value="Conversação e fluidez no dia a dia">Conversação e fluidez no dia a dia</option>
                    <option value="Carreira, reuniões e entrevistas de trabalho">Carreira, reuniões e entrevistas</option>
                    <option value="Viagens internacionais e imigração">Viagens internacionais e imigração</option>
                    <option value="Exames de proficiência (IELTS/TOEFL)">Exames de proficiência (IELTS/TOEFL)</option>
                    <option value="Destravar fala e eliminar tradução mental">Destravar fala e eliminar tradução mental</option>
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Processando...' : mode === 'login' ? 'Entrar e Sincronizar' : 'Criar Perfil e Começar'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Vantagens do Registro */}
          <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <Brain className="w-3.5 h-3.5 text-indigo-600" />
              <span>Por que ter uma conta de aluno?</span>
            </div>
            <ul className="space-y-1 text-slate-600 pl-4 list-disc">
              <li>Histórico contínuo de evolução fonética e reflexo oral gravado na nuvem.</li>
              <li>Acompanhamento de estagnação pelo Agente Sênior de Linguística.</li>
              <li>Preserva seus dias de ofensiva, pontos de XP e revisões de vocabulário.</li>
            </ul>
          </div>
        </div>

        {/* Rodapé: Convidado */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
          >
            Continuar praticando sem login por enquanto
          </button>
        </div>
      </div>
    </div>
  );
};
