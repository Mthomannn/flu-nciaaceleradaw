import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  Volume2,
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Clock,
  Radio,
  BookOpen,
} from 'lucide-react';
import { TimedAudioSession, TargetLanguage, FluencyLevel, ModuleId } from '../../types';
import { getTimedAudioSessions } from '../../data/listeningMediaData';
import { AudioSynthesizer } from '../../services/audio';
import { LessonActionBar } from '../common/LessonActionBar';
import {
  markLessonDone,
  isLessonCompleted,
  isLessonMastered,
} from '../../services/lessonProgress';

interface TimedAudioPlayerProps {
  language: TargetLanguage;
  level: FluencyLevel;
  onAddXp: (amount: number) => void;
  onNavigate?: (module: ModuleId) => void;
}

export const TimedAudioPlayer: React.FC<TimedAudioPlayerProps> = ({
  language,
  level,
  onAddXp,
  onNavigate,
}) => {
  const sessions = getTimedAudioSessions(language, level);
  const [selectedDuration, setSelectedDuration] = useState<3 | 5 | 7 | 10>(3);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);

  // Filtrar sessões pela duração selecionada
  const matchingSessions = sessions.filter((s) => s.durationMinutes === selectedDuration);
  const activeSession = matchingSessions[0] || sessions[0];

  // Estados de Reprodução & Timer
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    (activeSession?.durationMinutes || 3) * 60
  );
  const totalSeconds = (activeSession?.durationMinutes || 3) * 60;

  // Estados do Quiz de Compreensão
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const timerRef = useRef<any>(null);
  const synthRef = useRef<AudioSynthesizer | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const playGenerationRef = useRef<number>(0);
  const nextSegmentTimeoutRef = useRef<any>(null);

  useEffect(() => {
    synthRef.current = AudioSynthesizer.getInstance();
    return () => {
      stopAudio();
    };
  }, []);

  // Atualizar quando mudar de sessão ou de duração
  useEffect(() => {
    stopAudio();
    if (activeSession) {
      setSecondsRemaining(activeSession.durationMinutes * 60);
      setActiveSegmentIndex(0);
      setSelectedAnswers({});
      setQuizSubmitted(false);
      setQuizScore(null);
    }
  }, [activeSession?.id, selectedDuration]);

  // Contagem regressiva do timer
  useEffect(() => {
    if (isPlaying && secondsRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isPlaying) {
      handleCompleteSession();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, secondsRemaining]);

  const stopAudio = () => {
    isPlayingRef.current = false;
    playGenerationRef.current++;
    setIsPlaying(false);

    if (nextSegmentTimeoutRef.current) {
      clearTimeout(nextSegmentTimeoutRef.current);
      nextSegmentTimeoutRef.current = null;
    }

    const synth = synthRef.current || AudioSynthesizer.getInstance();
    synth.stop();
  };

  const handleTogglePlay = () => {
    if (isPlayingRef.current) {
      stopAudio();
    } else {
      setIsPlaying(true);
      isPlayingRef.current = true;
      playSegmentChain(activeSegmentIndex);
    }
  };

  // Reproduzir falas em cadeia com cancelamento seguro e sem repetições
  const playSegmentChain = (index: number) => {
    if (!isPlayingRef.current) {
      stopAudio();
      return;
    }

    if (!activeSession || !activeSession.segments || index >= activeSession.segments.length) {
      return;
    }

    const currentGen = ++playGenerationRef.current;
    setActiveSegmentIndex(index);
    const segment = activeSession.segments[index];
    const synth = synthRef.current || AudioSynthesizer.getInstance();

    if (nextSegmentTimeoutRef.current) {
      clearTimeout(nextSegmentTimeoutRef.current);
      nextSegmentTimeoutRef.current = null;
    }

    synth.speak(segment.text, language, playbackSpeed, () => {
      // Quando a fala terminar, verificar se ainda estamos ativos na mesma reprodução
      if (!isPlayingRef.current || playGenerationRef.current !== currentGen) {
        return;
      }

      nextSegmentTimeoutRef.current = setTimeout(() => {
        if (!isPlayingRef.current || playGenerationRef.current !== currentGen) {
          return;
        }

        if (index + 1 < activeSession.segments.length) {
          playSegmentChain(index + 1);
        } else {
          // Reiniciar ciclo até o timer da sessão expirar
          playSegmentChain(0);
        }
      }, 700);
    });
  };

  const handlePlaySingleSegment = (idx: number) => {
    stopAudio();
    setActiveSegmentIndex(idx);
    const seg = activeSession.segments[idx];
    const synth = synthRef.current || AudioSynthesizer.getInstance();
    synth.speak(seg.text, language, playbackSpeed);
  };

  const handleSkipSeconds = (delta: number) => {
    setSecondsRemaining((prev) => {
      const next = prev - delta;
      return Math.max(0, Math.min(totalSeconds, next));
    });
  };

  const handleCompleteSession = () => {
    stopAudio();
    if (activeSession) {
      markLessonDone(
        language,
        level,
        activeSession.id,
        activeSession.title,
        'listening',
        { preserveMastered: true }
      );
    }
    onAddXp(activeSession.durationMinutes * 15);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleCheckQuiz = () => {
    if (!activeSession || !activeSession.comprehensionQuestions) return;
    let score = 0;
    activeSession.comprehensionQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    markLessonDone(
      language,
      level,
      activeSession.id,
      activeSession.title,
      'listening',
      { preserveMastered: true }
    );
    onAddXp(score * 20);
  };

  const progressPercent = Math.min(
    100,
    Math.max(0, ((totalSeconds - secondsRemaining) / totalSeconds) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Seletor de Duração Solicitado pelo Usuário: 3, 5, 7 e 10 minutos */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Treino de Escuta por Tempo Focado
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Escolha a duração ideal para sua sessão de imersão auditiva hoje ({language} • Nível {level})
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl self-start sm:self-auto flex-wrap">
            {([3, 5, 7, 10] as const).map((mins) => {
              const sess = sessions.find((s) => s.durationMinutes === mins);
              const done = sess ? isLessonCompleted(language, level, sess.id) : false;
              const mastered = sess ? isLessonMastered(language, level, sess.id) : false;

              return (
                <button
                  key={mins}
                  id={`duration-btn-${mins}m`}
                  onClick={() => setSelectedDuration(mins)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                    selectedDuration === mins
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/60'
                  }`}
                  title={`${mins} minutos ${mastered ? '(Dominado)' : done ? '(Feito)' : ''}`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{mins} Min</span>
                  {mastered ? (
                    <span className="text-amber-400 font-bold text-[10px]">★</span>
                  ) : done ? (
                    <span className="text-emerald-400 font-bold text-[10px]">✓</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cartão do Player Principal */}
      {activeSession ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Cabeçalho da Sessão */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {activeSession.durationMinutes} Minutos de Escuta
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                  Nível {activeSession.level}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {activeSession.topic}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                {activeSession.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {activeSession.summary}
              </p>
            </div>

            {/* Link para Streaming Externo Autêntico */}
            {activeSession.externalStreamUrl && (
              <a
                href={activeSession.externalStreamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200 transition-colors shrink-0"
              >
                <Radio className="w-4 h-4 text-indigo-600" />
                <span>Ouvir no {activeSession.streamSourceLabel}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Console do Player de Áudio */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 space-y-5 shadow-inner">
            {/* Barra de Progresso e Timer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                <span className="font-bold text-amber-400">
                  {formatTime(totalSeconds - secondsRemaining)}
                </span>
                <span className="text-slate-400">
                  Restante: {formatTime(secondsRemaining)}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Controles Centrais do Player */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              {/* Seletor de Velocidade */}
              <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                {([0.75, 1.0, 1.25] as const).map((spd) => (
                  <button
                    key={spd}
                    onClick={() => {
                      setPlaybackSpeed(spd);
                      if (isPlayingRef.current) {
                        stopAudio();
                        setIsPlaying(true);
                        isPlayingRef.current = true;
                        setTimeout(() => playSegmentChain(activeSegmentIndex), 100);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      playbackSpeed === spd
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* Botões Play / Pause e Pular */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSkipSeconds(-15)}
                  title="Voltar 15 segundos"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
                >
                  <Rewind className="w-4 h-4" />
                </button>

                <button
                  id="toggle-audio-session-play"
                  onClick={handleTogglePlay}
                  className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2.5 transition-all transform active:scale-95 shadow-md ${
                    isPlaying
                      ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                      : 'bg-indigo-600 text-white hover:bg-indigo-500'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5 fill-current" />
                      <span>Pausar Escuta</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      <span>Iniciar Áudio ({activeSession.durationMinutes} min)</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleSkipSeconds(15)}
                  title="Avançar 15 segundos"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
                >
                  <FastForward className="w-4 h-4" />
                </button>
              </div>

              {/* Modo Ouvido Cego vs Revelar Transcrição */}
              <button
                onClick={() => setShowTranscript((prev) => !prev)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                {showTranscript ? (
                  <>
                    <EyeOff className="w-4 h-4 text-amber-400" />
                    <span>Ocultar Texto (Modo Ouvido Cego)</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span>Ver Transcrição & Tradução</span>
                  </>
                )}
              </button>
            </div>

            {/* Aviso Pedagógico do Modo Ouvido Cego */}
            {!showTranscript && (
              <div className="text-center py-2 px-4 bg-slate-800/50 rounded-xl border border-slate-700/60 text-xs text-slate-300">
                🎧 <strong>Modo Ouvido Cego Ativo:</strong> Treine seu cérebro a decodificar os sons puros sem apoiar-se na leitura. Se tiver dúvida, clique em "Ver Transcrição".
              </div>
            )}
          </div>

          {/* Área de Transcrição e Diálogo Linha a Linha (se ativado) */}
          {showTranscript && (
            <div className="space-y-3 pt-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Transcrição Guiada com Marcação de Tempo
                </span>
                <span className="text-xs text-slate-500">
                  Clique no ícone de som para ouvir qualquer fala isoladamente
                </span>
              </div>

              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {activeSession.segments.map((seg, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all ${
                      activeSegmentIndex === idx && isPlaying
                        ? 'bg-indigo-50 border-indigo-300 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-indigo-700">
                            {seg.speaker}
                          </span>
                          <span className="text-2xs text-slate-400 font-mono">
                            [{seg.timestamp}]
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 leading-snug">
                          {seg.text}
                        </p>
                        <p className="text-xs text-slate-600 font-medium">
                          {seg.translation}
                        </p>
                      </div>

                      <button
                        onClick={() => handlePlaySingleSegment(idx)}
                        className="p-2 rounded-lg bg-white hover:bg-indigo-100 text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-colors shrink-0 shadow-2xs"
                        title="Ouvir esta fala específica"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Teste de Compreensão Auditiva (Quiz) */}
          {activeSession.comprehensionQuestions && activeSession.comprehensionQuestions.length > 0 && (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-600" />
                  <h4 className="text-sm sm:text-base font-black text-slate-900">
                    Checagem de Compreensão Auditiva
                  </h4>
                </div>
                {quizScore !== null && (
                  <span className="text-xs font-black px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Acertos: {quizScore} de {activeSession.comprehensionQuestions.length} (+{quizScore * 20} XP)
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {activeSession.comprehensionQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5">
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      {qIdx + 1}. {q.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selectedAnswers[qIdx] === optIdx;
                        const isCorrect = q.correctIndex === optIdx;

                        let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
                        if (quizSubmitted) {
                          if (isCorrect) {
                            btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold';
                          } else if (isChosen && !isCorrect) {
                            btnStyle = 'bg-rose-50 border-rose-300 text-rose-900 line-through';
                          }
                        } else if (isChosen) {
                          btnStyle = 'bg-indigo-50 border-indigo-400 text-indigo-900 font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleAnswerSelect(qIdx, optIdx)}
                            className={`p-2.5 rounded-lg border text-xs text-left transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <p className="text-2xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-200/80">
                        💡 <strong>Explicação:</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {!quizSubmitted ? (
                <button
                  id="submit-listening-quiz-button"
                  onClick={handleCheckQuiz}
                  disabled={Object.keys(selectedAnswers).length === 0}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  Conferir Respostas da Compreensão Auditiva
                </button>
              ) : (
                <button
                  onClick={() => {
                    setQuizSubmitted(false);
                    setSelectedAnswers({});
                    setQuizScore(null);
                  }}
                  className="w-full py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
                >
                  Refazer Teste de Compreensão
                </button>
              )}
            </div>
          )}

          {/* Barra de Status e Ações da Lição (Já aprendida, Refazer, Repetição Espaçada e Sugestões) */}
          <div className="pt-3 border-t border-slate-100">
            <LessonActionBar
              lessonId={activeSession.id}
              lessonTitle={activeSession.title}
              module="listening"
              language={language}
              level={level}
              onRefazer={() => {
                stopAudio();
                setSecondsRemaining(activeSession.durationMinutes * 60);
                setActiveSegmentIndex(0);
                setSelectedAnswers({});
                setQuizSubmitted(false);
                setQuizScore(null);
                handleTogglePlay();
              }}
              onNavigateToModule={onNavigate}
              onAddXp={onAddXp}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
          Nenhuma sessão disponível para esta combinação de idioma e nível.
        </div>
      )}
    </div>
  );
};
