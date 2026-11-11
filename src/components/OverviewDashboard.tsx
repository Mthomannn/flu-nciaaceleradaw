import React from 'react';
import {
  Compass,
  BookOpen,
  MessageSquare,
  Headphones,
  Timer,
  Mic,
  Brain,
  Radio,
  ArrowRight,
  ShieldCheck,
  Play,
  Volume2,
  Sparkles,
  Zap,
  Smartphone,
} from 'lucide-react';
import { TargetLanguage, FluencyLevel, ModuleId } from '../types';
import { LevelCurriculum } from '../data/curriculum';
import { AudioSynthesizer } from '../services/audio';
import { DailyGoal } from './DailyGoal';
import { SeniorLinguisticAgentCard } from './SeniorLinguisticAgentCard';
import { FoundationRoadmapCard } from './FoundationRoadmapCard';
import { GuidedLearningPathCard } from './GuidedLearningPathCard';
import { getSavedGuidedStep, getGuidedStepData } from '../services/guidedSequence';

interface OverviewDashboardProps {
  language: TargetLanguage;
  level: FluencyLevel;
  curriculum: LevelCurriculum;
  onNavigate: (module: ModuleId) => void;
  onAddXp: (amount: number) => void;
  onOpenVoiceCoach?: () => void;
  streakDays?: number;
  totalXp?: number;
  onOpenEvolution?: () => void;
  onOpenInstallModal?: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  language,
  level,
  curriculum,
  onNavigate,
  onAddXp,
  onOpenVoiceCoach,
  streakDays = 0,
  totalXp = 0,
  onOpenEvolution,
  onOpenInstallModal,
}) => {
  const [audioTested, setAudioTested] = React.useState(false);
  const [isPlayingTest, setIsPlayingTest] = React.useState(false);

  const pillars = [
    {
      id: 'architect' as ModuleId,
      number: '01',
      title: 'Arquiteto da Fluência',
      subtitle: 'Plano Estratégico 90 Dias',
      desc: 'Cronograma 80/20, diagnóstico inicial e metas claras sem sobrecarga.',
      icon: Compass,
      tag: 'Estratégia & Metas',
      actionText: 'Ver Plano 90D',
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
    {
      id: 'vocabulary' as ModuleId,
      number: '02',
      title: 'Vocabulário de Alta Frequência',
      subtitle: 'As 300 Palavras do Cotidiano',
      desc: 'Blocos funcionais com repetição espaçada e recall ativo sem traduzir.',
      icon: BookOpen,
      tag: '50 Expressões Chave',
      actionText: 'Praticar Flashcards',
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      id: 'conversation' as ModuleId,
      number: '03',
      title: 'Conversação Real',
      subtitle: 'Parceiro IA com Correções Chave',
      desc: 'Diálogos no seu nível (80% compreensão), simulação de papéis e áudio nativo.',
      icon: MessageSquare,
      tag: 'Correção Inteligente',
      actionText: 'Iniciar Diálogo',
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'listening' as ModuleId,
      number: '04',
      title: 'Treinador de Ouvido',
      subtitle: 'Listening Rápido & Shadowing',
      desc: 'Decodifique fala rápida, reduções ("gonna", "coulda") e fala conectada.',
      icon: Headphones,
      tag: 'Fala Conectada Nativa',
      actionText: 'Treinar Ouvido',
      iconBg: 'bg-purple-50 text-purple-600',
    },
    {
      id: 'drills' as ModuleId,
      number: '05',
      title: 'Resposta Rápida',
      subtitle: 'Destruidor de Bloqueio Oral',
      desc: 'Drills contra o relógio (5s), substituição ágil e reflexo automático.',
      icon: Timer,
      tag: 'Reflexo de 5 Segundos',
      actionText: 'Começar Drills',
      iconBg: 'bg-rose-50 text-rose-600',
    },
    {
      id: 'pronunciation' as ModuleId,
      number: '06',
      title: 'Pronúncia & Fonética',
      subtitle: 'Eliminador de Vícios Fonéticos',
      desc: 'Pares mínimos, posição anatômica de língua/boca e auditoria de fala.',
      icon: Mic,
      tag: 'Inteligibilidade Real',
      actionText: 'Testar Fonética',
      iconBg: 'bg-teal-50 text-teal-600',
    },
    {
      id: 'thinking' as ModuleId,
      number: '07',
      title: 'Pensar no Idioma',
      subtitle: 'Eliminador da Tradução Mental',
      desc: 'Treino progressivo em 4 etapas (Objetos, Ações, Pensamentos, Narração).',
      icon: Brain,
      tag: 'Tradução Zero',
      actionText: 'Treinar Narração',
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'immersion' as ModuleId,
      number: '08',
      title: 'Imersão 360°',
      subtitle: 'Viver no Idioma Sem Viajar',
      desc: 'Cronograma diário distribuído em micro-blocos ativos de input e output.',
      icon: Radio,
      tag: 'Rotina Ativa',
      actionText: 'Abrir Rastreador',
      iconBg: 'bg-cyan-50 text-cyan-600',
    },
  ];

  const handleTestAudio = () => {
    setIsPlayingTest(true);
    const synth = AudioSynthesizer.getInstance();
    const testPhrase = 'Welcome! This is the accelerated fluency system.';

    synth.speak(testPhrase, language, 1.0, () => {
      setIsPlayingTest(false);
      setAudioTested(true);
      onAddXp(10);
    });
  };

  const currentGuidedStep = getGuidedStepData(getSavedGuidedStep());

  return (
    <div className="space-y-4 sm:space-y-5 max-w-7xl mx-auto pb-10">
      {/* 1. Header Hub Compacto: Nível, Foco do Dia & Ações Rápidas */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-xl p-4 sm:p-5 border border-slate-800 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/25 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
                {language} • Nível {level}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Arquitetura Ativa
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
              {curriculum.levelTitle}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              {curriculum.expectedOutcome}
            </p>
          </div>

          {/* Ações de 1 Clique */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="cta-continue-training"
              onClick={() => onNavigate(currentGuidedStep.targetModule)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-300 transition-all active:scale-95 shadow-xs cursor-pointer"
              title={`Ir diretamente para a lição recomendada pelo sistema: Passo ${currentGuidedStep.stepNumber}`}
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Passo {currentGuidedStep.stepNumber}: {currentGuidedStep.shortTitle} ➔</span>
            </button>

            {onOpenVoiceCoach && (
              <button
                onClick={onOpenVoiceCoach}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-400/40 text-white text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5 text-amber-300" />
                Avaliador de Voz
              </button>
            )}

            <button
              id="test-audio-button"
              onClick={handleTestAudio}
              disabled={isPlayingTest}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlayingTest ? 'animate-bounce text-amber-400' : ''}`} />
              {isPlayingTest ? 'Testando...' : audioTested ? 'Áudio OK ✓' : 'Calibrar Som'}
            </button>

            {onOpenInstallModal && (
              <button
                id="cta-install-mobile"
                onClick={onOpenInstallModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer"
                title="Instalar no celular ou gerar executável APK"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Testar no Celular</span>
              </button>
            )}

            <a
              id="cta-download-project-script"
              href="/script_completo_projeto.txt"
              download="script_completo_projeto.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-100 text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer"
              title="Baixar arquivo TXT completo com todos os scripts e arquitetura do projeto"
            >
              <span>📄</span>
              <span>Baixar Script (.txt)</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Trilha Evolutiva Direcionada pelo Sistema (Passos 1 a 12 do Nível 0 ao A1 Sólido) */}
      <GuidedLearningPathCard
        onNavigate={onNavigate}
        onAddXp={onAddXp}
      />

      {/* 2.1 Agente Sênior de Linguística Aplicada & Motor Anti-Estagnação */}
      <SeniorLinguisticAgentCard
        language={language}
        level={level}
        streakDays={streakDays}
        totalXp={totalXp}
        onNavigate={onNavigate}
        onAddXp={onAddXp}
        onOpenEvolution={onOpenEvolution}
      />

      {/* 2.1 Trilha Oficial de 100 Horas de Aulas Ativas (Nível 0 ao A1 Sólido) */}
      <FoundationRoadmapCard
        language={language}
        level={level}
        onNavigate={onNavigate}
        onAddXp={onAddXp}
      />

      {/* 3. Grid Modular: Progresso Diário (7 cols) + Missão do Dia (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Painel de Meta Diária */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
          <DailyGoal
            language={language}
            level={level}
            onNavigate={onNavigate}
            onAddXp={onAddXp}
          />
        </div>

        {/* Missão do Dia (Micro-Ações com 1 Clique) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
          <section className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    <Zap className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-none">
                      Missão do Dia
                    </h2>
                    <span className="text-[11px] text-slate-500 font-medium">
                      3 passos práticos (~25 min)
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  +100 XP
                </span>
              </div>

              {/* Lista dos 3 Passos */}
              <div className="space-y-2 mt-3">
                {/* Passo 1: Ouvido */}
                <div
                  onClick={() => onNavigate('listening')}
                  className="p-2.5 rounded-lg border border-slate-150 hover:border-purple-300 hover:bg-purple-50/20 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                      1
                    </div>
                    <div>
                      <div className="font-semibold text-xs sm:text-sm text-slate-900 group-hover:text-purple-700 transition-colors">
                        Input de Ouvido
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Áudio com fala rápida & reduções
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </div>

                {/* Passo 2: Reflexo */}
                <div
                  onClick={() => onNavigate('drills')}
                  className="p-2.5 rounded-lg border border-slate-150 hover:border-rose-300 hover:bg-rose-50/20 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0">
                      2
                    </div>
                    <div>
                      <div className="font-semibold text-xs sm:text-sm text-slate-900 group-hover:text-rose-700 transition-colors">
                        Reflexo Oral (5s)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Responda direto sem traduzir
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </div>

                {/* Passo 3: Conversação */}
                <div
                  onClick={() => onNavigate('conversation')}
                  className="p-2.5 rounded-lg border border-slate-150 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                      3
                    </div>
                    <div>
                      <div className="font-semibold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                        Conversação Guiada
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Diálogo por voz com correção
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Sequência de estudo recomendada</span>
              <span className="font-semibold text-indigo-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Foco 80/20
              </span>
            </div>
          </section>
        </div>
      </div>

      {/* 3. Destaque Especial: Treinador & Avaliador de Pronúncia PT ➔ EN */}
      {onOpenVoiceCoach && (
        <section
          id="banner-voice-coach"
          className="bg-white rounded-xl border border-amber-300/80 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-amber-400"
        >
          <div className="flex items-start gap-3.5 max-w-3xl">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Mic className="w-5 h-5 text-amber-700" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-400 text-slate-950 uppercase tracking-wider">
                  Destaque
                </span>
                <span className="text-xs font-bold text-slate-900">
                  Treinador & Avaliador Crítico de Pronúncia
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fale ou digite em Português: o sistema traduz para o inglês nativo e natural, toca com IPA, grava sua repetição e aponta exatamente vícios de pronúncia, epêntese do "i" e ritmo.
              </p>
            </div>
          </div>

          <button
            id="btn-open-coach-overview"
            onClick={onOpenVoiceCoach}
            className="shrink-0 px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <span>Abrir Avaliador</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      )}

      {/* 4. Grid Modular dos 8 Módulos de Fluência (4 colunas) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Módulos de Fluência
            </h2>
            <p className="text-xs text-slate-500">
              Clique em qualquer módulo para acessar os treinos guiados imediatamente
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            8 Pilares Ativos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                id={`pillar-card-${p.id}`}
                onClick={() => onNavigate(p.id)}
                className="group relative bg-white rounded-xl border border-slate-200/80 p-4 hover:border-indigo-400 hover:shadow-md transition-all duration-150 cursor-pointer flex flex-col justify-between text-left"
              >
                <div className="space-y-2.5">
                  {/* Topo do Card: Número do Pilar + Tag */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      Pilar {p.number}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {p.tag}
                    </span>
                  </div>

                  {/* Ícone & Título */}
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${p.iconBg}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-indigo-600 transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                        {p.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Descrição enxuta */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {p.desc}
                  </p>
                </div>

                {/* Rodapé: Ação de 1 clique */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                  <span>{p.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-slate-400 group-hover:text-indigo-600" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

