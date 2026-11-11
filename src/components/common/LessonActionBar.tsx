import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  RotateCcw,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { TargetLanguage, FluencyLevel, ModuleId } from '../../types';
import {
  LessonProgressEntry,
  getLessonStatus,
  markLessonMastered,
  refazerLesson,
  scheduleLessonSRS,
  getSuggestedNextLessons,
  SuggestedLessonItem,
} from '../../services/lessonProgress';

interface LessonActionBarProps {
  lessonId: string;
  lessonTitle: string;
  module: ModuleId | string;
  language: TargetLanguage;
  level: FluencyLevel;
  onRefazer?: () => void;
  onNavigateToModule?: (module: ModuleId) => void;
  onAddXp?: (amount: number) => void;
  className?: string;
  compact?: boolean;
}

export const LessonActionBar: React.FC<LessonActionBarProps> = ({
  lessonId,
  lessonTitle,
  module,
  language,
  level,
  onRefazer,
  onNavigateToModule,
  onAddXp,
  className = '',
  compact = false,
}) => {
  const [progress, setProgress] = useState<LessonProgressEntry | null>(() =>
    getLessonStatus(language, level, lessonId)
  );
  const [showSrsMenu, setShowSrsMenu] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedLessonItem[]>([]);
  const [justMastered, setJustMastered] = useState(false);

  // Sincronizar ao trocar lição, idioma ou nível
  useEffect(() => {
    const p = getLessonStatus(language, level, lessonId);
    setProgress(p);
    setJustMastered(false);
    setShowSrsMenu(false);
  }, [language, level, lessonId]);

  // Carregar sugestões quando dominada
  useEffect(() => {
    if (progress?.status === 'mastered' || justMastered) {
      const next = getSuggestedNextLessons(language, level, module, lessonId);
      setSuggestions(next);
    } else {
      setSuggestions([]);
    }
  }, [progress?.status, justMastered, language, level, module, lessonId]);

  const handleMarkMastered = () => {
    const updated = markLessonMastered(language, level, lessonId, lessonTitle, module);
    setProgress(updated);
    setJustMastered(true);
    if (onAddXp) onAddXp(20);
  };

  const handleRefazer = (intervalDays: number = 1) => {
    const updated = refazerLesson(language, level, lessonId, lessonTitle, module, intervalDays);
    setProgress(updated);
    setJustMastered(false);
    setShowSrsMenu(false);
    if (onRefazer) {
      onRefazer();
    }
  };

  const handleCustomSrs = (days: number) => {
    const updated = scheduleLessonSRS(language, level, lessonId, days, lessonTitle, module);
    setProgress(updated);
    setShowSrsMenu(false);
  };

  const isDone = !!progress && (progress.status === 'completed' || progress.status === 'mastered');
  const isMastered = progress?.status === 'mastered';

  return (
    <div
      className={`border border-slate-200/90 bg-white rounded-xl transition-all shadow-2xs ${
        compact ? 'p-2.5 sm:p-3' : 'p-3.5 sm:p-4'
      } ${className}`}
    >
      {/* Barra Principal: Status à Esquerda e Ações Claras à Direita */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Visual Claro e Minimalista */}
        <div className="flex items-center gap-2 flex-wrap">
          {isMastered ? (
            <span
              id={`status-badge-mastered-${lessonId}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs"
              title="Você já dominou este conteúdo"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Já aprendida (Dominada)</span>
            </span>
          ) : isDone ? (
            <span
              id={`status-badge-done-${lessonId}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs"
              title="Exercício realizado com sucesso"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Já feito ({progress?.completedCount}x)</span>
            </span>
          ) : (
            <span
              id={`status-badge-new-${lessonId}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-semibold text-xs"
            >
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>Ainda não feito</span>
            </span>
          )}

          {/* Próxima Revisão Espaçada (SRS) */}
          {isDone && progress && (
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>Revisão SRS: em {progress.intervalDays}d</span>
            </span>
          )}
        </div>

        {/* Ações Diretas: Já Aprendida, Refazer e Agendar SRS */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          {/* Botão: Já Aprendida */}
          <button
            id={`btn-mark-mastered-${lessonId}`}
            type="button"
            onClick={handleMarkMastered}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isMastered
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
            }`}
            title="Marcar como já aprendida e dominada"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isMastered ? 'Aprendida ✓' : 'Já aprendida'}</span>
          </button>

          {/* Botão: Refazer */}
          <button
            id={`btn-refazer-${lessonId}`}
            type="button"
            onClick={() => handleRefazer(1)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Refazer este exercício agora"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Refazer</span>
          </button>

          {/* Repetição Espaçada Personalizada */}
          <div className="relative">
            <button
              id={`btn-srs-toggle-${lessonId}`}
              type="button"
              onClick={() => setShowSrsMenu(!showSrsMenu)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center gap-1 transition-colors cursor-pointer"
              title="Ajustar repetição espaçada"
            >
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Espaçamento</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showSrsMenu && (
              <div className="absolute right-0 bottom-full sm:bottom-auto sm:top-full mb-1 sm:mb-0 sm:mt-1 z-30 w-44 bg-white rounded-xl shadow-lg border border-slate-200 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-0.5">
                  Revisar em:
                </div>
                <button
                  type="button"
                  onClick={() => handleCustomSrs(1)}
                  className="w-full text-left px-2 py-1 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span>1 dia (Amanhã)</span>
                  <span className="text-[10px] text-slate-400">Intensivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCustomSrs(3)}
                  className="w-full text-left px-2 py-1 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span>3 dias</span>
                  <span className="text-[10px] text-slate-400">Padrão</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCustomSrs(7)}
                  className="w-full text-left px-2 py-1 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span>7 dias</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Consolidado</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCustomSrs(14)}
                  className="w-full text-left px-2 py-1 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span>14 dias</span>
                  <span className="text-[10px] text-amber-600 font-semibold">Dominado</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sugestões de Novos Conteúdos no Nível Estudado (Exibido de Forma Minimalista) */}
      {(isMastered || justMastered) && suggestions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Conteúdo dominado! Próximos passos no Nível {level}:</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Recomendação lógica</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestions.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/70 transition-all flex items-center justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px] border border-indigo-200/50">
                      {item.typeBadge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium truncate">
                      ~{item.estimatedMinutes} min
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {item.title}
                  </div>
                </div>

                {onNavigateToModule && (
                  <button
                    id={`btn-suggested-goto-${item.id}`}
                    type="button"
                    onClick={() => onNavigateToModule(item.module)}
                    className="shrink-0 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Ir</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
