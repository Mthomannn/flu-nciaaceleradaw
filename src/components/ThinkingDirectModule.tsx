import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Sparkles,
  CheckCircle2,
  AlertOctagon,
  Volume2,
  ArrowRight,
  Zap,
  Layers,
  Clock,
  HelpCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { TargetLanguage, FluencyLevel, ModuleId } from '../types';
import { LevelCurriculum } from '../data/curriculum';
import { AudioSynthesizer } from '../services/audio';
import { GuidedStepBanner } from './GuidedStepBanner';
import {
  DirectThinkingTestQuestion,
} from '../data/fluencyPillarsData';
import {
  getThinkingStagesData,
  getNativeBlocksForLanguage,
  getDirectThinkingTestForLanguage,
} from '../data/languagePillarsData';

interface ThinkingDirectModuleProps {
  language: TargetLanguage;
  level: FluencyLevel;
  curriculum: LevelCurriculum;
  onAddXp: (amount: number) => void;
  onNavigate?: (module: ModuleId) => void;
}

interface ThinkingDirectSavedState {
  activeTab: 'fourStages' | 'thirtyBlocks' | 'quickTest20';
  activeStageNumber: 1 | 2 | 3 | 4;
  testQuestionIndex: number;
}

const loadSavedThinkingDirect = (lvl: string): Partial<ThinkingDirectSavedState> => {
  try {
    const raw = localStorage.getItem(`fluency_thinking_direct_${lvl}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
};

export const ThinkingDirectModule: React.FC<ThinkingDirectModuleProps> = ({
  language,
  level,
  onAddXp,
  onNavigate,
}) => {
  const savedThinking = useRef(loadSavedThinkingDirect(level)).current;

  const [activeTab, setActiveTab] = useState<'fourStages' | 'thirtyBlocks' | 'quickTest20'>(
    savedThinking.activeTab || 'fourStages'
  );
  const [activeStageNumber, setActiveStageNumber] = useState<1 | 2 | 3 | 4>(
    savedThinking.activeStageNumber || 1
  );

  // Estados do teste de perguntas rápidas
  const [testQuestionIndex, setTestQuestionIndex] = useState(
    savedThinking.testQuestionIndex || 0
  );
  const [testTimeLeft, setTestTimeLeft] = useState(5);
  const [isTestTimerRunning, setIsTestTimerRunning] = useState(false);
  const [showTestAnswer, setShowTestAnswer] = useState(false);

  const testTimerRef = useRef<any>(null);

  const thinkingData = getThinkingStagesData(language, level);
  const nativeBlocks = getNativeBlocksForLanguage(language, level);
  const directThinkingTest = getDirectThinkingTestForLanguage(language);

  const prevLevelRef = useRef(level);

  useEffect(() => {
    if (prevLevelRef.current !== level) {
      prevLevelRef.current = level;
      const loaded = loadSavedThinkingDirect(level);
      setTestQuestionIndex(loaded.testQuestionIndex || 0);
      if (loaded.activeTab) setActiveTab(loaded.activeTab);
      if (loaded.activeStageNumber) setActiveStageNumber(loaded.activeStageNumber);
      setTestTimeLeft(5);
      setIsTestTimerRunning(false);
      setShowTestAnswer(false);
    }
  }, [language, level]);

  // Persistir estado de pensar direto no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        `fluency_thinking_direct_${level}`,
        JSON.stringify({
          activeTab,
          activeStageNumber,
          testQuestionIndex,
        })
      );
    } catch {}
  }, [activeTab, activeStageNumber, testQuestionIndex, level]);

  const currentTestQ: DirectThinkingTestQuestion =
    directThinkingTest[testQuestionIndex] || directThinkingTest[0];

  useEffect(() => {
    if (isTestTimerRunning && testTimeLeft > 0) {
      testTimerRef.current = setTimeout(() => {
        setTestTimeLeft((p) => p - 1);
      }, 1000);
    } else if (testTimeLeft === 0 && isTestTimerRunning) {
      setIsTestTimerRunning(false);
      setShowTestAnswer(true);
    }
    return () => clearTimeout(testTimerRef.current);
  }, [isTestTimerRunning, testTimeLeft]);

  const handlePlayAudio = (text: string) => {
    AudioSynthesizer.getInstance().speak(text, language, 1.0);
  };

  const startTest5s = () => {
    setTestTimeLeft(5);
    setIsTestTimerRunning(true);
    setShowTestAnswer(false);
    handlePlayAudio(currentTestQ.question);
  };

  const nextTestQuestion = () => {
    if (testQuestionIndex < directThinkingTest.length - 1) {
      setTestQuestionIndex((p) => p + 1);
    } else {
      setTestQuestionIndex(0);
    }
    setTestTimeLeft(5);
    setIsTestTimerRunning(false);
    setShowTestAnswer(false);
    onAddXp(20);
  };

  return (
    <div className="space-y-6 max-w-7xl w-full mx-auto pb-12">
      <GuidedStepBanner currentModule="thinking" onNavigate={onNavigate} onAddXp={onAddXp} />

      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                  Pilar 7
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {language} • Nível {level}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Pensamento Direto & Desconexão da Tradução Mental
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Treine o cérebro para conectar conceitos diretamente aos sons do idioma, pulando o português.
              </p>
            </div>
          </div>

          {/* Abas */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('fourStages')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'fourStages'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Treino em 4 Etapas
            </button>
            <button
              onClick={() => setActiveTab('thirtyBlocks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'thirtyBlocks'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              30 Blocos Nativos vs Tradução
            </button>
            <button
              onClick={() => setActiveTab('quickTest20')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'quickTest20'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Teste de 20 Perguntas Rápidas
            </button>
          </div>
        </div>
      </div>

      {/* ABA 1: TREINO PROGRESSIVO EM 4 ETAPAS */}
      {activeTab === 'fourStages' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Seletor de Etapas 1, 2, 3 e 4 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-slate-100 pb-4">
            <button
              onClick={() => setActiveStageNumber(1)}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeStageNumber === 1
                  ? 'border-teal-600 bg-teal-50/50 shadow-2xs font-bold text-teal-900'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="text-[10px] uppercase text-slate-400">Etapa 1</div>
              <div className="text-xs font-extrabold">20 Objetos Visuais</div>
            </button>
            <button
              onClick={() => setActiveStageNumber(2)}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeStageNumber === 2
                  ? 'border-teal-600 bg-teal-50/50 shadow-2xs font-bold text-teal-900'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="text-[10px] uppercase text-slate-400">Etapa 2</div>
              <div className="text-xs font-extrabold">20 Ações Curtas</div>
            </button>
            <button
              onClick={() => setActiveStageNumber(3)}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeStageNumber === 3
                  ? 'border-teal-600 bg-teal-50/50 shadow-2xs font-bold text-teal-900'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="text-[10px] uppercase text-slate-400">Etapa 3</div>
              <div className="text-xs font-extrabold">20 Perguntas Simples</div>
            </button>
            <button
              onClick={() => setActiveStageNumber(4)}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeStageNumber === 4
                  ? 'border-teal-600 bg-teal-50/50 shadow-2xs font-bold text-teal-900'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="text-[10px] uppercase text-slate-400">Etapa 4</div>
              <div className="text-xs font-extrabold">Rotina 10 Minutos</div>
            </button>
          </div>

          {/* Conteúdo da Etapa 1 */}
          {activeStageNumber === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    Etapa 1: Rotulação Sensorial Direta
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    Nomear 20 Objetos do Ambiente sem Traduzir
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ao olhar para o objeto, acione a palavra em inglês imediatamente sem passar pela palavra em português.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {thinkingData.objects.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handlePlayAudio(item.word)}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-teal-50/40 hover:border-teal-300 text-left transition-all group"
                  >
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <span className="text-sm font-black text-slate-900 block mt-0.5 group-hover:text-teal-900">
                      {item.word}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {item.visualHint}
                    </span>
                    <span className="text-[10px] text-teal-600 font-semibold flex items-center gap-1 mt-2">
                      <Volume2 className="w-3 h-3" /> Ouvir som
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conteúdo da Etapa 2 */}
          {activeStageNumber === 2 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Etapa 2: Micropensamentos de Ação
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Descrever Ações Simples em Frases Curtas ({language})
                </h3>
                <p className="text-xs text-slate-500">
                  Ao realizar a ação física, narre mentalmente a frase em tempo real.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {thinkingData.actions.map((act) => (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between hover:border-teal-300 transition-colors"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Contexto: {act.context}
                      </span>
                      <span className="text-sm font-black text-slate-900 block mt-0.5">
                        "{act.mentalAction}"
                      </span>
                    </div>
                    <button
                      onClick={() => handlePlayAudio(act.mentalAction)}
                      className="text-slate-400 hover:text-teal-700 p-1.5"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conteúdo da Etapa 3 */}
          {activeStageNumber === 3 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Etapa 3: Respostas em Estruturas Simples
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Perguntas de Reflexo sem Tradução ({language})
                </h3>
                <p className="text-xs text-slate-500">
                  Foque na resposta curta e limpa usando o sujeito e verbo correspondente.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {thinkingData.questions.map((sq) => (
                  <div
                    key={sq.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-800">
                        "{sq.question}"
                      </span>
                      <button
                        onClick={() => handlePlayAudio(sq.question)}
                        className="text-slate-400 hover:text-teal-700"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-xs font-medium text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200">
                      Resposta direta: <span className="font-bold text-slate-900">{sq.targetReply}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conteúdo da Etapa 4 */}
          {activeStageNumber === 4 && (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Etapa 4: Narração Interna Contínua
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  {thinkingData.routine.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {thinkingData.routine.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {thinkingData.routine.blocks.map((block, bIdx) => (
                  <div
                    key={bIdx}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5"
                  >
                    <span className="text-xs font-black uppercase tracking-wider text-teal-900 bg-teal-100/60 px-2.5 py-1 rounded-md inline-block">
                      {block.period}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium italic">
                      {block.streamSample}
                    </p>
                    <button
                      onClick={() => handlePlayAudio(block.streamSample.replace(/"/g, ''))}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 pt-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Ouvir Narração Mental
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ABA 2: BLOCOS NATIVOS VS TRADUÇÃO LITERAL ERRADA */}
      {activeTab === 'thirtyBlocks' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Desarmando Vícios Mentais
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              Blocos de Expressões Nativas vs Tradução Literal Errada ({language})
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Veja lado a lado o erro típico de tradução e o bloco comunicativo nativo correto.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {nativeBlocks.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-300 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-400">
                    Bloco #{item.number} • {item.translationMeaning}
                  </span>
                  <button
                    onClick={() => handlePlayAudio(item.nativeChunk)}
                    className="text-slate-400 hover:text-teal-700"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Errado vs Nativo */}
                <div className="space-y-1">
                  <div className="text-xs text-rose-700 line-through font-semibold">
                    ❌ {item.literalBrazilianMistake}
                  </div>
                  <div className="text-sm font-black text-emerald-800">
                    ✅ "{item.nativeChunk}"
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 font-medium">
                  {item.whyBraziliansMistakeIt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 3: TESTE DE 20 PERGUNTAS RÁPIDAS DE PENSAMENTO DIRETO */}
      {activeTab === 'quickTest20' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Teste de Reflexo Instantâneo
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                Teste de Pensamento Direto: 20 Perguntas Rápidas
              </h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-lg text-slate-700">
              Pergunta {testQuestionIndex + 1} de {directThinkingTest.length}
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-teal-50/40 border border-teal-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-teal-800">
                Responda em Voz Alta em Menos de 5 Segundos
              </span>
              <span className="text-3xl font-black font-mono text-teal-950">
                {testTimeLeft}s
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              "{currentTestQ.question}"
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {currentTestQ.translation}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={startTest5s}
                className="px-5 py-2.5 rounded-xl bg-teal-700 text-white text-xs font-bold hover:bg-teal-600 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Play className="w-4 h-4 fill-white" />
                Iniciar Pergunta & Timer (5s)
              </button>

              <button
                onClick={() => setShowTestAnswer(true)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Ver Exemplo Direto
              </button>
            </div>

            {showTestAnswer && (
              <div className="p-4 bg-white rounded-xl border border-teal-200 space-y-1 animate-in fade-in">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Exemplo de Resposta Direta (Sem Traduzir):
                </span>
                <span className="text-sm font-black text-slate-900 block">
                  "{currentTestQ.expectedDirectResponse}"
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                if (testQuestionIndex > 0) setTestQuestionIndex((p) => p - 1);
                setTestTimeLeft(5);
                setIsTestTimerRunning(false);
                setShowTestAnswer(false);
              }}
              disabled={testQuestionIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            >
              Pergunta Anterior
            </button>

            <button
              onClick={nextTestQuestion}
              className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Próxima Pergunta Rápida
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
