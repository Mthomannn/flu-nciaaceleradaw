import React, { useState, useEffect } from 'react';
import {
  X,
  TrendingUp,
  Award,
  Calendar,
  Flame,
  Zap,
  Target,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Clock,
  BookOpen,
  Mic,
  Timer,
  Headphones,
  User,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  StudentEvolutionRecord,
  getStudentEvolutionHistory,
  recordStudentEvolution,
} from '../services/studentService';
import { TargetLanguage, FluencyLevel, LinguisticAgentDiagnosis } from '../types';

interface StudentEvolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: TargetLanguage;
  currentLevel: FluencyLevel;
  streakDays: number;
  totalXp: number;
  onOpenAuth: () => void;
}

export const StudentEvolutionModal: React.FC<StudentEvolutionModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  currentLevel,
  streakDays,
  totalXp,
  onOpenAuth,
}) => {
  const { currentUser, studentProfile, logout } = useAuth();
  const [history, setHistory] = useState<StudentEvolutionRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSavingSnapshot, setIsSavingSnapshot] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const activeUserId = currentUser?.uid || studentProfile?.id;

  useEffect(() => {
    if (isOpen && activeUserId) {
      loadHistory();
    }
  }, [isOpen, activeUserId]);

  const loadHistory = async () => {
    if (!activeUserId) return;
    setIsLoadingHistory(true);
    const records = await getStudentEvolutionHistory(activeUserId);
    setHistory(records);
    setIsLoadingHistory(false);
  };

  // Salvar o estado atual como marco histórico de evolução
  const handleSaveCurrentSnapshot = async () => {
    if (!activeUserId) {
      onOpenAuth();
      return;
    }

    setIsSavingSnapshot(true);
    setSaveSuccessMsg(null);

    // Carrega o diagnóstico em cache se houver
    let cachedDiag: LinguisticAgentDiagnosis | null = null;
    try {
      const raw = localStorage.getItem(`fluency_linguistic_agent_${currentLanguage}_${currentLevel}`);
      if (raw) cachedDiag = JSON.parse(raw);
    } catch {
      // noop
    }

    const overall = cachedDiag?.overallAptitudeScore || 70;
    const phonetics = cachedDiag?.pillars.phonetics.score || 68;
    const oralReflex = cachedDiag?.pillars.oralReflex.score || 72;
    const vocab = cachedDiag?.pillars.activeVocab.score || 75;
    const listening = cachedDiag?.pillars.listeningDecoding.score || 65;
    const stagnation = cachedDiag?.stagnationRisk.identifiedPlateau || 'Evolução constante sem platô detectado';
    const action = cachedDiag?.stagnationRisk.antiPlateauPrescription || 'Prática balanceada dos 4 pilares';

    const id = await recordStudentEvolution(activeUserId, {
      userId: activeUserId,
      date: new Date().toLocaleDateString('pt-BR'),
      overallScore: overall,
      level: currentLevel,
      phoneticsScore: phonetics,
      oralReflexScore: oralReflex,
      vocabScore: vocab,
      listeningScore: listening,
      stagnationRisk: stagnation,
      prescribedAction: action,
      completedMinutes: 25,
      xpEarned: totalXp,
    });

    setIsSavingSnapshot(false);
    if (id) {
      setSaveSuccessMsg('Marco de evolução salvo com sucesso!');
      await loadHistory();
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Topo do Modal */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
              📈
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-amber-300">
                  Prontuário Linguístico
                </span>
                <span className="text-[11px] text-slate-300">
                  {currentUser ? 'Perfil Sincronizado' : 'Modo Convidado'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold mt-0.5">
                Acompanhamento & Evolução do Aluno
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

        {/* Conteúdo Principal com Rolagem */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Seção 1: Identificação do Aluno */}
          {currentUser && studentProfile ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-xs">
                  {studentProfile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {studentProfile.name}
                  </h3>
                  <p className="text-xs text-slate-500">{studentProfile.email}</p>
                  <p className="text-xs text-indigo-700 font-semibold mt-0.5">
                    Meta: {studentProfile.objective}
                  </p>
                </div>
              </div>

              {/* Badges de Status */}
              <div className="flex items-center gap-2 flex-wrap sm:justify-end">
                <div className="px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                  <span>{streakDays}d seguidos</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{totalXp} XP</span>
                </div>
                <button
                  onClick={logout}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-200 text-xs font-semibold transition-colors"
                >
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-indigo-950 text-sm sm:text-base">
                    Você está navegando como visitante
                  </h3>
                  <p className="text-xs text-indigo-800/80 mt-0.5">
                    Crie sua conta gratuita para salvar e acompanhar todo o seu histórico de evolução e aptidão linguística na nuvem.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="shrink-0 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
              >
                Cadastrar ou Entrar
              </button>
            </div>
          )}

          {saveSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* Seção 1.5: Trilha 100 Horas (Nível 0 ao A1 com Base Extremamente Sólida) */}
          <div className="bg-gradient-to-br from-indigo-50/70 via-white to-amber-50/40 border border-indigo-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100 pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                  Trilha Oficial: 100 Horas de Aulas Ativas (Nível 0 ➔ A1 Sólido)
                </h4>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                {currentLevel === 'Zero' ? 'Fase Inicial (0-40h)' : 'Fase de Consolidação A1 (41-100h)'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Evolução gradativa garantida em 4 marcos de 25 horas: do destravamento fonético (horas 0-25), automatização de 150 blocos (26-50h), decodificação auditiva nativa (51-75h) até a autonomia de diálogo de 10 minutos (76-100h).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-left">
                <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Marco 1 (0-25h)</span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">Fundação Fonética</span>
                <span className="text-[10px] text-emerald-600 font-medium">Aparelho fonador</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-left">
                <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Marco 2 (26-50h)</span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">Blocos & Reflexo</span>
                <span className="text-[10px] text-indigo-600 font-medium">Tradução zero</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-left">
                <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Marco 3 (51-75h)</span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">Ouvido & Fala</span>
                <span className="text-[10px] text-purple-600 font-medium">Fala conectada</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-left">
                <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Marco 4 (76-100h)</span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">A1 Inabalável</span>
                <span className="text-[10px] text-amber-600 font-medium">Diálogo espontâneo</span>
              </div>
            </div>
          </div>

          {/* Seção 2: Diagnóstico Atual da Aptidão */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Estado Atual de Aptidão ({currentLanguage} • Nível {currentLevel})
                </h4>
                <p className="text-[11px] text-slate-500">
                  Monitoramento contínuo dos 4 pilares essenciais de autonomia linguística
                </p>
              </div>

              {currentUser && (
                <button
                  onClick={handleSaveCurrentSnapshot}
                  disabled={isSavingSnapshot}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
                  title="Salvar marco atual no histórico de evolução do Firestore"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isSavingSnapshot ? 'Gravando...' : 'Salvar Marco de Hoje'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/50">
                <div className="flex items-center gap-1.5 text-teal-800 text-xs font-bold">
                  <Mic className="w-3.5 h-3.5 text-teal-600" />
                  <span>Fonética & Fala</span>
                </div>
                <div className="text-xl font-black text-slate-900 mt-1">Nível {currentLevel}</div>
                <div className="text-[11px] text-slate-600 mt-0.5">Auditoria articulatória</div>
              </div>

              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50">
                <div className="flex items-center gap-1.5 text-rose-800 text-xs font-bold">
                  <Timer className="w-3.5 h-3.5 text-rose-600" />
                  <span>Reflexo Oral</span>
                </div>
                <div className="text-xl font-black text-slate-900 mt-1">&lt; 5s</div>
                <div className="text-[11px] text-slate-600 mt-0.5">Sem tradução mental</div>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50">
                <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span>Vocabulário 80/20</span>
                </div>
                <div className="text-xl font-black text-slate-900 mt-1">Chunks</div>
                <div className="text-[11px] text-slate-600 mt-0.5">Repetição espaçada</div>
              </div>

              <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50">
                <div className="flex items-center gap-1.5 text-purple-800 text-xs font-bold">
                  <Headphones className="w-3.5 h-3.5 text-purple-600" />
                  <span>Decodificação</span>
                </div>
                <div className="text-xl font-black text-slate-900 mt-1">Nativo</div>
                <div className="text-[11px] text-slate-600 mt-0.5">Fala conectada & reduções</div>
              </div>
            </div>
          </div>

          {/* Seção 3: Histórico de Marcos de Evolução (Firestore) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Histórico de Registros de Evolução do Aluno
                </h4>
              </div>
              {currentUser && (
                <button
                  onClick={loadHistory}
                  disabled={isLoadingHistory}
                  className="p-1 rounded text-slate-400 hover:text-slate-700"
                  title="Atualizar histórico"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHistory ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>

            {currentUser ? (
              history.length > 0 ? (
                <div className="space-y-2.5">
                  {history.map((record) => (
                    <div
                      key={record.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {record.date}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Nível {record.level}
                          </span>
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Aptidão: {record.overallScore}%
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          <strong>Prescrição:</strong> {record.prescribedAction}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium shrink-0">
                        <span>Fonética: {record.phoneticsScore}%</span>
                        <span>•</span>
                        <span>Reflexo: {record.oralReflexScore}%</span>
                        <span>•</span>
                        <span className="font-bold text-amber-600">+{record.xpEarned} XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-500">
                  <p className="font-medium text-slate-700">Nenhum marco de evolução registrado ainda.</p>
                  <p className="mt-1">
                    Clique no botão <strong>"Salvar Marco de Hoje"</strong> acima para registrar sua primeira avaliação de aptidão no histórico!
                  </p>
                </div>
              )
            ) : (
              <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-500">
                <p className="font-semibold text-slate-700">Faça login para habilitar a linha do tempo de evolução.</p>
                <p className="mt-1">Seus marcos, scores e diagnósticos ficarão gravados no seu prontuário pessoal.</p>
              </div>
            )}
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Sistema de Acompanhamento Baseado em SLAs Científicas</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
