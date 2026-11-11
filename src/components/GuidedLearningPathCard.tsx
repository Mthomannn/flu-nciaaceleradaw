import React, { useState, useEffect } from 'react';
import {
  Compass,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  Clock,
  ShieldCheck,
  Play,
  RotateCcw,
  Award,
  ChevronRight,
  Target,
  Flame,
} from 'lucide-react';
import { ModuleId } from '../types';
import {
  GUIDED_EVOLUTIONARY_STEPS,
  GuidedStep,
  getSavedGuidedStep,
  saveGuidedStep,
  getCompletedGuidedSteps,
  markStepAsCompleted,
  getGuidedStepData,
} from '../services/guidedSequence';

interface GuidedLearningPathCardProps {
  onNavigate: (module: ModuleId) => void;
  onAddXp: (amount: number) => void;
}

export const GuidedLearningPathCard: React.FC<GuidedLearningPathCardProps> = ({
  onNavigate,
  onAddXp,
}) => {
  const [currentStepNumber, setCurrentStepNumber] = useState<number>(() => getSavedGuidedStep());
  const [completedSteps, setCompletedSteps] = useState<number[]>(() => getCompletedGuidedSteps());
  const [justCompletedToast, setJustCompletedToast] = useState<string | null>(null);

  const activeStep: GuidedStep = getGuidedStepData(currentStepNumber);
  const isCurrentStepCompleted = completedSteps.includes(currentStepNumber);
  const progressPercent = Math.round((completedSteps.length / 12) * 100);

  const handleGoToStepLesson = (step: GuidedStep) => {
    saveGuidedStep(step.stepNumber);
    setCurrentStepNumber(step.stepNumber);

    // Se a etapa tiver uma sub-aba específica, podemos salvar no localStorage do respectivo módulo
    if (step.targetModule === 'vocabulary' && step.subTab) {
      try {
        const raw = localStorage.getItem('fluency_vocab_tab_state');
        const parsed = raw ? JSON.parse(raw) : {};
        parsed.activeTab = step.subTab;
        localStorage.setItem('fluency_vocab_tab_state', JSON.stringify(parsed));
      } catch {}
    } else if (step.targetModule === 'drills' && step.subTab) {
      try {
        const raw = localStorage.getItem('fluency_speech_drills_A1') || localStorage.getItem('fluency_speech_drills_Zero');
        const parsed = raw ? JSON.parse(raw) : {};
        parsed.activeTab = step.subTab;
        localStorage.setItem('fluency_speech_drills_A1', JSON.stringify(parsed));
        localStorage.setItem('fluency_speech_drills_Zero', JSON.stringify(parsed));
      } catch {}
    } else if (step.targetModule === 'listening' && step.subTab) {
      try {
        const raw = localStorage.getItem('fluency_listening_A1') || localStorage.getItem('fluency_listening_Zero');
        const parsed = raw ? JSON.parse(raw) : {};
        parsed.activeTab = step.subTab;
        localStorage.setItem('fluency_listening_A1', JSON.stringify(parsed));
        localStorage.setItem('fluency_listening_Zero', JSON.stringify(parsed));
      } catch {}
    }

    onNavigate(step.targetModule);
  };

  const handleMarkAsCompleted = () => {
    const updated = markStepAsCompleted(currentStepNumber);
    setCompletedSteps(updated);
    onAddXp(activeStep.xpReward);
    setJustCompletedToast(`+${activeStep.xpReward} XP! Passo ${currentStepNumber} concluído com sucesso.`);
    setTimeout(() => setJustCompletedToast(null), 3000);

    if (currentStepNumber < 12) {
      const nextStep = currentStepNumber + 1;
      setCurrentStepNumber(nextStep);
      saveGuidedStep(nextStep);
    }
  };

  const handleSelectStep = (stepNum: number) => {
    setCurrentStepNumber(stepNum);
    saveGuidedStep(stepNum);
  };

  const handlePrevStep = () => {
    if (currentStepNumber > 1) {
      const prev = currentStepNumber - 1;
      setCurrentStepNumber(prev);
      saveGuidedStep(prev);
    }
  };

  const handleNextStep = () => {
    if (currentStepNumber < 12) {
      const next = currentStepNumber + 1;
      setCurrentStepNumber(next);
      saveGuidedStep(next);
    }
  };

  return (
    <section className="bg-white rounded-2xl border-2 border-indigo-500/80 p-5 sm:p-6 shadow-md space-y-5 relative overflow-hidden">
      {/* Faixa decorativa superior com gradiente marcante */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-amber-400 to-indigo-600" />

      {/* 1. Cabeçalho do Direcionador do Sistema */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
              <Compass className="w-3.5 h-3.5" />
              Trilha Direcionada pelo Sistema
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Sequência Gradativa 0 ➔ A1
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {completedSteps.length} de 12 passos dominados ({progressPercent}%)
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Sua Próxima Lição Guiada: Passo {activeStep.stepNumber} de 12</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Você não precisa ficar escolhendo o que estudar. O sistema guia sua evolução hora a hora em 12 passos lógicos, garantindo base extremamente sólida e zero confusão.
          </p>
        </div>

        {/* Barra de Progresso Rápida */}
        <div className="flex flex-col items-start lg:items-end gap-1.5 shrink-0 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <span>Progresso da Trilha:</span>
            <span className="text-indigo-600">{progressPercent}%</span>
          </div>
          <div className="w-48 sm:w-56 h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500">
            {12 - completedSteps.length} passos restantes para A1 sólido
          </span>
        </div>
      </div>

      {/* 2. Régua Interativa com os 12 Passos Sequenciais */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
          <span>Passos Sequenciais (Clique em qualquer passo para inspecionar):</span>
          <span>{activeStep.phaseTitle}</span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
          {GUIDED_EVOLUTIONARY_STEPS.map((step) => {
            const isCompleted = completedSteps.includes(step.stepNumber);
            const isSelected = step.stepNumber === currentStepNumber;

            return (
              <button
                key={step.stepNumber}
                onClick={() => handleSelectStep(step.stepNumber)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all border cursor-pointer relative ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-indigo-500 shadow-sm'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
                title={`Passo ${step.stepNumber}: ${step.title}`}
              >
                {isCompleted ? (
                  <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-emerald-600'}`} />
                ) : (
                  <span className={`text-xs font-black ${isSelected ? 'text-amber-400' : 'text-slate-700'}`}>
                    #{step.stepNumber}
                  </span>
                )}
                <span className="text-[10px] font-bold mt-0.5 truncate max-w-full">
                  {step.shortTitle.split('.')[1]?.trim().slice(0, 7) || `P${step.stepNumber}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Card Principal em Destaque do Passo Atual */}
      <div className="bg-gradient-to-br from-indigo-50/70 via-white to-amber-50/40 rounded-xl border border-indigo-200 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-600 text-white text-xs font-black">
                PASSO {activeStep.stepNumber} DE 12
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                {activeStep.hourRange}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {activeStep.phaseTitle}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 pt-1">
              {activeStep.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {activeStep.description}
            </p>
          </div>

          {/* Recompensa de XP */}
          <div className="shrink-0 flex sm:flex-col items-center justify-between sm:justify-center bg-white p-2.5 rounded-xl border border-indigo-100 text-center shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Recompensa</span>
            <span className="text-base font-black text-amber-600 flex items-center gap-0.5">
              <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
              +{activeStep.xpReward} XP
            </span>
          </div>
        </div>

        {/* Meta Concreta do Passo */}
        <div className="bg-white/90 rounded-lg p-3 border border-indigo-100 flex items-start gap-2.5">
          <Target className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-slate-800">
            <span className="font-bold text-indigo-900">Critério de Domínio Deste Passo: </span>
            {activeStep.learningGoal}
          </div>
        </div>

        {/* 4. Barra de Ações: Ir para Lição, Marcar Concluído e Navegação */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-indigo-100">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevStep}
              disabled={currentStepNumber === 1}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
              title="Passo Anterior"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>

            <button
              onClick={handleNextStep}
              disabled={currentStepNumber === 12}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
              title="Próximo Passo"
            >
              <span>Próximo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Botão de Marcar como Concluído */}
            <button
              onClick={handleMarkAsCompleted}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isCurrentStepCompleted
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isCurrentStepCompleted ? 'Passo Já Concluído ✓' : 'Marcar Passo como Concluído'}</span>
            </button>

            {/* BOTÃO PRIMÁRIO: FAZER LIÇÃO AGORA (DIRECIONAMENTO IMEDIATO) */}
            <button
              id="btn-do-current-guided-step"
              onClick={() => handleGoToStepLesson(activeStep)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-black shadow-md flex items-center gap-2 cursor-pointer transition-all animate-pulse"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{activeStep.actionText} ➔</span>
            </button>
          </div>
        </div>

        {justCompletedToast && (
          <div className="p-2.5 bg-emerald-600 text-white rounded-lg text-xs font-bold text-center animate-in fade-in duration-200">
            🎉 {justCompletedToast}
          </div>
        )}
      </div>
    </section>
  );
};
