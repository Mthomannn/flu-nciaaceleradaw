import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Zap,
  Target,
  Mic,
  Timer,
  BookOpen,
  Headphones,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';
import { TargetLanguage, FluencyLevel, ModuleId, LinguisticAgentDiagnosis } from '../types';

interface SeniorLinguisticAgentCardProps {
  language: TargetLanguage;
  level: FluencyLevel;
  streakDays: number;
  totalXp: number;
  onNavigate: (module: ModuleId) => void;
  onAddXp: (amount: number) => void;
  onOpenEvolution?: () => void;
}

export const SeniorLinguisticAgentCard: React.FC<SeniorLinguisticAgentCardProps> = ({
  language,
  level,
  streakDays,
  totalXp,
  onNavigate,
  onAddXp,
  onOpenEvolution,
}) => {
  const [diagnosis, setDiagnosis] = useState<LinguisticAgentDiagnosis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const storageKey = `fluency_linguistic_agent_${language}_${level}`;

  // Carregar do cache ou gerar na primeira montagem
  useEffect(() => {
    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        setDiagnosis(parsed);
        setLastUpdated(parsed.timestamp);
        return;
      }
    } catch {
      // noop
    }

    // Se não há cache, gerar automaticamente
    fetchDiagnosis();
  }, [language, level]);

  const fetchDiagnosis = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/linguistic-agent-diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          level,
          streakDays,
          totalXp,
          userGoal: 'Fluência comunicativa rápida sem tradução mental',
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setDiagnosis(json.data);
        setLastUpdated(json.data.timestamp);
        try {
          localStorage.setItem(storageKey, JSON.stringify(json.data));
        } catch {
          // noop
        }
        onAddXp(15);
      } else {
        throw new Error('Falha ao processar diagnóstico.');
      }
    } catch (err: any) {
      console.warn('Erro ao consultar Agente Sênior:', err);
      setErrorMsg('Não foi possível atualizar com a rede no momento; exibindo diretriz pré-calibrada.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPillarIcon = (moduleId: ModuleId) => {
    switch (moduleId) {
      case 'pronunciation':
        return Mic;
      case 'drills':
        return Timer;
      case 'vocabulary':
        return BookOpen;
      case 'listening':
        return Headphones;
      default:
        return Target;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'crítico':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'em desenvolvimento':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'sólido':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'avançado':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <section
      id="senior-linguistic-agent-card"
      className="bg-white rounded-2xl border border-indigo-150 p-5 sm:p-6 shadow-xs relative overflow-hidden transition-all hover:border-indigo-300"
    >
      {/* Faixa Superior de Identificação do Agente */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 text-amber-300 flex items-center justify-center shrink-0 shadow-sm">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                Agente Sênior de Linguística Aplicada
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                {language} • Nível {level} • Aquisição Acelerada
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
              Motor Anti-Estagnação & Aptidão Linguística
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {onOpenEvolution && (
            <button
              id="btn-open-evolution-agent-card"
              onClick={onOpenEvolution}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Acompanhar histórico de evolução e necessidades do aluno"
            >
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              <span>Prontuário de Evolução</span>
            </button>
          )}

          <button
            id="btn-recalibrate-linguistic-agent"
            onClick={fetchDiagnosis}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
            title="Recalcular aptidão e gerar novo plano diário anti-platô com o Gemini"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : 'text-slate-400'}`} />
            <span>{isLoading ? 'Analisando...' : 'Recalibrar'}</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Conteúdo do Diagnóstico */}
      {diagnosis && (
        <div className="mt-5 space-y-5">
          {/* Topo do Diagnóstico: Score de Aptidão & Risco de Platô */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Medidor de Aptidão Global */}
            <div className="md:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-4 text-white flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">
                  Índice de Aptidão Linguística
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  Nível {level}
                </span>
              </div>

              <div className="my-3 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
                  {diagnosis.overallAptitudeScore}
                </span>
                <span className="text-sm font-semibold text-slate-400">/ 100</span>
                <span className="text-xs text-indigo-200 font-medium ml-auto">
                  {diagnosis.aptitudeTitle}
                </span>
              </div>

              {/* Barra de Progresso de Aptidão */}
              <div className="space-y-1">
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(15, diagnosis.overallAptitudeScore))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>Iniciante (0-40)</span>
                  <span>Operacional (41-75)</span>
                  <span>Autonomia (76-100)</span>
                </div>
              </div>
            </div>

            {/* Alerta Anti-Estagnação / Platô */}
            <div className="md:col-span-7 bg-amber-50/70 rounded-xl border border-amber-200/90 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                      Detecção Ativa de Estagnação (Anti-Platô)
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      diagnosis.stagnationRisk.level === 'alto'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : diagnosis.stagnationRisk.level === 'moderado'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    Risco {diagnosis.stagnationRisk.level}
                  </span>
                </div>

                <p className="text-xs font-bold text-slate-900 leading-snug">
                  {diagnosis.stagnationRisk.identifiedPlateau}
                </p>

                <p className="text-[11px] text-amber-900/90 mt-1 leading-relaxed">
                  <strong>Prescrição Diária do Agente:</strong> {diagnosis.stagnationRisk.antiPlateauPrescription}
                </p>
              </div>

              <div className="pt-2 mt-2 border-t border-amber-200/60 flex items-center justify-between text-[10px] text-amber-800">
                <span className="truncate">Base: {diagnosis.stagnationRisk.scientificBasis}</span>
                <span className="font-bold text-amber-900 shrink-0 ml-2">Protocolo SLA Ativo</span>
              </div>
            </div>
          </div>

          {/* Os 4 Pilares de Aptidão Científica */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Auditoria dos 4 Pilares da Fluência Prática
              </h3>
              <span className="text-[11px] text-slate-400">
                Clique na ação para corrigir o pilar imediatamente
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {(Object.keys(diagnosis.pillars) as (keyof typeof diagnosis.pillars)[]).map((key) => {
                const pillar = diagnosis.pillars[key];
                const Icon = getPillarIcon(pillar.recommendedModule);
                return (
                  <div
                    key={key}
                    className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getStatusBadge(pillar.status)}`}>
                          {pillar.status}
                        </span>
                        <span className="text-xs font-bold font-mono text-slate-700">
                          {pillar.score}%
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {pillar.name}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {pillar.diagnostic}
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigate(pillar.recommendedModule)}
                      className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors w-full cursor-pointer"
                    >
                      <span>{pillar.actionText}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3 Micro-Missões Cirúrgicas do Dia */}
          <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-3.5 sm:p-4">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Plano Cirúrgico de Atualização de Hoje (3 Ações Imediatas)
                </h4>
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                ~20 min total
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {diagnosis.dailyLinguisticMissions.map((mission, idx) => (
                <div
                  key={mission.id || idx}
                  onClick={() => onNavigate(mission.pillarId)}
                  className="bg-white p-3 rounded-lg border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                        Ação {idx + 1} • {mission.durationMinutes}m
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                    </div>

                    <h5 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors mt-1">
                      {mission.title}
                    </h5>

                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {mission.instruction}
                    </p>
                  </div>

                  <span className="text-[10px] text-slate-400 mt-2 font-medium">
                    Método: {mission.methodology}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Citação & Insight do Agente Sênior */}
          {diagnosis.seniorLinguisticQuote && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-indigo-900">
                  {diagnosis.seniorLinguisticQuote.concept}:
                </span>{' '}
                <span className="text-slate-700">
                  {diagnosis.seniorLinguisticQuote.explanation}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
