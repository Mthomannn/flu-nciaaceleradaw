import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Clock,
  CheckSquare,
  Square,
  Smartphone,
  MessageCircle,
  Volume2,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Headphones,
  Globe,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { TargetLanguage, FluencyLevel, ImmersionBlock } from '../types';
import { LevelCurriculum, getImmersionScheduleFor } from '../data/curriculum';
import { AudioSynthesizer } from '../services/audio';
import { useAuth } from '../context/AuthContext';

interface ImmersionModuleProps {
  language: TargetLanguage;
  level: FluencyLevel;
  curriculum: LevelCurriculum;
  onAddXp: (amount: number) => void;
}

export const ImmersionModule: React.FC<ImmersionModuleProps> = ({
  language,
  level,
  curriculum,
  onAddXp,
}) => {
  const { studentProfile } = useAuth();
  const userId = studentProfile?.id || 'guest';

  const getImmersionKey = () => (userId ? `immersion_${userId}_${language}_${level}` : `immersion_guest_${language}_${level}`);
  const getEcoKey = () => (userId ? `eco_${userId}_${language}` : `eco_guest_${language}`);

  // Garantir que os blocos nunca sejam vazios
  const initialBlocks =
    curriculum.immersionSchedule && curriculum.immersionSchedule.length > 0
      ? curriculum.immersionSchedule
      : getImmersionScheduleFor(language, level);

  const [blocks, setBlocks] = useState<ImmersionBlock[]>(initialBlocks);
  const [completedBlocks, setCompletedBlocks] = useState<Record<string, boolean>>({});
  const [monologueDayIndex, setMonologueDayIndex] = useState(0);

  // Estados do Cronômetro Interativo de Monólogo
  const [monologueTimeLeft, setMonologueTimeLeft] = useState(60);
  const [monologueTargetSeconds, setMonologueTargetSeconds] = useState<60 | 180>(60);
  const [isMonologueRunning, setIsMonologueRunning] = useState(false);
  const [monologueFinished, setMonologueFinished] = useState(false);
  const timerRef = useRef<any>(null);

  // Checklist do Ecossistema Digital
  const [ecoChecks, setEcoChecks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const updatedBlocks =
      curriculum.immersionSchedule && curriculum.immersionSchedule.length > 0
        ? curriculum.immersionSchedule
        : getImmersionScheduleFor(language, level);

    setBlocks(updatedBlocks);

    try {
      const imKey = getImmersionKey();
      const saved = localStorage.getItem(imKey);
      if (saved) {
        setCompletedBlocks(JSON.parse(saved));
      } else if (userId && userId !== 'guest') {
        const isFresh = localStorage.getItem(`fluency_user_${userId}_is_fresh`);
        if (!isFresh) {
          const legacy = localStorage.getItem(`immersion_${language}_${level}`);
          if (legacy) {
            setCompletedBlocks(JSON.parse(legacy));
            localStorage.setItem(imKey, legacy);
          } else {
            setCompletedBlocks({});
          }
        } else {
          setCompletedBlocks({});
        }
      } else {
        setCompletedBlocks({});
      }

      const ecKey = getEcoKey();
      const savedEco = localStorage.getItem(ecKey);
      if (savedEco) {
        setEcoChecks(JSON.parse(savedEco));
      } else if (userId && userId !== 'guest') {
        const isFresh = localStorage.getItem(`fluency_user_${userId}_is_fresh`);
        if (!isFresh) {
          const legacyEco = localStorage.getItem(`eco_${language}`);
          if (legacyEco) {
            setEcoChecks(JSON.parse(legacyEco));
            localStorage.setItem(ecKey, legacyEco);
          } else {
            setEcoChecks({});
          }
        } else {
          setEcoChecks({});
        }
      } else {
        setEcoChecks({});
      }
    } catch (e) {
      // noop
    }

    // Resetar timer de monólogo
    setIsMonologueRunning(false);
    setMonologueFinished(false);
    setMonologueTimeLeft(monologueTargetSeconds);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [curriculum, language, level, monologueTargetSeconds, userId]);

  // Contagem regressiva do monólogo
  useEffect(() => {
    if (isMonologueRunning && monologueTimeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setMonologueTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (monologueTimeLeft === 0 && isMonologueRunning) {
      setIsMonologueRunning(false);
      setMonologueFinished(true);
      onAddXp(35);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isMonologueRunning, monologueTimeLeft, onAddXp]);

  const toggleTask = (blockId: string) => {
    const next = { ...completedBlocks, [blockId]: !completedBlocks[blockId] };
    setCompletedBlocks(next);
    try {
      localStorage.setItem(getImmersionKey(), JSON.stringify(next));
    } catch (e) {
      // noop
    }
    if (!completedBlocks[blockId]) {
      onAddXp(25);
    }
  };

  const markAllBlocks = () => {
    const allDone: Record<string, boolean> = {};
    blocks.forEach((b) => {
      allDone[b.id] = true;
    });
    setCompletedBlocks(allDone);
    try {
      localStorage.setItem(getImmersionKey(), JSON.stringify(allDone));
    } catch (e) {
      // noop
    }
    onAddXp(50);
  };

  const resetAllBlocks = () => {
    setCompletedBlocks({});
    try {
      localStorage.removeItem(getImmersionKey());
    } catch (e) {
      // noop
    }
  };

  const toggleEcoTask = (id: string) => {
    const next = { ...ecoChecks, [id]: !ecoChecks[id] };
    setEcoChecks(next);
    try {
      localStorage.setItem(getEcoKey(), JSON.stringify(next));
    } catch (e) {
      // noop
    }
    if (!ecoChecks[id]) {
      onAddXp(15);
    }
  };

  const monologues = [
    {
      theme: 'Minha rotina ideal matinal',
      guidingQuestions: 'O que eu faria se acordasse às 6h? Qual café da manhã comeria? O que faria primeiro?',
      spokenSample:
        "If I could design my ideal morning, I would wake up at 6:30 AM, drink a large glass of water, and brew some fresh coffee. Then I'd do twenty minutes of light stretching before checking any work notifications. It gives me calm and clarity for the whole day.",
    },
    {
      theme: 'Uma viagem inesquecível que fiz',
      guidingQuestions: 'Para onde fui? Com quem viajei? O que comi de diferente? Qual foi a melhor lembrança?',
      spokenSample:
        'One of the most memorable trips I have ever taken was visiting the coast with my closest friends. We spent our afternoons by the ocean, explored local markets, and had delicious seafood every evening.',
    },
    {
      theme: 'Um problema ou desafio superado',
      guidingQuestions: 'Qual era a situação? Quem estava envolvido? Qual foi o resultado final e o aprendizado?',
      spokenSample:
        'Recently, I had to deal with a tight project deadline. At first it felt overwhelming, but I broke down the problem into three simple steps and communicated clearly with everyone involved. In the end, we delivered on time.',
    },
    {
      theme: 'Minha opinião sobre tecnologia e foco hoje',
      guidingQuestions: 'Celulares ajudam ou atrapalham? Quanto tempo passo em telas? O que mudaria na minha rotina?',
      spokenSample:
        'In my perspective, smartphones are powerful tools, but they can easily steal our focus if we are not intentional. I try to leave my phone in another room while working so I can enter deep work.',
    },
    {
      theme: 'Meus planos para os próximos 6 meses',
      guidingQuestions: 'Onde quero viajar? Que conquistas pessoais busco? Quais hábitos diários manterei?',
      spokenSample:
        'Over the next six months, my primary goal is achieving natural conversational fluency in English and being able to speak without mental translation. I will dedicate at least thirty minutes every single day to active listening and speaking.',
    },
  ];

  const currentMonologue = monologues[monologueDayIndex] || monologues[0];
  const completedCount = Object.values(completedBlocks).filter(Boolean).length;

  const handlePlayAudio = (text: string) => {
    AudioSynthesizer.getInstance().speak(text, language, 1.0);
  };

  const startMonologuePractice = () => {
    setMonologueTimeLeft(monologueTargetSeconds);
    setIsMonologueRunning(true);
    setMonologueFinished(false);
  };

  // Mídias recomendadas por nível
  const recommendedMedia = [
    {
      title: 'BBC 6 Minute English',
      type: 'Podcast / Áudio',
      levelTag: 'A1 - B1',
      description: 'Episódios curtos de 6 minutos com duas pessoas nativas debatendo um tema com vocabulário explicado.',
      tip: 'Ouça uma vez sem texto e depois repita acompanhando a transcrição.',
    },
    {
      title: 'Spotlight English',
      type: 'Podcast / Dicção Pausada',
      levelTag: 'Zero - A2',
      description: 'Histórias globais lidas com velocidade calibrada e clareza perfeita para destravar a escuta.',
      tip: 'Ideal para quem sente que os nativos falam rápido demais.',
    },
    {
      title: "Luke's English Podcast",
      type: 'Podcast Autêntico',
      levelTag: 'B1 - C1',
      description: 'Episódios naturais, humor britânico e conversas espontâneas com professores e nativos.',
      tip: 'Pratique Shadowing das piadas e das expressões coloquiais.',
    },
    {
      title: 'The Daily (The New York Times)',
      type: 'Jornalismo Executivo',
      levelTag: 'B2 - C1',
      description: 'Jornalismo narrativo de ponta com cadência e vocabulário avançado para o ambiente corporativo.',
      tip: 'Excelente para extrair conectivos sofisticados e argumentação.',
    },
    {
      title: 'Radio Garden (Rádios do Mundo)',
      type: 'Transmissão Ao Vivo',
      levelTag: 'Todos os Níveis',
      description: 'Explore um globo 3D e sintonize rádios locais em Londres, Nova York, Dublin ou Sydney ao vivo.',
      tip: 'Deixe tocando como trilha de fundo enquanto faz tarefas em casa.',
    },
  ];

  const ecoSystemItems = [
    {
      id: 'sys_lang',
      title: 'Idioma do Sistema Operacional',
      desc: `Mudar celular e computador para ${language} (ganho imediato de 50+ termos diários).`,
    },
    {
      id: 'sub_lang',
      title: 'Regra das Legendas 100% no Idioma',
      desc: `Desativar legendas em português na Netflix/YouTube. Sempre usar áudio e legenda em ${language}.`,
    },
    {
      id: 'google_search',
      title: 'Buscas no Google no Idioma Alvo',
      desc: `Pesquisar tutoriais, receitas e dúvidas técnicas diretamente em ${language}.`,
    },
    {
      id: 'voice_assistant',
      title: 'Assistente de Voz Configurada',
      desc: `Configurar Siri ou Google Assistente para falar e responder em ${language}.`,
    },
    {
      id: 'homescreen_audio',
      title: 'Podcast ou Rádio na Tela Inicial',
      desc: 'Colocar o ícone de um podcast nativo ou rádio ao vivo na tela principal do celular.',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl w-full mx-auto pb-12">
      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center shrink-0">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded">
                  Pilar 8
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                  {language} • Nível {level}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Imersão 360° no Cotidiano Sem Sair de Casa
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Substitua o estudo passivo por micro-blocos ativos de input e output distribuídos no seu dia real.
              </p>
            </div>
          </div>

          {/* Medidor de Conclusão Diária */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-cyan-50 border border-cyan-200 text-center">
              <span className="text-xs text-cyan-700 font-bold block">
                Blocos Concluídos
              </span>
              <span className="text-xl font-black text-cyan-950">
                {completedCount} de {blocks.length}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <button
                onClick={markAllBlocks}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors shadow-2xs"
              >
                Concluir Todos (+50 XP)
              </button>
              {completedCount > 0 && (
                <button
                  onClick={resetAllBlocks}
                  className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700 font-medium"
                >
                  Resetar Dia
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grade de Blocos de 24 Horas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Cronograma de 24 Horas de Imersão ({level})
            </h2>
            <p className="text-xs text-slate-500">
              Rotina prática adaptada ao seu nível atual com input auditivo e reflexos orais
            </p>
          </div>
          <span className="text-xs font-medium text-slate-400 hidden sm:inline">
            Clique no card ou na caixa para marcar
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {blocks.map((block) => {
            const isDone = !!completedBlocks[block.id];
            return (
              <div
                key={block.id}
                onClick={() => toggleTask(block.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  isDone
                    ? 'bg-cyan-50/50 border-cyan-300 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-700" />
                    <span className="text-xs font-black text-slate-900 uppercase tracking-tight">
                      {block.periodName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {block.timeSlot}
                    </span>
                    {isDone ? (
                      <CheckSquare className="w-5 h-5 text-cyan-600" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                    <div className="flex items-center gap-1.5 text-cyan-900 text-[11px] font-black uppercase tracking-wider mb-1">
                      <Headphones className="w-3.5 h-3.5 text-cyan-700" />
                      <span>Input Auditivo / Leitura:</span>
                    </div>
                    <span className="text-slate-800 font-medium leading-relaxed block">
                      {block.inputTask}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                    <div className="flex items-center gap-1.5 text-indigo-900 text-[11px] font-black uppercase tracking-wider mb-1">
                      <Zap className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Output Ativo:</span>
                    </div>
                    <span className="text-slate-800 font-medium leading-relaxed block">
                      {block.outputTask}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-cyan-100/60 text-cyan-950 text-xs font-semibold flex items-center justify-between">
                    <span>
                      ⚡ <strong>Micro-tarefa ({block.durationMinutes} min):</strong> {block.microVocabTask}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayAudio(block.microVocabTask);
                      }}
                      title="Ouvir áudio"
                      className="p-1 rounded hover:bg-cyan-200 text-cyan-800 shrink-0 ml-2"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Técnica do Monólogo Solitário com Cronômetro e Áudio Modelo */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-base sm:text-lg text-slate-900">
                Técnica do Monólogo Diário (Falar Sozinho)
              </h2>
              <p className="text-xs text-slate-500">
                Falar sozinho sem plateia destrava o aparelho fonador e elimina o medo de julgamento.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMonologueDayIndex((p) => (p + 1) % monologues.length);
                setIsMonologueRunning(false);
                setMonologueFinished(false);
                setMonologueTimeLeft(monologueTargetSeconds);
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Trocar Tema ({monologueDayIndex + 1}/{monologues.length})</span>
            </button>
          </div>
        </div>

        {/* Card do Tema Atual */}
        <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-indigo-700 uppercase tracking-wider">
              Tema do Dia:
            </span>
            <span className="text-xs font-semibold text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded">
              Objetivo: 1 a 3 minutos contínuos
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-slate-900">
            "{currentMonologue.theme}"
          </h3>

          <div className="p-3 bg-white/80 rounded-xl border border-indigo-100 text-xs sm:text-sm text-slate-700 space-y-1">
            <strong className="text-indigo-900 block text-xs">
              Roteiro de Pensamento em Voz Alta:
            </strong>
            <p className="italic text-slate-600 leading-relaxed">
              {currentMonologue.guidingQuestions}
            </p>
          </div>

          {/* Exemplo Falado com Áudio */}
          <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900">
                Modelo de Início Natural (Como um nativo começaria):
              </span>
              <button
                onClick={() => handlePlayAudio(currentMonologue.spokenSample)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-2xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Ouvir Áudio Modelo</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200/50">
              "{currentMonologue.spokenSample}"
            </p>
          </div>

          {/* Cronômetro Interativo */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-indigo-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                <span>Duração:</span>
                <button
                  onClick={() => {
                    setMonologueTargetSeconds(60);
                    setMonologueTimeLeft(60);
                    setIsMonologueRunning(false);
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-bold ${
                    monologueTargetSeconds === 60
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  60s
                </button>
                <button
                  onClick={() => {
                    setMonologueTargetSeconds(180);
                    setMonologueTimeLeft(180);
                    setIsMonologueRunning(false);
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-bold ${
                    monologueTargetSeconds === 180
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  3 min
                </button>
              </div>

              <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-indigo-200">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span className="font-mono font-black text-slate-900 text-base">
                  {Math.floor(monologueTimeLeft / 60)}:
                  {(monologueTimeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isMonologueRunning ? (
                <button
                  onClick={startMonologuePractice}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-xs transition-all"
                >
                  <Play className="w-4 h-4" />
                  <span>{monologueFinished ? 'Praticar Novamente' : 'Iniciar Prática de Fala'}</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsMonologueRunning(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900"
                >
                  Pausar
                </button>
              )}
            </div>
          </div>

          {/* Dica ao vivo durante o monólogo */}
          {isMonologueRunning && (
            <div className="p-3 bg-amber-50 border border-amber-300/80 rounded-xl text-xs text-amber-900 font-semibold animate-pulse flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {monologueTimeLeft > monologueTargetSeconds * 0.6
                  ? 'Fase 1: Apresente o tema e o contexto inicial sem se preocupar em errar.'
                  : monologueTimeLeft > monologueTargetSeconds * 0.2
                  ? 'Fase 2: Conecte detalhes, razões ou acontecimentos usando "because", "after that", "for example".'
                  : 'Fase 3: Conclua com sua visão ou aprendizado geral ("In the end...", "That\'s why...").'}
              </span>
            </div>
          )}

          {monologueFinished && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Excelente treino! Você concluiu seu monólogo contínuo sem interrupções. (+35 XP concedidos!)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Configuração Interativa do Ecossistema Digital */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Smartphone className="w-5 h-5" />
            <span>Checklist do Seu Ecossistema Digital (Configuração Sem Esforço)</span>
          </div>
          <span className="text-xs text-slate-400">
            Marque o que você já ativou (+15 XP cada)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          {ecoSystemItems.map((item) => {
            const isChecked = !!ecoChecks[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleEcoTask(item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isChecked
                    ? 'bg-amber-400/10 border-amber-400/40 text-slate-100'
                    : 'bg-white/5 border-white/10 hover:border-white/20 text-slate-300'
                }`}
              >
                <div className="mt-0.5">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <div>
                  <strong className="text-white block font-bold mb-0.5">
                    {item.title}
                  </strong>
                  <span className="text-xs text-slate-400 leading-relaxed block">
                    {item.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hub de Mídias e Recursos Gratuitos por Nível */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-base sm:text-lg text-slate-900">
              Fontes de Imersão Autêntica Recomendadas ({language})
            </h2>
            <p className="text-xs text-slate-500">
              Canais, podcasts e estações de rádio ao redor do planeta para manter contato sonoro diário
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {recommendedMedia.map((media, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-cyan-300 transition-all space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-800 bg-cyan-100/70 px-2 py-0.5 rounded">
                    {media.type}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded">
                    {media.levelTag}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  {media.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {media.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 text-[11px] text-cyan-900 font-medium">
                💡 <span className="italic">{media.tip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
