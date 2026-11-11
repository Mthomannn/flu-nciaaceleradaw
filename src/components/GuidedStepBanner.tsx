import React, { useState } from 'react';
import { Compass, CheckCircle2, ArrowRight, Play, Award } from 'lucide-react';
import { ModuleId } from '../types';
import {
  getSavedGuidedStep,
  getGuidedStepData,
  markStepAsCompleted,
  saveGuidedStep,
  getCompletedGuidedSteps,
} from '../services/guidedSequence';

interface GuidedStepBannerProps {
  currentModule: ModuleId;
  onNavigate?: (module: ModuleId) => void;
  onAddXp?: (amount: number) => void;
}

export const GuidedStepBanner: React.FC<GuidedStepBannerProps> = ({
  currentModule,
  onNavigate,
  onAddXp,
}) => {
  const [stepNum, setStepNum] = useState<number>(() => getSavedGuidedStep());
  const [completedSteps, setCompletedSteps] = useState<number[]>(() => getCompletedGuidedSteps());
  const [showToast, setShowToast] = useState(false);

  const step = getGuidedStepData(stepNum);
  const isMatchModule = step.targetModule === currentModule;
  const isCompleted = completedSteps.includes(stepNum);

  const handleCompleteAndNext = () => {
    const updated = markStepAsCompleted(stepNum);
    setCompletedSteps(updated);
    if (onAddXp) onAddXp(step.xpReward);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);

    if (stepNum < 12) {
      const nextNum = stepNum + 1;
      setStepNum(nextNum);
      saveGuidedStep(nextNum);
      const nextStepData = getGuidedStepData(nextNum);
      if (onNavigate && nextStepData.targetModule !== currentModule) {
        onNavigate(nextStepData.targetModule);
      }
    }
  };

  return (
    <div className="bg-indigo-900 text-white rounded-xl p-3 sm:p-3.5 mb-4 border border-indigo-700/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-indigo-700 text-amber-300 flex items-center justify-center shrink-0 text-xs font-black">
          #{step.stepNumber}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
              Trilha Guiada • Passo {step.stepNumber} de 12 ({step.hourRange})
            </span>
            {isCompleted && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded font-bold">
                Concluído ✓
              </span>
            )}
          </div>
          <div className="text-xs sm:text-sm font-bold truncate text-white">
            {step.title}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
        <button
          onClick={handleCompleteAndNext}
          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          title="Marcar lição atual como dominada e avançar para o próximo passo da sequência evolutiva"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{isCompleted ? 'Avançar Próximo Passo ➔' : 'Concluir & Próximo ➔'}</span>
        </button>

        {onNavigate && (
          <button
            onClick={() => onNavigate('overview')}
            className="px-2.5 py-1.5 rounded-lg bg-indigo-800/80 hover:bg-indigo-800 text-indigo-200 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
            title="Voltar ao Painel Geral da Trilha"
          >
            Ver Trilha
          </button>
        )}
      </div>

      {showToast && (
        <div className="absolute top-2 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg animate-bounce">
          🎉 +{step.xpReward} XP! Passo {step.stepNumber} concluído!
        </div>
      )}
    </div>
  );
};
