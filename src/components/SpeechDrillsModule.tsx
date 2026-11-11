import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Play,
  RotateCcw,
  Zap,
  Mic,
  MicOff,
  Volume2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
  HelpCircle,
} from 'lucide-react';
import { TargetLanguage, FluencyLevel, ModuleId } from '../types';
import { LevelCurriculum } from '../data/curriculum';
import { AudioSynthesizer, VoiceRecorder, transcribeAudioWithServer } from '../services/audio';
import {
  FastDrillItem,
} from '../data/fluencyPillarsData';
import {
  getFastDrillsForLanguage,
  getSubstitutionStructuresForLanguage,
  getUnexpectedTestForLanguage,
} from '../data/languagePillarsData';
import { LessonActionBar } from './common/LessonActionBar';
import { GuidedStepBanner } from './GuidedStepBanner';
import {
  markLessonDone,
  isLessonCompleted,
  isLessonMastered,
} from '../services/lessonProgress';

interface SpeechDrillsModuleProps {
  language: TargetLanguage;
  level: FluencyLevel;
  curriculum: LevelCurriculum;
  onAddXp: (amount: number) => void;
  onNavigate?: (module: ModuleId) => void;
}

interface SpeechDrillsSavedState {
  activeTab: 'levelDrills' | 'rapid40' | 'substitution15' | 'unexpectedTest';
  activeRound: 1 | 2;
  levelDrillIndex: number;
  drillIndex: number;
  selectedStructureIndex: number;
  selectedVariationIndex: number;
  testQuestionIndex: number;
}

const loadSavedSpeechDrills = (lvl: string): Partial<SpeechDrillsSavedState> => {
  try {
    const raw = localStorage.getItem(`fluency_speech_drills_${lvl}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
};

export const SpeechDrillsModule: React.FC<SpeechDrillsModuleProps> = ({
  language,
  level,
  curriculum,
  onAddXp,
  onNavigate,
}) => {
  const savedDrills = useRef(loadSavedSpeechDrills(level)).current;

  const [activeTab, setActiveTab] = useState<'levelDrills' | 'rapid40' | 'substitution15' | 'unexpectedTest'>(
    savedDrills.activeTab || 'levelDrills'
  );
  const [activeRound, setActiveRound] = useState<1 | 2>(savedDrills.activeRound || 1);
  const [levelDrillIndex, setLevelDrillIndex] = useState(savedDrills.levelDrillIndex || 0);
  const [drillIndex, setDrillIndex] = useState(savedDrills.drillIndex || 0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [drillAnswered, setDrillAnswered] = useState(false);

  // Estados das estruturas de substituição
  const [selectedStructureIndex, setSelectedStructureIndex] = useState(savedDrills.selectedStructureIndex || 0);
  const [selectedVariationIndex, setSelectedVariationIndex] = useState(savedDrills.selectedVariationIndex || 0);

  // Estados do teste de perguntas inesperadas
  const [testQuestionIndex, setTestQuestionIndex] = useState(savedDrills.testQuestionIndex || 0);
  const [testTimer, setTestTimer] = useState(5);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [isRecordingTest, setIsRecordingTest] = useState(false);
  const [testRecordedUrl, setTestRecordedUrl] = useState<string | null>(null);
  const [spokenDetectedAnswer, setSpokenDetectedAnswer] = useState<string>('');
  const [testCompletedAnswers, setTestCompletedAnswers] = useState<Record<number, boolean>>({});

  const voiceRecorderRef = useRef<VoiceRecorder>(new VoiceRecorder());
  const prevLevelRef = useRef(level);

  // Persistir posição dos exercícios para não perder ao navegar
  useEffect(() => {
    try {
      localStorage.setItem(
        `fluency_speech_drills_${level}`,
        JSON.stringify({
          activeTab,
          activeRound,
          levelDrillIndex,
          drillIndex,
          selectedStructureIndex,
          selectedVariationIndex,
          testQuestionIndex,
        })
      );
    } catch {}
  }, [
    activeTab,
    activeRound,
    levelDrillIndex,
    drillIndex,
    selectedStructureIndex,
    selectedVariationIndex,
    testQuestionIndex,
    level,
  ]);

  // Se o aluno trocar de nível, carregar o progresso do novo nível
  useEffect(() => {
    if (prevLevelRef.current !== level) {
      prevLevelRef.current = level;
      const loaded = loadSavedSpeechDrills(level);
      setLevelDrillIndex(loaded.levelDrillIndex || 0);
      setDrillIndex(loaded.drillIndex || 0);
      setActiveRound(loaded.activeRound || 1);
      setSelectedStructureIndex(loaded.selectedStructureIndex || 0);
      setSelectedVariationIndex(loaded.selectedVariationIndex || 0);
      setTestQuestionIndex(loaded.testQuestionIndex || 0);
      if (loaded.activeTab) setActiveTab(loaded.activeTab);
      setTimeLeft(5);
      setIsTimerRunning(false);
      setDrillAnswered(false);
      setTestRecordedUrl(null);
      setSpokenDetectedAnswer('');
    }
  }, [level]);

  const timerRef = useRef<any>(null);

  const fastDrills = getFastDrillsForLanguage(language, level);
  const currentDrillList = activeRound === 1 ? fastDrills.round1 : fastDrills.round2;
  const currentDrill: FastDrillItem = currentDrillList[drillIndex] || currentDrillList[0];

  const substitutionStructures = getSubstitutionStructuresForLanguage(language, level);
  const currentStructure = substitutionStructures[selectedStructureIndex] || substitutionStructures[0];
  const currentVariation = currentStructure.variations[selectedVariationIndex] || currentStructure.variations[0];

  const unexpectedQuestions = getUnexpectedTestForLanguage(language);
  const currentTestQ = unexpectedQuestions[testQuestionIndex] || unexpectedQuestions[0];

  // Timer para o drill rápido
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setDrillAnswered(true);
    }
    return () => clearTimeout(timerRef.current);
  }, [isTimerRunning, timeLeft]);

  // Timer para o teste inesperado
  useEffect(() => {
    if (isTestRunning && testTimer > 0) {
      const t = setTimeout(() => setTestTimer((p) => p - 1), 1000);
      return () => clearTimeout(t);
    } else if (testTimer === 0 && isTestRunning) {
      setIsTestRunning(false);
    }
  }, [isTestRunning, testTimer]);

  const start5sDrill = () => {
    setTimeLeft(5);
    setIsTimerRunning(true);
    setDrillAnswered(false);
    AudioSynthesizer.getInstance().speak(currentDrill.promptQuestion, language, 1.05);
  };

  const startLevelDrill = () => {
    setTimeLeft(5);
    setIsTimerRunning(true);
    setDrillAnswered(false);
    if (curriculum.fastDrills[levelDrillIndex]) {
      AudioSynthesizer.getInstance().speak(
        curriculum.fastDrills[levelDrillIndex].promptQuestion,
        language,
        1.05
      );
    }
  };

  const nextDrill = () => {
    if (drillIndex < currentDrillList.length - 1) {
      setDrillIndex((p) => p + 1);
    } else {
      setDrillIndex(0);
    }
    setTimeLeft(5);
    setIsTimerRunning(false);
    setDrillAnswered(false);
    onAddXp(20);
  };

  const startUnexpectedTest = () => {
    setTestTimer(5);
    setIsTestRunning(true);
    setTestRecordedUrl(null);
    AudioSynthesizer.getInstance().speak(currentTestQ.question, language, 1.0);
  };

  const handleToggleTestRecord = async () => {
    if (!isRecordingTest) {
      setSpokenDetectedAnswer('');
      setTestRecordedUrl(null);
      const ok = await voiceRecorderRef.current.startRecording();
      if (ok) setIsRecordingTest(true);
    } else {
      setIsRecordingTest(false);
      try {
        const { audioBlob, audioUrl } = await voiceRecorderRef.current.stopRecording();
        setTestRecordedUrl(audioUrl);
        setTestCompletedAnswers((prev) => ({ ...prev, [testQuestionIndex]: true }));
        try {
          const spoken = await transcribeAudioWithServer(
            audioBlob,
            language,
            currentTestQ.sampleNaturalAnswer || currentTestQ.idealResponseStructure
          );
          if (spoken) {
            setSpokenDetectedAnswer(spoken);
          }
        } catch (e) {
          console.warn('Transcrição no teste:', e);
        }
        onAddXp(35);
      } catch {
        setIsRecordingTest(false);
      }
    }
  };

  const handlePlayAudio = (text: string) => {
    AudioSynthesizer.getInstance().speak(text, language, 1.0);
  };

  return (
    <div className="space-y-6 max-w-7xl w-full mx-auto pb-12">
      <GuidedStepBanner currentModule="drills" onNavigate={onNavigate} onAddXp={onAddXp} />

      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
                  Pilar 5
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {language} • Nível {level}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Destruidor de Bloqueio Oral & Drills de 5 Segundos
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Elimine o delay de tradução mental automatizando reflexos imediatos de fala.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('levelDrills')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'levelDrills'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Drills do Nível {level} ({curriculum.fastDrills.length})
            </button>
            <button
              onClick={() => setActiveTab('rapid40')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'rapid40'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              40 Estímulos Rápidos (5s)
            </button>
            <button
              onClick={() => setActiveTab('substitution15')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'substitution15'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              15 Estruturas & Drills
            </button>
            <button
              onClick={() => setActiveTab('unexpectedTest')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'unexpectedTest'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Teste de 10 Inesperadas
            </button>
          </div>
        </div>
      </div>

      {/* ABA 0: DRILLS ESPECÍFICOS DO NÍVEL ATUAL */}
      {activeTab === 'levelDrills' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Drill Específico:
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
                {curriculum.levelBadge}
              </span>
            </div>

            {/* Régua minimalista de exercícios concluídos vs pendentes */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {curriculum.fastDrills.map((d, idx) => {
                const done = isLessonCompleted(language, level, d.id);
                const mastered = isLessonMastered(language, level, d.id);
                const isSelected = idx === levelDrillIndex;

                let pillClass = 'bg-slate-100 text-slate-600 border-slate-200';
                if (isSelected) {
                  pillClass = 'ring-2 ring-indigo-500 ring-offset-1 font-bold';
                }
                if (mastered) {
                  pillClass += ' bg-amber-100 text-amber-900 border-amber-300';
                } else if (done) {
                  pillClass += ' bg-emerald-100 text-emerald-900 border-emerald-300';
                }

                return (
                  <button
                    key={d.id}
                    id={`drill-step-btn-${idx}`}
                    type="button"
                    onClick={() => {
                      setLevelDrillIndex(idx);
                      setTimeLeft(5);
                      setIsTimerRunning(false);
                      setDrillAnswered(false);
                    }}
                    className={`px-2 py-0.5 rounded-md text-[11px] border font-medium transition-all flex items-center gap-1 cursor-pointer ${pillClass}`}
                    title={`Drill ${idx + 1}: ${mastered ? 'Já dominado' : done ? 'Já realizado' : 'Pendente'}`}
                  >
                    <span>{idx + 1}</span>
                    {mastered ? (
                      <span className="text-amber-700 text-[10px]">★</span>
                    ) : done ? (
                      <span className="text-emerald-700 text-[10px]">✓</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {curriculum.fastDrills[levelDrillIndex] ? (
            <>
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 text-center space-y-3 max-w-2xl mx-auto shadow-2xs">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-100/60 px-2.5 py-0.5 rounded-full">
                    Reflexo Imediato de 5 Segundos (Sem Tradução Mental)
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 leading-snug">
                    "{curriculum.fastDrills[levelDrillIndex].promptQuestion}"
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                    {curriculum.fastDrills[levelDrillIndex].promptTranslation}
                  </p>
                </div>

                {/* Temporizador + Ações integradas em uma linha (Tudo no Campo de Visão) */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-1">
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 flex flex-col items-center justify-center transition-all shrink-0 ${
                      isTimerRunning
                        ? 'border-rose-500 bg-rose-50/50 scale-105 animate-pulse'
                        : timeLeft === 0
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 bg-white shadow-2xs'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
                      {timeLeft}s
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">
                      {isTimerRunning ? 'Fale!' : timeLeft === 0 ? 'Fim' : 'Pronto?'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 w-full sm:w-auto">
                    <button
                      onClick={startLevelDrill}
                      disabled={isTimerRunning}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs sm:text-sm hover:bg-rose-700 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
                    >
                      <Zap className="w-4 h-4" />
                      {isTimerRunning ? 'Gravando Reflexo...' : 'Iniciar Desafio 5s'}
                    </button>

                    <button
                      onClick={() => {
                        handlePlayAudio(curriculum.fastDrills[levelDrillIndex].promptQuestion);
                        markLessonDone(
                          language,
                          level,
                          curriculum.fastDrills[levelDrillIndex].id,
                          curriculum.fastDrills[levelDrillIndex].promptQuestion,
                          'drills',
                          { preserveMastered: true }
                        );
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold bg-white transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                      Ouvir Pergunta Nativa
                    </button>
                  </div>
                </div>

                {/* Modelo de Resposta Natural */}
                <div className="bg-white border border-slate-200 rounded-xl p-3 text-left text-xs">
                  <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-0.5">
                    Estrutura Recomendada:
                  </div>
                  <div className="font-bold text-slate-900">
                    {curriculum.fastDrills[levelDrillIndex].suggestedPattern}
                  </div>
                  <div className="mt-1 text-slate-600">
                    <span className="font-semibold text-slate-700">Exemplo Natural:</span>{' '}
                    <span className="italic">"{curriculum.fastDrills[levelDrillIndex].sampleNaturalAnswer}"</span>
                  </div>
                </div>
              </div>

              {/* Barra de Ação da Lição: Já aprendida, Refazer, Repetição Espaçada e Sugestões */}
              <div className="max-w-xl mx-auto w-full">
                <LessonActionBar
                  lessonId={curriculum.fastDrills[levelDrillIndex].id}
                  lessonTitle={curriculum.fastDrills[levelDrillIndex].promptQuestion}
                  module="drills"
                  language={language}
                  level={level}
                  onRefazer={() => {
                    setTimeLeft(5);
                    setIsTimerRunning(false);
                    setDrillAnswered(false);
                    startLevelDrill();
                  }}
                  onNavigateToModule={onNavigate}
                  onAddXp={onAddXp}
                />
              </div>

              {/* Navegação entre drills do nível */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 max-w-xl mx-auto w-full">
                <button
                  onClick={() => {
                    setLevelDrillIndex((prev) => Math.max(0, prev - 1));
                    setTimeLeft(5);
                    setIsTimerRunning(false);
                    setDrillAnswered(false);
                  }}
                  disabled={levelDrillIndex === 0}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-30 hover:bg-slate-50 cursor-pointer"
                >
                  Drill Anterior
                </button>

                <button
                  onClick={() => {
                    const currentDrill = curriculum.fastDrills[levelDrillIndex];
                    if (currentDrill) {
                      markLessonDone(
                        language,
                        level,
                        currentDrill.id,
                        currentDrill.promptQuestion,
                        'drills',
                        { preserveMastered: true }
                      );
                    }
                    if (levelDrillIndex < curriculum.fastDrills.length - 1) {
                      setLevelDrillIndex((prev) => prev + 1);
                      setTimeLeft(5);
                      setIsTimerRunning(false);
                      setDrillAnswered(false);
                      onAddXp(15);
                    } else {
                      onAddXp(30);
                    }
                  }}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{levelDrillIndex < curriculum.fastDrills.length - 1 ? 'Próximo Drill' : 'Concluir Drills'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-6 text-slate-500 text-sm">
              Carregando exercícios para o nível {level}...
            </div>
          )}
        </div>
      )}

      {/* ABA 1: 40 ESTÍMULOS RÁPIDOS */}
      {activeTab === 'rapid40' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Seletor de Rodada */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Selecione a Rodada:
              </span>
              <button
                onClick={() => {
                  setActiveRound(1);
                  setDrillIndex(0);
                  setTimeLeft(5);
                  setIsTimerRunning(false);
                }}
                className={`px-3 py-1 rounded-md text-xs font-bold ${
                  activeRound === 1 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Rodada 1 (Quero / Preciso / Acho)
              </button>
              <button
                onClick={() => {
                  setActiveRound(2);
                  setDrillIndex(0);
                  setTimeLeft(5);
                  setIsTimerRunning(false);
                }}
                className={`px-3 py-1 rounded-md text-xs font-bold ${
                  activeRound === 2 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Rodada 2 (Contextos Alternativos)
              </button>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {drillIndex + 1} de {currentDrillList.length}
            </span>
          </div>

          <div className="text-center space-y-3 max-w-xl mx-auto py-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md">
              Gatilho: {currentDrill.triggerCategory.toUpperCase()}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              "{currentDrill.promptQuestion}"
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              {currentDrill.promptTranslation}
            </p>
          </div>

          {/* Temporizador Central */}
          <div className="flex flex-col items-center justify-center space-y-3 py-2">
            <div
              className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all ${
                isTimerRunning
                  ? 'border-rose-500 bg-rose-50/50 scale-105 animate-pulse'
                  : timeLeft === 0
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <span className="text-4xl font-black font-mono text-slate-900">
                {timeLeft}s
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">
                {isTimerRunning ? 'Fale Agora!' : timeLeft === 0 ? 'Tempo Esgotado' : 'Pronto?'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {!isTimerRunning && (
                <button
                  onClick={start5sDrill}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-500 transition-all shadow-xs"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Iniciar Desafio de 5 Segundos
                </button>
              )}
              <button
                onClick={() => handlePlayAudio(currentDrill.promptQuestion)}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700"
                title="Ouvir pergunta"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Resposta Sugerida & Gabarito */}
          {(drillAnswered || !isTimerRunning) && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Estrutura Esperada
                </span>
                <span className="text-xs font-bold text-rose-700">
                  {currentDrill.expectedStructure}
                </span>
              </div>
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Exemplo Natural:</span>
                  <span className="text-sm font-bold text-slate-900">
                    "{currentDrill.sampleAnswer}"
                  </span>
                </div>
                <button
                  onClick={() => handlePlayAudio(currentDrill.sampleAnswer)}
                  className="text-rose-600 hover:text-rose-800 p-1.5"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-400">
              Regra de Ouro: Nunca escreva nem traduza na cabeça. Fale imediatamente.
            </span>
            <button
              onClick={nextDrill}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              <span>Próximo Estímulo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ABA 2: 15 ESTRUTURAS & DRILLS DE SUBSTITUIÇÃO */}
      {activeTab === 'substitution15' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Automatização Modular
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              15 Estruturas Recorrentes & Drills de Substituição
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Troque apenas uma peça da frase para criar dezenas de variações sem pensar na gramática.
            </p>
          </div>

          {/* Grade com as Estruturas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {substitutionStructures.map((st, idx) => (
              <button
                key={st.id}
                onClick={() => {
                  setSelectedStructureIndex(idx);
                  setSelectedVariationIndex(0);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedStructureIndex === idx
                    ? 'border-rose-600 bg-rose-50/50 shadow-2xs font-bold text-rose-900'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <div className="text-[10px] text-slate-400 uppercase">Estrutura {st.number}</div>
                <div className="text-xs line-clamp-1">{st.pattern}</div>
              </button>
            ))}
          </div>

          {/* Estrutura Selecionada */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-rose-700 bg-rose-100/60 px-2 py-0.5 rounded">
                Gatilho: {currentStructure.nativeTrigger}
              </span>
              <button
                onClick={() => handlePlayAudio(currentStructure.pattern)}
                className="text-slate-500 hover:text-slate-800"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="text-lg sm:text-xl font-black text-slate-900">
                "{currentStructure.pattern}"
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {currentStructure.patternTranslation}
              </div>
            </div>

            {/* Variações de Substituição */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Substitua o Slot e Pratique em Voz Alta:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {currentStructure.variations.map((v, vIdx) => (
                  <button
                    key={vIdx}
                    onClick={() => {
                      setSelectedVariationIndex(vIdx);
                      handlePlayAudio(v.fullSentence);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedVariationIndex === vIdx
                        ? 'bg-white border-rose-500 shadow-xs'
                        : 'bg-white/60 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <span className="text-[11px] font-extrabold text-rose-700 block">
                      Substituir por: {v.replacement}
                    </span>
                    <span className="text-xs font-bold text-slate-900 block mt-1">
                      "{v.fullSentence}"
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {v.translation}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: TESTE DE 10 PERGUNTAS INESPERADAS */}
      {activeTab === 'unexpectedTest' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                Avaliação Rigorosa de Reflexo Oral
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Teste Final: 10 Perguntas Inesperadas
              </h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-lg text-slate-700">
              Pergunta {testQuestionIndex + 1} de {unexpectedQuestions.length}
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-rose-50/40 border border-rose-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                Desafio Inesperado: {currentTestQ.surpriseContext}
              </span>
              <span className="text-2xl font-black font-mono text-rose-900">
                {testTimer}s
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              "{currentTestQ.question}"
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {currentTestQ.questionTranslation}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={startUnexpectedTest}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition-colors flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Iniciar Pergunta & Timer (5s)
              </button>

              <button
                onClick={handleToggleTestRecord}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  isRecordingTest
                    ? 'bg-rose-700 text-white animate-pulse'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {isRecordingTest ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                {isRecordingTest ? 'Parar Gravação' : 'Gravar Sua Resposta'}
              </button>
            </div>

            {testRecordedUrl && (
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Sua resposta gravada:</span>
                  <audio controls src={testRecordedUrl} className="h-7 w-48" />
                </div>
                {spokenDetectedAnswer && (
                  <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                    Sua voz reconhecida: <span className="font-bold text-emerald-950">"{spokenDetectedAnswer}"</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Critérios de Avaliação dos 4 Pilares */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                1. Velocidade de Reação
              </span>
              <div className="text-sm font-black text-slate-900">
                Menos de {currentTestQ.evaluationCriteria.speedScoreSec} segundos
              </div>
              <p className="text-[11px] text-slate-500">
                Iniciar a primeira sílaba sem hesitar nem emitir som de "ééhh".
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                2. Clareza Fonética
              </span>
              <div className="text-xs font-bold text-slate-900 line-clamp-2">
                {currentTestQ.evaluationCriteria.clarityTip}
              </div>
              <p className="text-[11px] text-slate-500">
                Articulação sem "i" de apoio ou sílabas arrastadas.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                3. Gramática Essencial
              </span>
              <div className="text-xs font-bold text-slate-900 line-clamp-2">
                {currentTestQ.evaluationCriteria.essentialGrammar}
              </div>
              <p className="text-[11px] text-slate-500">
                Uso natural de tempos verbais sem inventar tradução literal.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                4. Variedade Vocabular
              </span>
              <div className="text-xs font-bold text-slate-900 line-clamp-2">
                {currentTestQ.evaluationCriteria.vocabularyVariety}
              </div>
              <p className="text-[11px] text-slate-500">
                Expressões específicas em vez de respostas de 1 palavra.
              </p>
            </div>
          </div>

          {/* Navegação do Teste */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                if (testQuestionIndex > 0) setTestQuestionIndex((p) => p - 1);
              }}
              disabled={testQuestionIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            >
              Pergunta Anterior
            </button>

            <button
              onClick={() => {
                if (testQuestionIndex < unexpectedQuestions.length - 1) {
                  setTestQuestionIndex((p) => p + 1);
                } else {
                  setTestQuestionIndex(0);
                }
                setTestTimer(5);
                setIsTestRunning(false);
                setTestRecordedUrl(null);
              }}
              className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Próxima Pergunta Inesperada
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
