import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Subtitles,
  Languages,
  EyeOff,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Info,
  Tv,
  Film,
  SkipBack,
  SkipForward,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { ShortVideoLesson, TargetLanguage, FluencyLevel, ModuleId } from '../../types';
import { getShortVideoLessons } from '../../data/listeningMediaData';
import { AudioSynthesizer } from '../../services/audio';
import { LessonActionBar } from '../common/LessonActionBar';
import {
  markLessonDone,
  isLessonCompleted,
  isLessonMastered,
} from '../../services/lessonProgress';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface VideoLessonPlayerProps {
  language: TargetLanguage;
  level: FluencyLevel;
  onAddXp: (amount: number) => void;
  onNavigate?: (module: ModuleId) => void;
}

export type SubtitleMode = 'none' | 'original' | 'bilingual';
export type VideoSourceMode = 'interactive' | 'youtube';

export const VideoLessonPlayer: React.FC<VideoLessonPlayerProps> = ({
  language,
  level,
  onAddXp,
  onNavigate,
}) => {
  const lessons = getShortVideoLessons(language, level);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const activeLesson: ShortVideoLesson = lessons[selectedLessonIndex] || lessons[0];

  // Controle de Duração e Recompensa Adaptativa
  const lessonDurationMin = activeLesson?.durationMinutes || 3;
  const totalDurationSec = lessonDurationMin * 60;
  const lessonXpReward =
    lessonDurationMin === 10 ? 100 : lessonDurationMin === 7 ? 70 : lessonDurationMin === 5 ? 50 : 30;

  // Tempo decorrido em segundos
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);

  // Controle de Fonte do Player: 'interactive' ou 'youtube'
  const [videoSource, setVideoSource] = useState<VideoSourceMode>('interactive');

  // Controle de Legenda Solicitado pelo Usuário
  // 'none' = Sem legenda (Ouvido Cego)
  // 'original' = Com legenda original
  // 'bilingual' = Com legenda + tradução
  const [subtitleMode, setSubtitleMode] = useState<SubtitleMode>('original');

  // Estados de Reprodução Compartilhados
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const [activeSubtitleIndex, setActiveSubtitleIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [speakingProgress, setSpeakingProgress] = useState(0);

  // YouTube IFrame Player instance and timer
  const ytPlayerRef = useRef<any>(null);
  const ytSyncIntervalRef = useRef<any>(null);
  const [isYtReady, setIsYtReady] = useState(false);

  const synth = AudioSynthesizer.getInstance();
  const nextLineTimeoutRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);
  const playGenerationRef = useRef<number>(0);

  // Resetar lição, áudio e legendas ao alternar idioma ou nível
  useEffect(() => {
    setSelectedLessonIndex(0);
    setCurrentTimeSec(0);
    setIsPlaying(false);
    isPlayingRef.current = false;
    playGenerationRef.current++;
    setActiveSubtitleIndex(0);
    setSpeakingProgress(0);
    synth.stop();
    if (nextLineTimeoutRef.current) {
      clearTimeout(nextLineTimeoutRef.current);
      nextLineTimeoutRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, [language, level]);

  // Formatador de tempo mm:ss
  const formatTime = (sec: number) => {
    const safeSec = Math.max(0, Math.floor(sec));
    const m = Math.floor(safeSec / 60);
    const s = safeSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Timer para o modo de Cena Interativa
  useEffect(() => {
    if (videoSource !== 'interactive' || !isPlaying) return;

    const timer = setInterval(() => {
      setCurrentTimeSec((prev) => {
        if (prev + 1 >= totalDurationSec) {
          return totalDurationSec;
        }
        return prev + 1;
      });
    }, 1000 / playbackSpeed);

    return () => clearInterval(timer);
  }, [videoSource, isPlaying, totalDurationSec, playbackSpeed]);

  // 1. Carregar YouTube IFrame API globalmente uma única vez
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // 2. Inicializar ou atualizar Player do YouTube quando activeLesson ou videoSource muda
  useEffect(() => {
    if (videoSource !== 'youtube') {
      if (ytSyncIntervalRef.current) clearInterval(ytSyncIntervalRef.current);
      return;
    }

    let isSubscribed = true;

    const initOrLoadYT = () => {
      if (!window.YT || !window.YT.Player) {
        window.onYouTubeIframeAPIReady = () => {
          if (isSubscribed) setupPlayer();
        };
        return;
      }
      setupPlayer();
    };

    const setupPlayer = () => {
      try {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
          ytPlayerRef.current.cueVideoById(activeLesson.youtubeId);
          setIsYtReady(true);
        } else {
          ytPlayerRef.current = new window.YT.Player('youtube-iframe-element', {
            videoId: activeLesson.youtubeId,
            playerVars: {
              enablejsapi: 1,
              rel: 0,
              modestbranding: 1,
              playsinline: 1,
            },
            events: {
              onReady: () => {
                if (isSubscribed) setIsYtReady(true);
              },
              onStateChange: (event: any) => {
                if (!isSubscribed) return;
                // 1 = Playing, 2 = Paused, 0 = Ended
                if (event.data === 1) {
                  setIsPlaying(true);
                  startYouTubeSync();
                } else if (event.data === 2) {
                  setIsPlaying(false);
                  stopYouTubeSync();
                } else if (event.data === 0) {
                  setIsPlaying(false);
                  setIsCompleted(true);
                  onAddXp(lessonXpReward);
                  stopYouTubeSync();
                }
              },
            },
          });
        }
      } catch (err) {
        console.warn('Erro ao inicializar YouTube Player:', err);
      }
    };

    // Aguardar elemento estar no DOM
    const timer = setTimeout(initOrLoadYT, 200);

    return () => {
      isSubscribed = false;
      clearTimeout(timer);
      stopYouTubeSync();
    };
  }, [videoSource, activeLesson.youtubeId, lessonXpReward]);

  // Sincronização periódica do tempo do YouTube com as legendas e o relógio
  const startYouTubeSync = () => {
    if (ytSyncIntervalRef.current) clearInterval(ytSyncIntervalRef.current);
    ytSyncIntervalRef.current = setInterval(() => {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
        const currentTime = ytPlayerRef.current.getCurrentTime();
        if (typeof currentTime === 'number') {
          setCurrentTimeSec(Math.floor(currentTime));
          if (activeLesson.subtitles) {
            // Encontrar legenda correspondente ao tempo atual
            const foundIdx = activeLesson.subtitles.findIndex(
              (s) => currentTime >= s.startTimeSec && currentTime <= s.endTimeSec + 1
            );
            if (foundIdx !== -1) {
              setActiveSubtitleIndex(foundIdx);
            } else {
              // Se estiver entre falas, encontrar a última que já começou
              const lastPassedIdx = activeLesson.subtitles.reduce((acc, s, idx) => {
                return currentTime >= s.startTimeSec ? idx : acc;
              }, -1);
              if (lastPassedIdx !== -1) {
                setActiveSubtitleIndex(lastPassedIdx);
              }
            }
          }
        }
      }
    }, 250);
  };

  const stopYouTubeSync = () => {
    if (ytSyncIntervalRef.current) {
      clearInterval(ytSyncIntervalRef.current);
      ytSyncIntervalRef.current = null;
    }
  };

  // Resetar estado quando troca a aula ou idioma
  useEffect(() => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    playGenerationRef.current++;
    setActiveSubtitleIndex(0);
    setCurrentTimeSec(0);
    setIsCompleted(false);
    setSpeakingProgress(0);
    synth.stop();
    stopYouTubeSync();
    if (nextLineTimeoutRef.current) {
      clearTimeout(nextLineTimeoutRef.current);
      nextLineTimeoutRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, [activeLesson?.id, language, level]);

  // Parar fala e timers ao desmontar
  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      playGenerationRef.current++;
      synth.stop();
      stopYouTubeSync();
      if (nextLineTimeoutRef.current) {
        clearTimeout(nextLineTimeoutRef.current);
        nextLineTimeoutRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === 'function') {
        try {
          ytPlayerRef.current.destroy();
        } catch (e) {
          // Ignorar se já destruído
        }
      }
    };
  }, []);

  const totalSubtitles = activeLesson?.subtitles?.length || 1;
  const currentSubtitle = activeLesson?.subtitles?.[activeSubtitleIndex] || activeLesson?.subtitles?.[0];

  // Executar a fala da linha atual (Modo Cena Interativa)
  const playCurrentLine = (index: number) => {
    // Se o usuário já pausou, interromper imediatamente
    if (!isPlayingRef.current) {
      synth.stop();
      return;
    }

    if (!activeLesson?.subtitles || !activeLesson.subtitles[index]) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      setIsCompleted(true);
      setCurrentTimeSec(totalDurationSec);
      onAddXp(lessonXpReward);
      return;
    }

    const currentGen = ++playGenerationRef.current;
    const sub = activeLesson.subtitles[index];

    // Limpar timers e áudios anteriores antes de iniciar nova linha
    synth.stop();
    if (nextLineTimeoutRef.current) {
      clearTimeout(nextLineTimeoutRef.current);
      nextLineTimeoutRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    setSpeakingProgress(0);
    const estimatedDurationMs = Math.max(2500, (sub.originalText.length * 80) / playbackSpeed);
    const startProgressTime = Date.now();

    progressIntervalRef.current = setInterval(() => {
      // Se não for a mesma geração ou foi pausado, abortar
      if (!isPlayingRef.current || playGenerationRef.current !== currentGen) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        return;
      }
      const elapsed = Date.now() - startProgressTime;
      const pct = Math.min(100, Math.round((elapsed / estimatedDurationMs) * 100));
      setSpeakingProgress(pct);
    }, 100);

    synth.speak(sub.originalText, language, playbackSpeed, () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setSpeakingProgress(100);

      // Agendar a próxima fala apenas se continuar ativo nessa geração
      if (!isPlayingRef.current || playGenerationRef.current !== currentGen) {
        return;
      }

      nextLineTimeoutRef.current = setTimeout(() => {
        if (!isPlayingRef.current || playGenerationRef.current !== currentGen) {
          return;
        }

        if (index + 1 < activeLesson.subtitles.length) {
          setActiveSubtitleIndex(index + 1);
          playCurrentLine(index + 1);
        } else {
          setIsPlaying(false);
          isPlayingRef.current = false;
          setIsCompleted(true);
          setCurrentTimeSec(totalDurationSec);
          onAddXp(lessonXpReward);
        }
      }, 700);
    });
  };

  const handleTogglePlay = () => {
    if (videoSource === 'youtube') {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.getPlayerState === 'function') {
        const state = ytPlayerRef.current.getPlayerState();
        if (state === 1) {
          ytPlayerRef.current.pauseVideo();
          setIsPlaying(false);
          isPlayingRef.current = false;
          stopYouTubeSync();
        } else {
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
          isPlayingRef.current = true;
          startYouTubeSync();
        }
      } else {
        const nextState = !isPlaying;
        setIsPlaying(nextState);
        isPlayingRef.current = nextState;
      }
      return;
    }

    // Modo Cena Interativa
    if (isPlayingRef.current) {
      // PAUSAR IMEDIATAMENTE
      setIsPlaying(false);
      isPlayingRef.current = false;
      playGenerationRef.current++;
      synth.stop();
      if (nextLineTimeoutRef.current) {
        clearTimeout(nextLineTimeoutRef.current);
        nextLineTimeoutRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setSpeakingProgress(0);
    } else {
      // INICIAR REPRODUÇÃO
      setIsPlaying(true);
      isPlayingRef.current = true;
      playCurrentLine(activeSubtitleIndex);
    }
  };

  const handleSelectSubtitle = (index: number) => {
    setActiveSubtitleIndex(index);
    const sub = activeLesson.subtitles[index];

    if (videoSource === 'youtube') {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function' && sub) {
        ytPlayerRef.current.seekTo(sub.startTimeSec, true);
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
        isPlayingRef.current = true;
        startYouTubeSync();
      }
      return;
    }

    // Modo Cena Interativa
    if (isPlayingRef.current) {
      playCurrentLine(index);
    } else {
      synth.stop();
      if (sub) {
        synth.speak(sub.originalText, language, playbackSpeed);
      }
    }
  };

  const handlePrevLine = () => {
    const prev = Math.max(0, activeSubtitleIndex - 1);
    handleSelectSubtitle(prev);
  };

  const handleNextLine = () => {
    if (activeSubtitleIndex + 1 < activeLesson.subtitles.length) {
      handleSelectSubtitle(activeSubtitleIndex + 1);
    }
  };

  const handleRestart = () => {
    setActiveSubtitleIndex(0);
    setCurrentTimeSec(0);
    if (videoSource === 'youtube') {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
        ytPlayerRef.current.seekTo(0, true);
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
        isPlayingRef.current = true;
        startYouTubeSync();
      }
      return;
    }

    if (isPlayingRef.current) {
      playCurrentLine(0);
    } else {
      synth.stop();
      setSpeakingProgress(0);
    }
  };

  const handleSpeedChange = (spd: number) => {
    setPlaybackSpeed(spd);
    if (videoSource === 'youtube' && ytPlayerRef.current && typeof ytPlayerRef.current.setPlaybackRate === 'function') {
      try {
        ytPlayerRef.current.setPlaybackRate(spd);
      } catch (e) {
        // Ignorar se o YT não suportar
      }
    } else if (isPlayingRef.current) {
      // Reiniciar a fala atual com a nova velocidade sem sobrepor áudios
      playCurrentLine(activeSubtitleIndex);
    }
  };

  const handleSingleAudioSnippet = (text: string) => {
    synth.speak(text, language, playbackSpeed);
  };

  // Avatar e cores dependendo do falante
  const isSpeakerOne =
    !currentSubtitle?.speaker ||
    currentSubtitle.speaker === activeLesson?.subtitles[0]?.speaker;

  return (
    <div className="space-y-6">
      {/* Seletor de Aulas de Vídeo por Duração */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md">
                Vídeos da Cena Interativa
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {language} • Nível {level}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
              Escolha a Duração do seu Vídeo de Treino
            </h2>
          </div>

          {/* Seletor das 4 Durações Solicitadas: 3 min, 5 min, 7 min, 10 min */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {([3, 5, 7, 10] as const).map((dur) => {
              const durIdx = lessons.findIndex((l) => l.durationMinutes === dur);
              const lessonItem = lessons[durIdx];
              const isSelected = activeLesson?.durationMinutes === dur;
              const xpVal = dur === 10 ? 100 : dur === 7 ? 70 : dur === 5 ? 50 : 30;
              const isDone = lessonItem ? isLessonCompleted(language, level, lessonItem.id) : false;
              const isMast = lessonItem ? isLessonMastered(language, level, lessonItem.id) : false;

              return (
                <button
                  key={dur}
                  onClick={() => {
                    if (durIdx !== -1) {
                      setSelectedLessonIndex(durIdx);
                      setCurrentTimeSec(0);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-400/30'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                  title={`${dur} minutos ${isMast ? '(Dominado)' : isDone ? '(Já feito)' : ''}`}
                >
                  <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-purple-600'}`} />
                  <span>{dur} minutos</span>
                  {isMast ? (
                    <span className="text-amber-300 font-bold text-xs">★</span>
                  ) : isDone ? (
                    <span className="text-emerald-300 font-bold text-xs">✓</span>
                  ) : null}
                  <span
                    className={`text-2xs px-1.5 py-0.5 rounded font-bold ${
                      isSelected ? 'bg-purple-700 text-purple-100' : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    +{xpVal} XP
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activeLesson && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Coluna Principal: Player */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-md flex flex-col">
              {/* Barra de Controle de Fonte & Legendas */}
              <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                {/* Seletor de Modo de Exibição (Cena Animada vs YouTube) */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => {
                      setVideoSource('interactive');
                      isPlayingRef.current = false;
                      playGenerationRef.current++;
                      synth.stop();
                      stopYouTubeSync();
                      if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
                        try { ytPlayerRef.current.pauseVideo(); } catch (e) {}
                      }
                      setIsPlaying(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      videoSource === 'interactive'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Cena interativa com áudio em alta definição e legendas sincronizadas"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Cena Interativa</span>
                  </button>

                  <button
                    onClick={() => {
                      setVideoSource('youtube');
                      isPlayingRef.current = false;
                      playGenerationRef.current++;
                      synth.stop();
                      setIsPlaying(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      videoSource === 'youtube'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Vídeo oficial do YouTube com sincronização de legendas"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>YouTube Oficial</span>
                  </button>
                </div>

                {/* Os 3 Modos de Legenda Solicitados pelo Usuário */}
                <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl">
                  <button
                    id="subtitle-mode-none"
                    onClick={() => setSubtitleMode('none')}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      subtitleMode === 'none'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Oculta todo o texto para treino de escuta cega"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Sem Legenda</span>
                  </button>

                  <button
                    id="subtitle-mode-original"
                    onClick={() => setSubtitleMode('original')}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      subtitleMode === 'original'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Exibe a transcrição no idioma nativo"
                  >
                    <Subtitles className="w-3.5 h-3.5" />
                    <span>Com Legenda</span>
                  </button>

                  <button
                    id="subtitle-mode-bilingual"
                    onClick={() => setSubtitleMode('bilingual')}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      subtitleMode === 'bilingual'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Exibe legenda original e tradução em português"
                  >
                    <Languages className="w-3.5 h-3.5" />
                    <span>Legenda + Tradução</span>
                  </button>
                </div>
              </div>

              {/* ÁREA DO REPRODUTOR: CENA INTERATIVA OU YOUTUBE */}
              {videoSource === 'interactive' ? (
                /* MODO 1: CENA VISUAL INTERATIVA - ALTURA DINÂMICA SEM CORTAR LEGENDAS */
                <div className="relative min-h-[380px] sm:min-h-[420px] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col justify-between p-4 sm:p-6 select-none">
                  {/* Fundo com iluminação sutil */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(147,51,234,0.15),transparent_70%)] pointer-events-none" />

                  {/* Topo da Cena: Duração, Status do Falante e Relógio em Tempo Real */}
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-sm border border-slate-800 px-3 py-1.5 rounded-xl">
                        <div
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
                          }`}
                        />
                        <span className="text-2xs sm:text-xs font-bold text-slate-300 truncate max-w-[180px] sm:max-w-none">
                          {isPlaying
                            ? `Falando: ${currentSubtitle?.speaker || 'Locutor'}`
                            : 'Pausado — Clique no Play'}
                        </span>
                      </div>

                      {/* Tag de Duração Escolhida */}
                      <div className="flex items-center gap-1.5 bg-purple-950/80 border border-purple-800/60 px-2.5 py-1.5 rounded-xl text-purple-200 text-2xs font-bold">
                        <Clock className="w-3.5 h-3.5 text-purple-400" />
                        <span>Duração: {lessonDurationMin} min</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Relógio do Tempo Decorrido na Cena */}
                      <div className="text-2xs font-mono font-bold text-amber-300 bg-slate-900/90 border border-slate-800 px-2.5 py-1.5 rounded-xl">
                        {formatTime(currentTimeSec)} / {formatTime(totalDurationSec)}
                      </div>

                      <div className="text-2xs font-mono font-bold text-purple-300 bg-purple-950/80 border border-purple-800/60 px-2.5 py-1.5 rounded-xl shrink-0">
                        Fala {activeSubtitleIndex + 1} de {totalSubtitles}
                      </div>
                    </div>
                  </div>

                  {/* Centro da Cena: Representação dos Interlocutores com Ondas Sonoras */}
                  <div className="relative z-10 my-3 sm:my-auto flex items-center justify-around py-2 sm:py-4">
                    {/* Interlocutor 1 */}
                    <div
                      className={`flex flex-col items-center transition-all duration-300 ${
                        isSpeakerOne ? 'scale-105 opacity-100' : 'scale-95 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-14 h-14 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center text-lg sm:text-2xl font-black transition-all ${
                          isSpeakerOne && isPlaying
                            ? 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-lg shadow-purple-500/30 ring-4 ring-purple-400/40'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {activeLesson.subtitles[0]?.speaker?.[0] || 'A'}
                      </div>
                      <span className="text-xs font-bold text-slate-200 mt-1.5 text-center">
                        {activeLesson.subtitles[0]?.speaker || 'Personagem 1'}
                      </span>
                      {isSpeakerOne && isPlaying && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="w-1 h-3 bg-purple-400 rounded-full animate-bounce" />
                          <span
                            className="w-1 h-5 bg-indigo-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0.15s' }}
                          />
                          <span
                            className="w-1 h-2 bg-purple-300 rounded-full animate-bounce"
                            style={{ animationDelay: '0.3s' }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Ícone de Diálogo Central */}
                    <div className="hidden sm:flex flex-col items-center opacity-40 px-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      <span className="text-3xs text-slate-400 font-mono mt-1 text-center max-w-[120px] truncate">
                        {activeLesson.topic}
                      </span>
                    </div>

                    {/* Interlocutor 2 */}
                    <div
                      className={`flex flex-col items-center transition-all duration-300 ${
                        !isSpeakerOne ? 'scale-105 opacity-100' : 'scale-95 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-14 h-14 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center text-lg sm:text-2xl font-black transition-all ${
                          !isSpeakerOne && isPlaying
                            ? 'bg-gradient-to-tr from-amber-600 to-rose-500 text-white shadow-lg shadow-amber-500/30 ring-4 ring-amber-400/40'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {activeLesson.subtitles[1]?.speaker?.[0] || 'B'}
                      </div>
                      <span className="text-xs font-bold text-slate-200 mt-1.5 text-center">
                        {activeLesson.subtitles[1]?.speaker || 'Personagem 2'}
                      </span>
                      {!isSpeakerOne && isPlaying && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="w-1 h-3 bg-amber-400 rounded-full animate-bounce" />
                          <span
                            className="w-1 h-5 bg-rose-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0.15s' }}
                          />
                          <span
                            className="w-1 h-2 bg-amber-300 rounded-full animate-bounce"
                            style={{ animationDelay: '0.3s' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bloco de Legendas Sincronizadas da Cena (100% Visível e Confortável sem Cortes) */}
                  <div className="relative z-10 w-full max-w-2xl mx-auto text-center mt-3">
                    {subtitleMode === 'none' ? (
                      /* Modo Sem Legenda (Ouvido Cego) */
                      <div className="bg-slate-950/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-rose-500/30 text-rose-300 flex items-center justify-center gap-2">
                        <EyeOff className="w-4 h-4 text-rose-400 animate-pulse shrink-0" />
                        <span className="text-xs font-bold">
                          Modo Ouvido Cego Ativo — Treinando decodificação fonética pura sem muletas visuais
                        </span>
                      </div>
                    ) : (
                      /* Modos Com Legenda ou Bilíngue */
                      <div className="bg-black/90 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-slate-700/80 shadow-2xl space-y-1.5 w-full transition-all">
                        <p className="text-sm sm:text-base font-black text-amber-300 leading-relaxed break-words">
                          {currentSubtitle?.speaker && (
                            <span className="text-purple-300 mr-2 text-xs font-bold inline-block">
                              [{currentSubtitle.speaker}]:
                            </span>
                          )}
                          {currentSubtitle?.originalText}
                        </p>

                        {subtitleMode === 'bilingual' && (
                          <p className="text-xs sm:text-sm font-medium text-emerald-300 leading-normal break-words pt-1 border-t border-slate-800/80">
                            {currentSubtitle?.translatedText}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* MODO 2: YOUTUBE OFICIAL - VÍDEO 100% LIMPO SEM CAIXA SOBREPOSTA */
                <div className="relative aspect-video bg-black overflow-hidden">
                  <div id="youtube-iframe-element" className="w-full h-full border-0" />
                </div>
              )}

              {/* Caixa de Legenda Externa (Abaixo do Vídeo) para o modo YouTube - Sincronizada com o vídeo real */}
              {videoSource === 'youtube' && subtitleMode !== 'none' && currentSubtitle && (
                <div className="bg-slate-900 px-5 py-3 border-t border-slate-800 text-center transition-all">
                  <div className="max-w-2xl mx-auto space-y-1">
                    <p className="text-sm sm:text-base font-black text-amber-300 leading-snug">
                      {currentSubtitle.speaker && (
                        <span className="text-purple-300 mr-2 text-xs font-bold">
                          [{currentSubtitle.speaker}]:
                        </span>
                      )}
                      {currentSubtitle.originalText}
                    </p>
                    {subtitleMode === 'bilingual' && (
                      <p className="text-xs sm:text-sm font-medium text-emerald-300">
                        {currentSubtitle.translatedText}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Barra de Controles de Reprodução */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col gap-3">
                {/* Linha de Progresso Visual das Falas */}
                <div className="flex items-center gap-2">
                  <span className="text-2xs font-mono font-bold text-slate-400">
                    {activeSubtitleIndex + 1}/{totalSubtitles}
                  </span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden flex gap-1 p-0.5">
                    {activeLesson.subtitles.map((_, i) => (
                      <div
                        key={i}
                        onClick={() => handleSelectSubtitle(i)}
                        className={`flex-1 h-full rounded-full cursor-pointer transition-all ${
                          i < activeSubtitleIndex
                            ? 'bg-purple-500'
                            : i === activeSubtitleIndex
                            ? isPlaying
                              ? 'bg-emerald-400 animate-pulse'
                              : 'bg-purple-400'
                            : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                        title={`Pular para fala ${i + 1}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-2xs font-mono font-bold text-purple-300">
                    <Clock className="w-3 h-3 text-purple-400" />
                    <span>{formatTime(currentTimeSec)} / {formatTime(totalDurationSec)}</span>
                    <span className="text-slate-500">({activeLesson.duration})</span>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRestart}
                      className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                      title="Reiniciar vídeo do início"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handlePrevLine}
                      disabled={activeSubtitleIndex === 0}
                      className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all disabled:opacity-40"
                      title="Fala anterior"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleTogglePlay}
                      className={`px-4 py-2 rounded-xl font-black flex items-center gap-2 transition-all shadow-md ${
                        isPlaying
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                          : 'bg-purple-600 hover:bg-purple-500 text-white'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>Pausar</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span>{activeSubtitleIndex > 0 ? 'Continuar' : 'Iniciar Vídeo'}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleNextLine}
                      disabled={activeSubtitleIndex >= totalSubtitles - 1}
                      className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all disabled:opacity-40"
                      title="Próxima fala"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>

                    {/* Seletor de Velocidade */}
                    <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl ml-2">
                      {[0.75, 1.0, 1.25].map((spd) => (
                        <button
                          key={spd}
                          onClick={() => handleSpeedChange(spd)}
                          className={`px-2 py-0.5 rounded-lg text-2xs font-bold transition-all ${
                            playbackSpeed === spd
                              ? 'bg-purple-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Botão de Abrir no YouTube Externo */}
                    <a
                      href={`https://www.youtube.com/watch?v=${activeLesson.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-all"
                      title="Assistir no site do YouTube em uma nova aba"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                      <span>Abrir no YouTube</span>
                    </a>

                    <button
                      onClick={() => {
                        setIsCompleted(true);
                        setCurrentTimeSec(totalDurationSec);
                        markLessonDone(
                          language,
                          level,
                          activeLesson.id,
                          activeLesson.title,
                          'listening',
                          { preserveMastered: true }
                        );
                        onAddXp(lessonXpReward);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-colors ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isCompleted ? `Concluído (+${lessonXpReward} XP)` : `Marcar Concluído (+${lessonXpReward} XP)`}</span>
                    </button>
                  </div>
                </div>

                {/* Alerta explicativo caso o usuário veja erro de player do YouTube */}
                {videoSource === 'youtube' && (
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200 text-2xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>
                      As legendas abaixo e a transcrição interativa à direita avançam em sincronia automática com o áudio do YouTube. Se preferir ouvir cada fala com controle pausado, alterne para <strong>&quot;Cena Interativa&quot;</strong>.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Título e Explicações do Vídeo */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {activeLesson.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {activeLesson.topic}
                </p>
              </div>

              {/* Dica Cultural & Fonética */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Nuance Cultural & Naturalidade:</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
                  {activeLesson.culturalContext}
                </p>
              </div>

              {/* Expressões-Chave do Vídeo */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Expressões e Colocações Autênticas deste Vídeo:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {activeLesson.keyPhrases.map((kp, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-purple-700">
                          {kp.phrase}
                        </span>
                        <button
                          onClick={() => handleSingleAudioSnippet(kp.phrase)}
                          className="p-1 text-slate-400 hover:text-purple-600 transition-colors"
                          title="Ouvir pronúncia da expressão"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-2xs text-slate-600 font-medium">
                        {kp.translation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Barra de Status e Ações da Lição de Vídeo */}
            <LessonActionBar
              lessonId={activeLesson.id}
              lessonTitle={activeLesson.title}
              module="listening"
              language={language}
              level={level}
              onRefazer={() => {
                setCurrentTimeSec(0);
                setIsCompleted(false);
                setIsPlaying(false);
                isPlayingRef.current = false;
                setActiveSubtitleIndex(0);
                if (videoSource === 'youtube' && ytPlayerRef.current?.seekTo) {
                  try {
                    ytPlayerRef.current.seekTo(0, true);
                    ytPlayerRef.current.playVideo();
                  } catch (e) {}
                }
              }}
              onNavigateToModule={onNavigate}
              onAddXp={onAddXp}
            />
          </div>

          {/* Coluna Lateral: Transcrição Interativa com Timestamps */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col h-full">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    Transcrição Interativa
                  </h4>
                  <p className="text-2xs text-slate-500">
                    Clique em qualquer fala para saltar ou ouvir
                  </p>
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  {activeLesson.subtitles.length} falas
                </span>
              </div>

              <div className="space-y-2.5 overflow-y-auto max-h-[500px] pt-3 pr-1">
                {activeLesson.subtitles.map((sub, idx) => {
                  const isCurrent = activeSubtitleIndex === idx;
                  return (
                    <div
                      key={sub.id}
                      onClick={() => handleSelectSubtitle(idx)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                        isCurrent
                          ? 'border-purple-500 bg-purple-50/80 shadow-xs'
                          : 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-2xs font-bold text-slate-400 font-mono">
                          Fala {idx + 1}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {sub.speaker && (
                            <span className="text-2xs font-bold text-purple-700 bg-purple-100/70 px-1.5 py-0.2 rounded">
                              {sub.speaker}
                            </span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSingleAudioSnippet(sub.originalText);
                            }}
                            className="p-1 text-slate-400 hover:text-purple-600 transition-colors"
                            title="Ouvir apenas esta fala"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Exibição condicional de acordo com o modo de legenda */}
                      {subtitleMode === 'none' ? (
                        <p className="text-xs italic text-slate-400">
                          [Texto ocultado pelo Modo Ouvido Cego — clique para ouvir]
                        </p>
                      ) : (
                        <>
                          <p
                            className={`text-xs font-bold leading-relaxed ${
                              isCurrent ? 'text-purple-950 font-black' : 'text-slate-800'
                            }`}
                          >
                            {sub.originalText}
                          </p>

                          {subtitleMode === 'bilingual' && (
                            <p className="text-2xs text-slate-500 mt-1">
                              {sub.translatedText}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-2xs text-slate-600">
                💡 <strong>Dica de Estudo:</strong> Se quiser treinar apenas o ouvido, selecione <em>Sem Legenda</em>. Para checar a conexão das palavras com a escrita, mude para <em>Com Legenda</em>.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


