import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Layers,
  Zap,
  Target,
  BookOpen,
  Headphones,
  Timer,
  Mic,
  Brain,
} from 'lucide-react';
import {
  FOUNDATION_100_HOURS_ROADMAP,
  Milestone100Hours,
  getMilestoneForHours,
} from '../data/foundation100HoursData';
import { TargetLanguage, FluencyLevel, ModuleId } from '../types';

interface FoundationRoadmapCardProps {
  language: TargetLanguage;
  level: FluencyLevel;
  totalHoursCompleted?: number;
  onNavigate?: (module: ModuleId) => void;
  onAddXp?: (amount: number) => void;
}

export const FoundationRoadmapCard: React.FC<FoundationRoadmapCardProps> = ({
  language,
  level,
  totalHoursCompleted = 12,
  onNavigate,
  onAddXp,
}) => {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('m1_zero_fonetica');
  const [activeTab, setActiveTab] = useState<'marcos' | 'distribuicao' | 'semanas'>('marcos');

  // Mapeamento dinâmico de horas completadas conforme o nível atual
  const initialCalculatedHours =
    level === 'Zero'
      ? Math.min(38, Math.max(5, totalHoursCompleted))
      : level === 'A1'
      ? Math.min(95, Math.max(45, totalHoursCompleted + 40))
      : 100;

  const [currentHours, setCurrentHours] = useState<number>(initialCalculatedHours);

  const { currentMilestone, progressPercent, remainingHoursToA1 } = getMilestoneForHours(currentHours);

  const activeMilestone =
    FOUNDATION_100_HOURS_ROADMAP.milestones.find((m) => m.id === selectedMilestoneId) ||
    currentMilestone;

  const handlePillarClick = (pillarName: string) => {
    if (!onNavigate) return;
    if (pillarName.includes('Ouvido') || pillarName.includes('Listening')) onNavigate('listening');
    else if (pillarName.includes('Reflexo') || pillarName.includes('Resposta') || pillarName.includes('Drills')) onNavigate('drills');
    else if (pillarName.includes('Pronúncia') || pillarName.includes('Fonética')) onNavigate('pronunciation');
    else if (pillarName.includes('Vocabulário')) onNavigate('vocabulary');
    else if (pillarName.includes('Conversação')) onNavigate('conversation');
    else if (pillarName.includes('Pensar')) onNavigate('thinking');
    else if (pillarName.includes('Imersão')) onNavigate('immersion');
    else onNavigate('architect');
  };

  return (
    <section className="bg-white rounded-2xl border border-indigo-200/90 p-5 sm:p-6 shadow-xs space-y-5 relative overflow-hidden">
      {/* Faixa decorativa superior */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-amber-400 to-emerald-500" />

      {/* 1. Cabeçalho da Trilha de 100 Horas */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              Garantia de Base Extremamente Sólida
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              Trilha Oficial 100 Horas: Nível 0 ➔ A1
            </span>
            <span className="text-xs font-medium text-slate-500">
              {language}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Evolução Gradativa Estruturada (100 Horas de Aulas Ativas)</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Do Zero absoluto ao A1 consolidado sem saltos bruscos. O aluno constrói base muscular fonética, automatiza 300 blocos sem tradução e destrava fala espontânea em 4 marcos cumulativos de 25 horas.
          </p>
        </div>

        {/* Medidor de Horas & Progresso do Aluno */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 shrink-0 flex flex-col sm:flex-row items-center gap-4">
          <div className="text-center sm:text-left">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Horas de Estudo Ativo
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {currentHours}h
              </span>
              <span className="text-xs font-bold text-slate-500">
                de 100h
              </span>
            </div>
            <div className="text-[11px] font-semibold text-indigo-600 mt-0.5">
              {remainingHoursToA1 > 0 ? `${remainingHoursToA1}h restantes para A1 pleno` : 'A1 100% Concluído!'}
            </div>
          </div>

          {/* Barra Circular ou Linear */}
          <div className="w-full sm:w-28 space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-slate-700">
              <span>Progresso</span>
              <span className="font-mono text-indigo-600">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Seletor de Abas da Trilha (Marcos / Distribuição / Cronograma Semanal) */}
      <div className="flex rounded-xl bg-slate-100 p-1 gap-1 border border-slate-200/60">
        <button
          onClick={() => setActiveTab('marcos')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'marcos'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          4 Marcos Cumulativos (0 a 100h)
        </button>
        <button
          onClick={() => setActiveTab('distribuicao')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'distribuicao'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Distribuição dos 5 Pilares (100h)
        </button>
        <button
          onClick={() => setActiveTab('semanas')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'semanas'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cronograma das 12 Semanas
        </button>
      </div>

      {/* 3. CONTEÚDO DA ABA 1: OS 4 MARCOS CUMULATIVOS */}
      {activeTab === 'marcos' && (
        <div className="space-y-4">
          {/* Seletor de Etapas 1, 2, 3 e 4 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {FOUNDATION_100_HOURS_ROADMAP.milestones.map((m, idx) => {
              const isSelected = selectedMilestoneId === m.id;
              const isAchieved = currentHours >= m.hoursAccumulated;
              const isCurrent = currentMilestone.id === m.id;

              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMilestoneId(m.id)}
                  className={`p-3 rounded-xl border text-left transition-all relative cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-1 ring-indigo-500/30'
                      : 'border-slate-200 bg-white hover:bg-slate-50/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {m.hourRange}
                    </span>
                    {isAchieved ? (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Concluído
                      </span>
                    ) : isCurrent ? (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 uppercase">
                        Em curso
                      </span>
                    ) : null}
                  </div>
                  <div className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                    Marco {idx + 1}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    {m.focusTitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detalhes do Marco Selecionado */}
          <div className="p-4 sm:p-5 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/40 via-white to-amber-50/20 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100/80 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 block">
                  {activeMilestone.hourRange} • {activeMilestone.badge}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                  {activeMilestone.stageName}
                </h3>
              </div>
              <div className="text-xs font-bold text-slate-500 sm:text-right">
                Meta Cumulativa: <strong className="text-slate-900">{activeMilestone.hoursAccumulated} horas</strong>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {activeMilestone.description}
            </p>

            {/* Competências Chave adquiridas neste marco */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-600" />
                Competências Práticas Conquistadas (Base Sólida):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeMilestone.keyCompetencies.map((comp, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2.5 rounded-lg bg-white border border-slate-200/80 text-xs font-medium text-slate-800"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkpoint Prático de Avaliação & Pilares Recomendados */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-indigo-100/60">
              <div className="text-xs bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-emerald-950 font-semibold flex-1">
                <strong>🎯 Checkpoint Prático:</strong> {activeMilestone.checkpointGoal}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                <span className="text-[11px] font-bold text-slate-400 mr-1">Praticar agora:</span>
                {activeMilestone.targetPillars.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePillarClick(p)}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 text-[11px] font-bold text-slate-700 hover:text-indigo-700 transition-colors cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. CONTEÚDO DA ABA 2: DISTRIBUIÇÃO DAS 100 HORAS PELOS PILARES */}
      {activeTab === 'distribuicao' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {FOUNDATION_100_HOURS_ROADMAP.hoursDistribution.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-indigo-300 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">
                    {item.category}
                  </span>
                  <span className="text-sm font-black font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {item.hours}h ({item.percentage}%)
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {item.purpose}
                </p>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                  {item.pillars.map((pil, pi) => (
                    <button
                      key={pi}
                      onClick={() => handlePillarClick(pil)}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 cursor-pointer"
                    >
                      {pil} ➔
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium">
            💡 <strong>Por que 100 Horas?</strong> Pesquisas em neurolinguística e o Quadro Comum Europeu (CEFR) comprovam que para um falante nativo de português alcançar a base sólida de um novo idioma sem vícios persistentes são necessárias 80 a 100 horas guiadas de input compreensível e reflexo oral ativo.
          </div>
        </div>
      )}

      {/* 5. CONTEÚDO DA ABA 3: CRONOGRAMA DE 12 SEMANAS */}
      {activeTab === 'semanas' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {FOUNDATION_100_HOURS_ROADMAP.weeklyScheduleTemplate.map((w, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {w.week}
                  </span>
                  <span className="text-xs font-black font-mono text-slate-800">
                    {w.hoursTarget}h
                  </span>
                </div>

                <div className="text-xs font-black text-slate-900">
                  {w.phaseTitle}
                </div>

                <p className="text-[11px] text-slate-600 leading-snug">
                  {w.coreActivities}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs font-medium text-slate-700">
              Ritmo recomendado: <strong>45 a 60 minutos por dia</strong> para completar as 100 horas em 3 meses com retenção máxima.
            </span>
            {onNavigate && (
              <button
                onClick={() => onNavigate('architect')}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shrink-0 cursor-pointer"
              >
                Ajustar Ritmo no Arquiteto ➔
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
