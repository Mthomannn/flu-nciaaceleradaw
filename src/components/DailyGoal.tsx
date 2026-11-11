import React, { useState, useEffect, useRef } from 'react';
import {
  Target,
  CheckCircle2,
  Clock,
  Flame,
  Plus,
  Minus,
  Trophy,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  ChevronRight,
  Sliders,
  Check,
} from 'lucide-react';
import { ModuleId, TargetLanguage, FluencyLevel } from '../types';
import { useAuth } from '../context/AuthContext';

interface DailyGoalProps {
  language: TargetLanguage;
  level: FluencyLevel;
  onNavigate: (module: ModuleId) => void;
  onAddXp: (amount: number) => void;
}

const PRESET_GOALS = [
  { minutes: 15, label: 'Leve', desc: 'Manutenção diária' },
  { minutes: 25, label: 'Recomendado', desc: 'Missão completa' },
  { minutes: 45, label: 'Intenso', desc: 'Aceleração rápida' },
  { minutes: 60, label: 'Imersão', desc: 'Fluência em 90 dias' },
];

export const DailyGoal: React.FC<DailyGoalProps> = ({
  language,
  level,
  onNavigate,
  onAddXp,
}) => {
  const { studentProfile } = useAuth();
  const userId = studentProfile?.id || 'guest';

  // Data de hoje para isolar progresso diário
  const todayKey = new Date().toISOString().split('T')[0];

  const getTargetStorageKey = () => `fluency_daily_target_minutes_${userId}`;
  const getMinutesStorageKey = () => `fluency_daily_minutes_${userId}_${todayKey}`;
  const getClaimedStorageKey = () => `fluency_goal_xp_claimed_${userId}_${todayKey}`;

  // Meta diária em minutos (padrão: 25 min)
  const [targetMinutes, setTargetMinutes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`fluency_daily_target_minutes_${userId}`);
      return saved ? Math.max(5, parseInt(saved, 10)) : 25;
    } catch {
      return 25;
    }
  });

  // Minutos praticados hoje (novo usuário começa com 0!)
  const [todayMinutes, setTodayMinutes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`fluency_daily_minutes_${userId}_${todayKey}`);
      return saved ? Math.max(0, parseInt(saved, 10)) : 0;
    } catch {
      return 0;
    }
  });

  // Estado de edição da meta
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState<number>(targetMinutes);

  // Recompensa de XP já coletada hoje ao bater a meta
  const [xpClaimed, setXpClaimed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`fluency_goal_xp_claimed_${userId}_${todayKey}`) === 'true';
    } catch {
      return false;
    }
  });

  // Recarregar dados quando trocar de usuário (login/logout/cadastro)
  useEffect(() => {
    try {
      const savedTarget = localStorage.getItem(getTargetStorageKey());
      const validTarget = savedTarget ? Math.max(5, parseInt(savedTarget, 10)) : 25;
      setTargetMinutes(validTarget);
      setTempGoal(validTarget);

      const savedMinutes = localStorage.getItem(getMinutesStorageKey());
      setTodayMinutes(savedMinutes ? Math.max(0, parseInt(savedMinutes, 10)) : 0);

      const savedClaimed = localStorage.getItem(getClaimedStorageKey()) === 'true';
      setXpClaimed(savedClaimed);
    } catch {}
  }, [userId, todayKey]);

  // Timer de foco embutido (Sessão Rápida)
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(300); // 5 min padrão
  const [timerDuration, setTimerDuration] = useState(300);
  const timerIntervalRef = useRef<any>(null);

  // Salvar minutos praticados sempre que mudar
  useEffect(() => {
    try {
      localStorage.setItem(getMinutesStorageKey(), todayMinutes.toString());
    } catch {
      // noop
    }
  }, [todayMinutes, userId, todayKey]);

  // Salvar meta quando atualizada
  const handleSaveGoal = (minutes: number) => {
    const valid = Math.min(180, Math.max(5, minutes));
    setTargetMinutes(valid);
    setTempGoal(valid);
    setIsEditingGoal(false);
    try {
      localStorage.setItem(getTargetStorageKey(), valid.toString());
    } catch {
      // noop
    }
  };

  // Adicionar minutos de estudo
  const handleAddMinutes = (amount: number) => {
    setTodayMinutes((prev) => {
      const next = Math.max(0, prev + amount);
      return next;
    });
    // Adiciona XP proporcional (2 XP por minuto praticado)
    if (amount > 0) {
      onAddXp(amount * 2);
    }
  };

  // Reivindicar bônus de meta atingida
  const handleClaimGoalXp = () => {
    if (xpClaimed) return;
    onAddXp(100);
    setXpClaimed(true);
    try {
      localStorage.setItem(`fluency_goal_xp_claimed_${todayKey}`, 'true');
    } catch {
      // noop
    }
  };

  // Timer de foco ativo
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsTimerRunning(false);
            const addedMinutes = Math.round(timerDuration / 60);
            handleAddMinutes(addedMinutes);
            return timerDuration;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, timerDuration]);

  const toggleTimer = () => {
    setIsTimerRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSecondsLeft(timerDuration);
  };

  // Cálculos de progresso
  const progressPercent = Math.min(100, Math.round((todayMinutes / targetMinutes) * 100));
  const isGoalMet = todayMinutes >= targetMinutes;
  const remainingMinutes = Math.max(0, targetMinutes - todayMinutes);

  // Dimensões do anel SVG
  const ringRadius = 42;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = ringCircumference - (progressPercent / 100) * ringCircumference;

  // Dias da semana para histórico visual rápido
  const daysOfWeek = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const currentDayIndex = (new Date().getDay() + 6) % 7; // 0 para Seg, 6 para Dom

  return (
    <section
      id="daily-goal-card"
      className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-xs relative overflow-hidden transition-all h-full flex flex-col justify-between"
    >
      {/* Cabeçalho do Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shadow-2xs shrink-0">
            <Target className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-none">
                Meta Diária de Prática
              </h2>
              {isGoalMet && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 animate-in fade-in">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Meta Batida!
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Prática consistente em {language} gera fluência 4x mais rápido.
            </p>
          </div>
        </div>

        {/* Botão de Ajustar Meta */}
        <div className="flex items-center gap-2">
          <button
            id="btn-edit-daily-goal"
            onClick={() => {
              setTempGoal(targetMinutes);
              setIsEditingGoal(!isEditingGoal);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            {isEditingGoal ? 'Fechar Ajustes' : 'Ajustar Meta'}
          </button>
        </div>
      </div>

      {/* Painel Expansível de Ajuste de Meta */}
      {isEditingGoal && (
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Escolha seu tempo diário ideal:
            </span>
            <span className="text-xs text-slate-500">
              Atual: <strong className="text-slate-900">{targetMinutes} minutos</strong>
            </span>
          </div>

          {/* Presets Rápidos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_GOALS.map((preset) => (
              <button
                key={preset.minutes}
                onClick={() => handleSaveGoal(preset.minutes)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  targetMinutes === preset.minutes
                    ? 'border-amber-400 bg-amber-50/70 text-slate-900 shadow-2xs font-semibold'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="text-sm font-bold flex items-center justify-between">
                  <span>{preset.minutes} min</span>
                  {targetMinutes === preset.minutes && (
                    <Check className="w-3.5 h-3.5 text-amber-600" />
                  )}
                </div>
                <div className="text-[11px] text-slate-500">{preset.label}</div>
              </button>
            ))}
          </div>

          {/* Stepper Customizado */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/70">
            <span className="text-xs text-slate-600 font-medium">Ou personalize qualquer valor:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTempGoal((prev) => Math.max(5, prev - 5))}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                aria-label="Diminuir 5 minutos"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 min-w-[70px] text-center">
                {tempGoal} min
              </div>

              <button
                onClick={() => setTempGoal((prev) => Math.min(180, prev + 5))}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                aria-label="Aumentar 5 minutos"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleSaveGoal(tempGoal)}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors ml-1"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visualização Principal: Anel de Progresso + Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-3 sm:pt-4">
        {/* Coluna Esquerda: Anel Circular de Progresso */}
        <div className="md:col-span-5 lg:col-span-4 flex items-center justify-center sm:justify-start gap-3.5">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Círculo de fundo */}
              <circle
                cx="50"
                cy="50"
                r={ringRadius}
                className="stroke-slate-100"
                strokeWidth="9"
                fill="transparent"
              />
              {/* Círculo preenchido animado */}
              <circle
                cx="50"
                cy="50"
                r={ringRadius}
                className={`transition-all duration-700 ease-out ${
                  isGoalMet ? 'stroke-emerald-500' : 'stroke-amber-400'
                }`}
                strokeWidth="9"
                strokeDasharray={ringCircumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Conteúdo Central do Anel */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                {progressPercent}%
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">
                {isGoalMet ? 'Concluído' : 'Hoje'}
              </span>
            </div>
          </div>

          {/* Resumo ao lado do anel */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">
                {todayMinutes}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-400">
                / {targetMinutes} min
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-snug">
              {isGoalMet ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                  Meta diária alcançada!
                </span>
              ) : (
                <>
                  Faltam <strong className="text-slate-800">{remainingMinutes} min</strong> para
                  completar a meta.
                </>
              )}
            </p>

            {/* Barra Linear Complementar */}
            <div className="w-36 sm:w-44 bg-slate-100 h-2 rounded-full overflow-hidden mt-1.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isGoalMet ? 'bg-emerald-500' : 'bg-amber-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Coluna Central: Ações Rápidas de Registro & Timer */}
        <div className="md:col-span-7 lg:col-span-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Registrar Prática Rápida:
            </span>
            <button
              onClick={() => {
                setTodayMinutes(0);
                setXpClaimed(false);
                try {
                  localStorage.removeItem(getMinutesStorageKey());
                  localStorage.removeItem(getClaimedStorageKey());
                } catch {
                  // noop
                }
              }}
              className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
              title="Zerar progresso de hoje para testes"
            >
              <RotateCcw className="w-3 h-3" /> Zerar hoje
            </button>
          </div>

          {/* Botões de adição rápida de minutos */}
          <div className="flex flex-wrap items-center gap-2">
            {[5, 10, 15, 30].map((mins) => (
              <button
                key={mins}
                id={`btn-add-${mins}-min`}
                onClick={() => handleAddMinutes(mins)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/30 text-slate-800 text-xs font-bold transition-all transform active:scale-95 shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-amber-600" />
                {mins} min
                <span className="text-[10px] text-amber-700 font-normal">
                  (+{mins * 2} XP)
                </span>
              </button>
            ))}
          </div>

          {/* Mini Timer de Foco de 5 Minutos */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isTimerRunning ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-slate-200 text-slate-600'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>Sessão de Foco</span>
                  <span className="font-mono text-xs px-1.5 py-0.2 bg-white rounded border border-slate-200 text-slate-900">
                    {Math.floor(timerSecondsLeft / 60)}:
                    {(timerSecondsLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  +5 min automáticos ao concluir
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                id="btn-toggle-goal-timer"
                onClick={toggleTimer}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  isTimerRunning
                    ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-3 h-3" /> Pausar
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-white" /> Iniciar
                  </>
                )}
              </button>

              {timerSecondsLeft !== timerDuration && (
                <button
                  onClick={resetTimer}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Reiniciar timer"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Bônus de Meta & Dias da Semana */}
        <div className="md:col-span-12 lg:col-span-3 bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Consistência Semanal
            </span>
            <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Meta Ativa
            </span>
          </div>

          {/* Mini Calendário Semanal */}
          <div className="grid grid-cols-7 gap-1">
            {daysOfWeek.map((day, idx) => {
              const isToday = idx === currentDayIndex;
              const isPast = idx < currentDayIndex;
              const completedDay = isPast || (isToday && isGoalMet);

              return (
                <div key={day} className="flex flex-col items-center gap-1">
                  <span className={`text-[10px] ${isToday ? 'font-bold text-slate-900' : 'text-slate-400'}`}>
                    {day}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-all ${
                      completedDay
                        ? 'bg-emerald-500 text-white shadow-2xs'
                        : isToday
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-200/70 text-slate-400'
                    }`}
                  >
                    {completedDay ? '✓' : idx + 1}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Card de Recompensa de Meta */}
          {isGoalMet && !xpClaimed && (
            <button
              id="btn-claim-goal-xp"
              onClick={handleClaimGoalXp}
              className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transform active:scale-98 transition-all animate-bounce"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Resgatar +100 XP da Meta!
            </button>
          )}

          {isGoalMet && xpClaimed && (
            <div className="text-center py-1.5 px-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-semibold text-xs flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              +100 XP Diário Resgatado!
            </div>
          )}

          {!isGoalMet && (
            <button
              id="btn-practice-goal-now"
              onClick={() => onNavigate('drills')}
              className="w-full py-2 px-3 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <Play className="w-3 h-3 text-slate-800 fill-slate-800" />
              Praticar para Bater a Meta
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
