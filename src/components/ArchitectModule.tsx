import React, { useState } from 'react';
import {
  Compass,
  Calendar,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Award,
  ChevronRight,
} from 'lucide-react';
import { TargetLanguage, FluencyLevel, MainObjective, ModuleId } from '../types';
import { FoundationRoadmapCard } from './FoundationRoadmapCard';

interface ArchitectModuleProps {
  language: TargetLanguage;
  level: FluencyLevel;
  onAddXp: (amount: number) => void;
  onNavigate?: (module: ModuleId) => void;
}

export const ArchitectModule: React.FC<ArchitectModuleProps> = ({
  language,
  level,
  onAddXp,
  onNavigate,
}) => {
  const [goal, setGoal] = useState<MainObjective>('Conversar');
  const [minutesPerDay, setMinutesPerDay] = useState(30);
  const [mainDifficulty, setMainDifficulty] = useState('Fala e fluidez imediata');
  const [isLoading, setIsLoading] = useState(false);
  const [planData, setPlanData] = useState<any>(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  const fetchCustomPlan = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          currentLevel: level,
          goal,
          minutesPerDay,
          mainDifficulty,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setPlanData(json.data);
        onAddXp(25);
      }
    } catch (err) {
      console.warn('Erro ao requisitar plano:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar plano automaticamente na primeira montagem ou ao mudar idioma/nível
  React.useEffect(() => {
    fetchCustomPlan();
  }, [language, level]);

  const defaultPhases = [
    {
      phase: 'Fase 1: Fundação & Sobrevivência Ativa (Dias 1 a 30)',
      goal: 'Expressar necessidades e manter 3 minutos de conversa sem travar.',
      vocabularyPriority: '300 blocos de alta frequência que cobrem 65% do diálogo real.',
      speakingDrill: 'Drills de 5 segundos para resposta rápida sem escrever antes.',
      listeningFocus: 'Decodificação de contrações e connected speech em frases curtas.',
      checkpoint: 'Dia 14: Teste de 50 expressões essenciais. Dia 30: Diálogo gravado de 3 minutos.',
    },
    {
      phase: 'Fase 2: Conexão & Redução de Bloqueio (Dias 31 a 60)',
      goal: 'Narrar fatos do passado, dar opiniões e contornar palavras desconhecidas.',
      vocabularyPriority: 'Conectivos, expressões de contraste e frases de clarificação.',
      speakingDrill: 'Drills de substituição automática de 15 estruturas chave.',
      listeningFocus: 'Shadowing diário de falantes nativos com velocidade natural.',
      checkpoint: 'Dia 45: Teste de 20 perguntas inesperadas em 5s. Dia 60: Conversa de 10 min.',
    },
    {
      phase: 'Fase 3: Autonomia & Pensamento Direto (Dias 61 a 90)',
      goal: 'Pensar diretamente no idioma sem tradução mental e lidar com imprevistos.',
      vocabularyPriority: 'Expressões idiomáticas, gírias leves e vocabulário situacional.',
      speakingDrill: 'Narração interna silenciosa e simulação de situações complexas.',
      listeningFocus: 'Vídeos e conversas rápidas sem legenda.',
      checkpoint: 'Dia 75: Sessão de debate. Dia 90: Avaliação final de fluência funcional.',
    },
  ];

  const phases = planData?.phases || defaultPhases;

  return (
    <div className="space-y-6 max-w-7xl w-full mx-auto pb-12">
      {/* Cabeçalho do Pilar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Pilar 1
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {language} • Nível {level}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Arquiteto da Fluência: Plano Prático 90 Dias
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Metodologia 80/20: focado no que você realmente usa no dia a dia. Sem conteúdos desnecessários.
              </p>
            </div>
          </div>

          <button
            id="refresh-plan-button"
            onClick={fetchCustomPlan}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs sm:text-sm font-bold transition-all shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Recalibrando...' : 'Personalizar Plano'}
          </button>
        </div>

        {/* Painel de Ajuste Rápido de Metas */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">
              Objetivo Central
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as MainObjective)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-indigo-600"
            >
              <option value="Conversar">Conversar com Segurança</option>
              <option value="Viagem">Viagens & Turismo Autônomo</option>
              <option value="Trabalho">Trabalho & Reuniões</option>
              <option value="Morar Fora">Morar no Exterior</option>
              <option value="Provas">Entrevistas & Provas</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">
              Tempo Diário Disponível
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[15, 30, 45].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setMinutesPerDay(mins)}
                  className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition-colors ${
                    minutesPerDay === mins
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">
              Maior Desafio Atual
            </label>
            <select
              value={mainDifficulty}
              onChange={(e) => setMainDifficulty(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-indigo-600"
            >
              <option value="Fala e fluidez imediata">Travar na hora de falar</option>
              <option value="Compreender fala rápida">Entender nativos falando rápido</option>
              <option value="Pronúncia e fonética">Pronúncia e vício fonético</option>
              <option value="Tradução mental">Traduzir tudo mentalmente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Diagnóstico Estratégico */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              Diagnóstico Estratégico do Ponto de Partida
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {planData?.diagnosis ||
                `Para o nível ${level} em ${language} com ${minutesPerDay} min/dia, seu caminho mais rápido é automatizar 50 blocos funcionais sem passar pela tradução gramatical, combinando 15 min de escuta com 15 min de resposta rápida.`}
            </p>
          </div>
        </div>
      </div>

      {/* Trilha Oficial de 100 Horas (Nível 0 ao A1 com Base Extremamente Sólida) */}
      <FoundationRoadmapCard
        language={language}
        level={level}
        onNavigate={onNavigate}
        onAddXp={onAddXp}
      />

      {/* O que Aprender Primeiro (Prioridade 80/20) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-emerald-600" />
          <h2 className="font-extrabold text-base sm:text-lg text-slate-900">
            O que Dominar nos Primeiros 7 Dias
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mb-4">
          Concentre 80% do seu esforço inicial nestes pontos essenciais para obter 80% dos resultados de conversação:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(planData?.highPriorityFirst || [
            'Os 15 verbos de máxima frequência conjugados no presente e passado básico.',
            'Conectivos de sobrevivência ("because", "so", "actually", "I mean") para evitar silêncio.',
            'Perguntas de clarificação para pedir ao nativo falar mais devagar ou repetir.',
            'Drills de resposta rápida (5 segundos) para quebrar o hábito da tradução mental.',
          ]).map((item: string, idx: number) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm font-medium text-slate-800 leading-snug">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* As 3 Fases do Plano de 90 Dias */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900">
              Plano de 90 Dias em 3 Fases
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Checkpoints a cada 14 dias
          </span>
        </div>

        {/* Seletor de Fases */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-5 gap-1">
          {phases.map((p: any, i: number) => (
            <button
              key={i}
              onClick={() => setActivePhaseIndex(i)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                activePhaseIndex === i
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fase {i + 1}
            </button>
          ))}
        </div>

        {/* Detalhes da Fase Ativa */}
        <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              {phases[activePhaseIndex].phase}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
              {phases[activePhaseIndex].goal}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Vocabulário Prioritário
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                {phases[activePhaseIndex].vocabularyPriority}
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Treino de Fala
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                {phases[activePhaseIndex].speakingDrill}
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Treino Auditivo
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                {phases[activePhaseIndex].listeningFocus}
              </p>
            </div>

            <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200 shadow-xs">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                Checkpoint de Progresso
              </span>
              <p className="text-xs sm:text-sm font-bold text-emerald-950">
                {phases[activePhaseIndex].checkpoint}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rotina Diária em Blocos de Tempo */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-indigo-600" />
          <h2 className="font-extrabold text-base sm:text-lg text-slate-900">
            Rotina Diária em Blocos de Tempo ({minutesPerDay} min/dia)
          </h2>
        </div>

        <div className="space-y-2.5">
          {(planData?.dailySchedule || [
            { timeBlock: 'Manhã (5-10 min)', action: 'Revisão espaçada de 10 blocos de alta frequência com escuta ativa.' },
            { timeBlock: 'Tarde / Deslocamento (10 min)', action: 'Shadowing de 3 frases naturais em velocidade real.' },
            { timeBlock: 'Noite (15 min)', action: 'Conversa com o parceiro IA e drills de resposta rápida de 5 segundos.' },
          ]).map((b: any, idx: number) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 gap-2"
            >
              <span className="text-xs font-extrabold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md w-fit">
                {b.timeBlock}
              </span>
              <span className="text-xs sm:text-sm font-medium text-slate-700 sm:text-right flex-1 sm:ml-4">
                {b.action}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* O que IGNORAR por enquanto (Princípio 80/20) */}
      <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
          <h2 className="font-extrabold text-base sm:text-lg">
            O Que Ignorar Por Enquanto (Economize 100+ Horas)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-amber-800 mb-3.5">
          Aprender rápido não é estudar muito conteúdo; é eliminar o desnecessário para falar imediatamente.
        </p>

        <ul className="space-y-2">
          {(planData?.whatToIgnore || [
            'Regras gramaticais isoladas sem aplicação prática imediata.',
            'Listas infinitas de vocabulário raro ou acadêmico.',
            'Obsessão por sotaque perfeito: priorize clareza e ritmo de comunicação.',
            'Tempos verbais complexos e pouco usados em conversas reais.',
          ]).map((item: string, idx: number) => (
            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-amber-950 font-medium">
              <span className="text-amber-600 font-bold">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
