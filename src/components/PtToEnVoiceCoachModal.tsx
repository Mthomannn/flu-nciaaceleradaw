import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Play,
  Square,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Headphones,
  Trash2,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Edit3,
} from 'lucide-react';
import { AudioSynthesizer, VoiceRecorder, SpeechTranscriber, transcribeAudioWithServer } from '../services/audio';

interface WordAnalysis {
  word: string;
  status: 'correct' | 'accented' | 'failed';
  heardAs?: string;
  phoneticIssue?: string;
  anatomicalFix?: string;
}

interface PitfallDetected {
  name: string;
  impact: string;
  exactCorrection: string;
}

interface CriticalAuditResult {
  accuracyScore: number;
  grade: string;
  verdict: string;
  whatNativeHeard: string;
  wordsAnalysis: WordAnalysis[];
  brazilianPitfallsDetected: PitfallDetected[];
  intelligibility: {
    clarity: string;
    rhythmType?: string;
    rhythmFeedback: string;
  };
  immediateDrill: {
    minimalPairs: string[];
    correctiveSentence: string;
  };
}

interface TranslationData {
  originalPt: string;
  englishTranslation: string;
  spokenNatural: string;
  ipa: string;
  syllablesGuide: {
    word: string;
    phonetic: string;
    stressedSyllable?: string;
    phoneticTrap?: string;
  }[];
  connectedSpeechTips: string;
  brazilianTraps: string[];
  anatomicalMouthGuide: string;
}

interface PtToEnVoiceCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddXp?: (amount: number) => void;
}

const QUICK_SUGGESTIONS = [
  'Quero pedir um café sem açúcar, por favor.',
  'Onde fica a estação de metrô mais próxima?',
  'Preciso remarcar nossa reunião para amanhã.',
  'Foi um prazer conversar com você sobre esse projeto.',
];

interface VoiceCoachSavedState {
  ptInput: string;
  translation: TranslationData | null;
  auditResult: CriticalAuditResult | null;
  enTranscript: string;
  isEditingPt: boolean;
  attemptsCount: number;
}

const loadSavedVoiceCoach = (): VoiceCoachSavedState => {
  try {
    const raw = localStorage.getItem('fluency_voice_coach_state');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return {
    ptInput: '',
    translation: null,
    auditResult: null,
    enTranscript: '',
    isEditingPt: false,
    attemptsCount: 0,
  };
};

export const PtToEnVoiceCoachModal: React.FC<PtToEnVoiceCoachModalProps> = ({
  isOpen,
  onClose,
  onAddXp,
}) => {
  const initialSaved = useRef<VoiceCoachSavedState>(loadSavedVoiceCoach()).current;

  // Entrada
  const [ptInput, setPtInput] = useState(initialSaved.ptInput || '');
  const [isListeningPt, setIsListeningPt] = useState(false);
  const [ptInterimText, setPtInterimText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isEditingPt, setIsEditingPt] = useState(initialSaved.isEditingPt || false);

  // Tradução
  const [translation, setTranslation] = useState<TranslationData | null>(initialSaved.translation || null);
  const [isPlayingNative, setIsPlayingNative] = useState(false);
  const [activeSpeed, setActiveSpeed] = useState<1.0 | 0.75>(1.0);

  // Gravação
  const [isRecordingEn, setIsRecordingEn] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [enTranscript, setEnTranscript] = useState(initialSaved.enTranscript || '');
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);
  const [audioWaveVolume, setAudioWaveVolume] = useState(0);

  // Avaliação Crítica
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<CriticalAuditResult | null>(initialSaved.auditResult || null);
  const [selectedWordForHelp, setSelectedWordForHelp] = useState<WordAnalysis | null>(null);
  const [attemptsCount, setAttemptsCount] = useState(initialSaved.attemptsCount || 0);
  const [showDetailedExplanation, setShowDetailedExplanation] = useState(false);

  // Refs de áudio
  const audioSynthRef = useRef<AudioSynthesizer>(AudioSynthesizer.getInstance());
  const voiceRecorderRef = useRef<VoiceRecorder>(new VoiceRecorder());
  const ptVoiceRecorderRef = useRef<VoiceRecorder>(new VoiceRecorder());
  const transcriberRef = useRef<SpeechTranscriber>(new SpeechTranscriber());
  const userAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const recordingTimerRef = useRef<any>(null);

  // Parar tudo ao fechar
  useEffect(() => {
    if (!isOpen) {
      stopAllAudioAndRecording();
    }
  }, [isOpen]);

  // Persistir estado no localStorage para não perder ao navegar ou trocar de exercício
  useEffect(() => {
    if (ptInput || translation || auditResult || enTranscript) {
      try {
        localStorage.setItem(
          'fluency_voice_coach_state',
          JSON.stringify({
            ptInput,
            translation,
            auditResult,
            enTranscript,
            isEditingPt,
            attemptsCount,
          })
        );
      } catch {}
    }
  }, [ptInput, translation, auditResult, enTranscript, isEditingPt, attemptsCount]);

  const stopAllAudioAndRecording = () => {
    audioSynthRef.current.stop();
    setIsPlayingNative(false);

    if (isListeningPt) {
      transcriberRef.current.stop();
      try {
        ptVoiceRecorderRef.current.stopRecording();
      } catch (e) {}
      setIsListeningPt(false);
    }

    if (isRecordingEn) {
      try {
        voiceRecorderRef.current.stopRecording();
      } catch (e) {
        // Ignorar
      }
      transcriberRef.current.stop();
      setIsRecordingEn(false);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }

    if (userAudioElementRef.current) {
      userAudioElementRef.current.pause();
      setIsPlayingUserAudio(false);
    }
  };

  // Limpar tudo da caixa de texto e resetar estado
  const handleClearInput = () => {
    stopAllAudioAndRecording();
    setPtInput('');
    setPtInterimText('');
    setTranslation(null);
    setAuditResult(null);
    setUserAudioUrl(null);
    setEnTranscript('');
    setSelectedWordForHelp(null);
    setShowDetailedExplanation(false);
    setIsEditingPt(true);
    try {
      localStorage.removeItem('fluency_voice_coach_state');
    } catch {}
  };

  // Falar em Português
  const handleToggleListenPt = async () => {
    if (isListeningPt) {
      transcriberRef.current.stop();
      setIsListeningPt(false);
      try {
        const { audioBlob } = await ptVoiceRecorderRef.current.stopRecording();
        if (!ptInput && !ptInterimText) {
          const transcribed = await transcribeAudioWithServer(audioBlob, 'Português');
          if (transcribed) {
            setPtInput(transcribed);
          }
        }
      } catch (e) {}
      return;
    }

    setPtInterimText('');
    setIsListeningPt(true);

    // Iniciar gravação de voz como backup resiliente
    await ptVoiceRecorderRef.current.startRecording();

    transcriberRef.current.listenWithLocale(
      'pt-BR',
      (text, isFinal) => {
        if (isFinal) {
          setPtInput((prev) => (prev ? `${prev} ${text}` : text));
          setPtInterimText('');
          setIsListeningPt(false);
          try {
            ptVoiceRecorderRef.current.stopRecording();
          } catch (e) {}
        } else {
          setPtInterimText(text);
        }
      },
      async (err) => {
        console.warn('Microfone pt-BR via SpeechRecognition avisou:', err);
      }
    );
  };

  // Traduzir para Inglês
  const handleTranslateAndAnalyze = async (textToProcess?: string) => {
    const text = (textToProcess || ptInput).trim();
    if (!text) return;

    stopAllAudioAndRecording();
    setIsTranslating(true);
    setAuditResult(null);
    setUserAudioUrl(null);
    setEnTranscript('');
    setSelectedWordForHelp(null);

    try {
      const res = await fetch('/api/translate-and-phonetics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textPt: text }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setTranslation(data.data);
        setIsEditingPt(false);
        if (onAddXp) onAddXp(5);
      }
    } catch (err) {
      console.error('Falha ao traduzir:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Ouvir Nativo
  const handlePlayNative = (speed: 1.0 | 0.75) => {
    if (!translation) return;

    if (isPlayingNative && activeSpeed === speed) {
      audioSynthRef.current.stop();
      setIsPlayingNative(false);
      return;
    }

    setActiveSpeed(speed);
    setIsPlayingNative(true);
    audioSynthRef.current.speak(translation.spokenNatural, 'Inglês', speed, () => {
      setIsPlayingNative(false);
    });
  };

  // Iniciar Gravação em Inglês
  const handleStartRecordingEn = async () => {
    stopAllAudioAndRecording();
    setEnTranscript('');
    setUserAudioUrl(null);
    setRecordingSeconds(0);
    setAuditResult(null);

    const started = await voiceRecorderRef.current.startRecording((volume) => {
      setAudioWaveVolume(Math.min(1, volume * 3));
    });

    if (!started) {
      alert('Não foi possível acessar o microfone. Verifique as permissões do navegador.');
      return;
    }

    setIsRecordingEn(true);

    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((sec) => sec + 1);
    }, 1000);

    transcriberRef.current.listenWithLocale(
      'en-US',
      (text) => {
        setEnTranscript(text);
      },
      (err) => {
        console.warn('Reconhecimento en-US:', err);
      }
    );
  };

  // Parar Gravação e Avaliar
  const handleStopRecordingEn = async () => {
    if (!isRecordingEn) return;

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    setIsRecordingEn(false);
    transcriberRef.current.stop();
    setIsAuditing(true);
    setAuditResult(null);

    try {
      const recording = await voiceRecorderRef.current.stopRecording();
      const { audioBlob, audioUrl, audioBase64, mimeType } = recording;
      setUserAudioUrl(audioUrl);
      setAttemptsCount((prev) => prev + 1);

      let spokenText = enTranscript.trim();
      // Se a transcrição local ficou vazia ou curta, transcrever via modelo de áudio Gemini
      if (!spokenText || spokenText.length < 2) {
        try {
          const targetPhrase = translation?.spokenNatural || translation?.englishTranslation || '';
          const serverTranscript = await transcribeAudioWithServer(audioBlob, 'Inglês', targetPhrase);
          if (serverTranscript) {
            spokenText = serverTranscript;
            setEnTranscript(serverTranscript);
          }
        } catch (e) {
          console.warn('Transcrição remota de voz:', e);
        }
      }

      await handleRunCriticalAudit(audioBase64, mimeType, spokenText);
    } catch (err) {
      console.error('Falha ao parar gravação:', err);
      setIsAuditing(false);
    }
  };

  // Auditoria Crítica
  const handleRunCriticalAudit = async (
    audioBase64?: string,
    mimeType?: string,
    spokenOverride?: string
  ) => {
    if (!translation) return;

    setIsAuditing(true);
    setAuditResult(null);

    const targetPhrase = translation.spokenNatural || translation.englishTranslation;
    const spokenText = (spokenOverride !== undefined ? spokenOverride : enTranscript).trim();

    try {
      const res = await fetch('/api/critical-pronunciation-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetEnglish: targetPhrase,
          spokenTranscript: spokenText,
          originalPt: translation.originalPt,
          audioBase64: audioBase64 || '',
          mimeType: mimeType || 'audio/webm',
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setAuditResult(data.data);
        if (data.data.whatNativeHeard && !enTranscript) {
          setEnTranscript(data.data.whatNativeHeard);
        }
        if (onAddXp) {
          const earned = data.data.accuracyScore >= 80 ? 25 : 15;
          onAddXp(earned);
        }
      }
    } catch (err) {
      console.error('Erro na auditoria crítica:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  // Reproduzir áudio do próprio usuário
  const handlePlayUserAudio = () => {
    if (!userAudioUrl) return;

    if (isPlayingUserAudio && userAudioElementRef.current) {
      userAudioElementRef.current.pause();
      setIsPlayingUserAudio(false);
      return;
    }

    if (!userAudioElementRef.current) {
      userAudioElementRef.current = new Audio(userAudioUrl);
      userAudioElementRef.current.onended = () => setIsPlayingUserAudio(false);
    } else {
      userAudioElementRef.current.src = userAudioUrl;
    }

    userAudioElementRef.current.play();
    setIsPlayingUserAudio(true);
  };

  if (!isOpen) return null;

  return (
    <div
      id="voice-coach-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="voice-coach-modal-card"
        className="bg-white w-full max-w-5xl xl:max-w-6xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-100"
      >
        {/* Cabeçalho Compacto e Direto */}
        <div className="px-4 sm:px-5 py-3 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm shadow-xs">
              🎙️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Treinador e Avaliador de Pronúncia
                </h2>
                <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wide border border-amber-400/30">
                  PT ➔ EN
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Fale ou escreva em português, ouça o nativo e repita no microfone com auditoria fonética imediata.
              </p>
            </div>
          </div>
          <button
            id="btn-close-coach-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo Principal com Grade Responsiva Alinhada (Mobile, Tablet e PC) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
          {/* =========================================================================
              SEÇÃO A: FORMULÁRIO DE ENTRADA PT (COMPACTO QUANDO TRADUZIDO)
             ========================================================================= */}
          {(!translation || isEditingPt) ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <label htmlFor="pt-input-textarea" className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">
                    1
                  </span>
                  <span>Fale ou escreva qualquer frase em Português:</span>
                </label>

                {ptInput && (
                  <button
                    id="btn-clear-pt-input"
                    type="button"
                    onClick={handleClearInput}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1 transition-colors cursor-pointer"
                    title="Apagar e recomeçar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Limpar</span>
                  </button>
                )}
              </div>

              {/* Caixa de Texto */}
              <div className="relative">
                <textarea
                  id="pt-input-textarea"
                  rows={2}
                  value={ptInput}
                  onChange={(e) => setPtInput(e.target.value)}
                  placeholder="Ex: Como faço para chegar ao aeroporto a tempo? Ou clique em Falar PT..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm sm:text-base text-slate-900 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 transition-all resize-none shadow-xs placeholder:text-slate-400"
                />

                {isListeningPt && (
                  <div className="absolute right-3 top-3 flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md animate-pulse border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Ouvindo fala...
                  </div>
                )}
              </div>

              {ptInterimText && (
                <div className="text-xs text-slate-500 italic">
                  Transcrevendo: <strong className="text-indigo-600">{ptInterimText}</strong>
                </div>
              )}

              {/* Botões de Ação do Input */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <button
                  id="btn-mic-pt"
                  type="button"
                  onClick={handleToggleListenPt}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
                    isListeningPt
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                  title="Falar em português"
                >
                  {isListeningPt ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      <span>Parar Ditado</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Falar no Microfone (PT)</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  {translation && (
                    <button
                      type="button"
                      onClick={() => setIsEditingPt(false)}
                      className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      Cancelar
                    </button>
                  )}

                  <button
                    id="btn-translate-pt"
                    type="button"
                    onClick={() => handleTranslateAndAnalyze()}
                    disabled={!ptInput.trim() || isTranslating}
                    className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    {isTranslating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Traduzindo...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Traduzir p/ Inglês & Praticar</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Sugestões Rápidas em Grid */}
              {!ptInput && (
                <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                  <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
                    Sugestões rápidas de treino cotidiano:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {QUICK_SUGGESTIONS.map((sample, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setPtInput(sample);
                          handleTranslateAndAnalyze(sample);
                        }}
                        className="text-xs bg-white hover:bg-indigo-50/60 hover:border-indigo-300 text-slate-700 p-2.5 rounded-xl border border-slate-200 text-left transition-all cursor-pointer shadow-2xs leading-relaxed"
                      >
                        "{sample}"
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Faixa Resumida e Compacta do Português quando já está traduzido */
            <div className="bg-slate-100/90 border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
                  Frase em Português:
                </span>
                <span className="font-semibold text-slate-900 truncate">
                  "{translation.originalPt || ptInput}"
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditingPt(true)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-indigo-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Trocar Frase</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearInput}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Nova Frase"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Estado de Espera Inicial */}
          {!translation && !isTranslating && (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-8 sm:p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto text-xl shadow-xs">
                🎧
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Pronto para Calibrar sua Pronúncia Nativa
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                  Digite ou dite sua frase em português acima e clique em <strong>Traduzir p/ Inglês</strong>. O sistema gerará a versão nativa, transcrição fonética IPA e abrirá o gravador de voz para auditoria imediata.
                </p>
              </div>
            </div>
          )}

          {/* =========================================================================
              SEÇÃO B: PALCO HERO UNIFICADO & STICKY
              (TEXTO EM INGLÊS E GRAVADOR DE VOZ INTEGRADOS JUNTOS SEM NENHUMA SEPARAÇÃO)
             ========================================================================= */}
          {translation && (
            <div className="space-y-4">
              <div className="sticky top-0 z-30 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 border-2 border-indigo-500/50 shadow-xl space-y-3.5 backdrop-blur-md">
                {/* Linha 1: Indicador de Passo & IPA */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black">
                      2
                    </span>
                    <span>Leia em voz alta e grave sua pronúncia:</span>
                  </span>
                  <span className="text-xs font-mono text-indigo-200 bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/10 font-medium">
                    {translation.ipa}
                  </span>
                </div>

                {/* Linha 2: Frase em Inglês em Destaque Absoluto */}
                <div className="space-y-1">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white font-serif leading-snug">
                    "{translation.spokenNatural}"
                  </div>
                  <div className="text-xs sm:text-sm text-slate-300 font-normal">
                    {translation.englishTranslation}
                  </div>
                </div>

                {/* Linha 3: Barra de Ferramentas de Voz Integrada (Zero Distância do Texto) */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                  {/* Botões do Áudio Nativo */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Modelo nativo:</span>
                    <button
                      id="btn-play-native-normal"
                      type="button"
                      onClick={() => handlePlayNative(1.0)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isPlayingNative && activeSpeed === 1.0
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                      }`}
                      title="Ouvir em velocidade nativa (1.0x)"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Nativo 1.0x</span>
                    </button>

                    <button
                      id="btn-play-native-slow"
                      type="button"
                      onClick={() => handlePlayNative(0.75)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isPlayingNative && activeSpeed === 0.75
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                      title="Ouvir em velocidade lenta didática (0.75x)"
                    >
                      <Headphones className="w-3.5 h-3.5" />
                      <span>Lento 0.75x</span>
                    </button>
                  </div>

                  {/* Botões do Gravador do Usuário */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {!isRecordingEn ? (
                      <button
                        id="btn-start-record-en"
                        type="button"
                        onClick={handleStartRecordingEn}
                        className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <Mic className="w-4 h-4 animate-pulse" />
                        <span>Gravar Minha Pronúncia</span>
                      </button>
                    ) : (
                      <button
                        id="btn-stop-record-en"
                        type="button"
                        onClick={handleStopRecordingEn}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md animate-pulse cursor-pointer border-2 border-rose-500"
                      >
                        <Square className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        <span>Parar e Avaliar ({recordingSeconds}s)</span>
                      </button>
                    )}

                    {userAudioUrl && !isRecordingEn && (
                      <div className="flex items-center gap-2">
                        <button
                          id="btn-play-user-recording"
                          type="button"
                          onClick={handlePlayUserAudio}
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                            isPlayingUserAudio
                              ? 'bg-rose-500 text-white border-rose-400'
                              : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                          }`}
                        >
                          {isPlayingUserAudio ? (
                            <>
                              <Square className="w-3.5 h-3.5 fill-white" />
                              <span>Pausar</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current text-amber-400" />
                              <span>Ouvir Minha Voz</span>
                            </>
                          )}
                        </button>

                        <button
                          id="btn-retry-record"
                          type="button"
                          onClick={handleStartRecordingEn}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors cursor-pointer"
                          title="Gravar novamente"
                        >
                          <RotateCcw className="w-4 h-4 text-amber-400" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Onda de Volume Ativa enquanto Grava */}
                {isRecordingEn && (
                  <div className="flex items-center justify-between gap-3 px-3.5 py-2 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-200 text-xs font-bold animate-pulse">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                      <span>Gravando sua voz: Fale olhando o texto acima...</span>
                    </div>
                    <div
                      className="h-2.5 rounded-full bg-rose-500 transition-all duration-75"
                      style={{ width: `${Math.max(32, audioWaveVolume * 180)}px` }}
                    />
                  </div>
                )}

                {/* Transcrição da Voz Gravada */}
                {enTranscript && !isRecordingEn && (
                  <div className="px-3 py-1.5 bg-white/10 rounded-xl text-xs flex items-center gap-2 text-indigo-200 border border-white/10">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Voz Detectada:</span>
                    <span className="font-mono font-bold text-white truncate">"{enTranscript}"</span>
                  </div>
                )}
              </div>

              {/* =========================================================================
                  SEÇÃO C: FEEDBACK DA AUDITORIA & GUIAS (ALINHADOS EM 2 COLUNAS NO DESKTOP)
                 ========================================================================= */}
              {isAuditing && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 text-center space-y-2.5 animate-in fade-in">
                  <RefreshCw className="w-7 h-7 text-indigo-600 animate-spin mx-auto" />
                  <div className="font-bold text-slate-900 text-sm sm:text-base">
                    Avaliador Fonético Hipercrítico Auditando sua Fala...
                  </div>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Analisando inteligibilidade real, tonicidade de sílabas e eliminação de vícios bloqueadores.
                  </p>
                </div>
              )}

              {auditResult && !isAuditing && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
                  {/* COLUNA 1 (ESQUERDA - 7 COLS): NOTA, VEREDITO & PALAVRAS AVALIADAS */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
                      {/* Topo do Laudo */}
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-extrabold uppercase tracking-wide">
                              Laudo de Auditoria
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              Tentativa #{attemptsCount}
                            </span>
                          </div>
                          <div className="text-base sm:text-lg font-black text-slate-900 mt-1">
                            Precisão Fonética: <span className="font-extrabold text-indigo-700">{auditResult.accuracyScore}/100</span> (Conceito {auditResult.grade})
                          </div>
                        </div>

                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-xs shrink-0 ${
                            auditResult.accuracyScore >= 85
                              ? 'bg-emerald-600'
                              : auditResult.accuracyScore >= 70
                              ? 'bg-amber-500'
                              : 'bg-rose-600'
                          }`}
                        >
                          {auditResult.grade}
                        </div>
                      </div>

                      {/* Veredito */}
                      <div className="bg-slate-50 border-l-4 border-slate-900 p-3.5 rounded-r-xl text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                        <strong>Veredito do Auditor:</strong> {auditResult.verdict}
                      </div>

                      {/* O que o nativo ouviu */}
                      <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-xl text-xs sm:text-sm text-amber-950">
                        <strong className="text-amber-900 block mb-0.5 text-xs font-bold uppercase tracking-wider">
                          O que um nativo escutou de verdade:
                        </strong>
                        "{auditResult.whatNativeHeard}"
                      </div>

                      {/* Palavras Avaliadas */}
                      <div className="space-y-2 pt-1 border-t border-slate-100">
                        <div className="flex items-center justify-between flex-wrap gap-1 text-xs">
                          <span className="font-bold text-slate-700">
                            Palavras Analisadas (Toque para ver ajuste anatômico):
                          </span>
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="text-emerald-700 font-bold">● Clara</span>
                            <span className="text-amber-700 font-bold">● Sotaque</span>
                            <span className="text-rose-700 font-bold">● Errada</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {auditResult.wordsAnalysis.map((item, idx) => {
                            const isSelected = selectedWordForHelp?.word === item.word;
                            const statusBg =
                              item.status === 'correct'
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
                                : item.status === 'accented'
                                ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
                                : 'bg-rose-50 border-rose-300 text-rose-900 hover:bg-rose-100';

                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setSelectedWordForHelp(isSelected ? null : item)}
                                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${statusBg} ${
                                  isSelected ? 'ring-2 ring-slate-900 scale-105' : ''
                                }`}
                              >
                                {item.word}
                              </button>
                            );
                          })}
                        </div>

                        {/* Detalhe Anatômico da Palavra Selecionada */}
                        {selectedWordForHelp && (
                          <div className="mt-2.5 p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-950 space-y-2 animate-in fade-in">
                            <div className="flex items-center justify-between font-bold">
                              <span className="text-sm text-indigo-900">Palavra: "{selectedWordForHelp.word}"</span>
                              <button
                                type="button"
                                onClick={() => setSelectedWordForHelp(null)}
                                className="text-indigo-400 hover:text-indigo-800 p-1 cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            {selectedWordForHelp.phoneticIssue && (
                              <p className="leading-relaxed"><strong>Ruído Identificado:</strong> {selectedWordForHelp.phoneticIssue}</p>
                            )}
                            {selectedWordForHelp.anatomicalFix && (
                              <div className="bg-white p-3 rounded-lg border border-indigo-100 text-indigo-900 leading-relaxed">
                                <strong>📍 Correção da Boca & Língua:</strong> {selectedWordForHelp.anatomicalFix}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* COLUNA 2 (DIREITA - 5 COLS): GUIA DE ARTICULAÇÃO & ARMADILHAS */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Guia de Articulação & Ritmo */}
                    <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 space-y-3 text-xs text-indigo-950">
                      <div className="font-bold text-indigo-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>Guia de Articulação & Ritmo Nativo</span>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-indigo-900 block text-xs">Fala Conectada (Linking):</strong>
                        <p className="text-indigo-900/90 leading-relaxed text-xs">{translation.connectedSpeechTips}</p>
                      </div>
                      <div className="space-y-1 pt-2 border-t border-indigo-200/60">
                        <strong className="text-indigo-900 block text-xs">Posição Anatômica da Boca:</strong>
                        <p className="text-indigo-900/90 leading-relaxed text-xs">{translation.anatomicalMouthGuide}</p>
                      </div>
                    </div>

                    {/* Vícios Fonéticos Típicos Brasileiros Detectados */}
                    {auditResult.brazilianPitfallsDetected && auditResult.brazilianPitfallsDetected.length > 0 && (
                      <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 space-y-2.5 text-xs">
                        <div className="font-bold text-rose-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          <span>Vícios Típicos de Brasileiros</span>
                        </div>
                        <div className="space-y-2">
                          {auditResult.brazilianPitfallsDetected.map((p, i) => (
                            <div key={i} className="p-2.5 bg-white rounded-xl border border-rose-100 space-y-1">
                              <strong className="text-rose-700 block text-xs">{p.name}</strong>
                              <p className="text-slate-600 leading-tight"><strong>Impacto:</strong> {p.impact}</p>
                              <p className="text-emerald-700 leading-tight"><strong>Como Corrigir:</strong> {p.exactCorrection}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Treino Corretivo Imediato */}
                    {auditResult.immediateDrill && (
                      <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2 text-xs">
                        <div className="font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                          <Award className="w-4 h-4" />
                          <span>Treino Corretivo Imediato</span>
                        </div>
                        {auditResult.immediateDrill.minimalPairs && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-indigo-200 text-[11px]">Pares Mínimos:</span>
                            {auditResult.immediateDrill.minimalPairs.map((pair, pIdx) => (
                              <span key={pIdx} className="bg-slate-800 px-2 py-0.5 rounded text-amber-300 font-mono text-[11px] border border-slate-700">
                                {pair}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-white/90 leading-relaxed">
                          <strong>Frase de calibração:</strong> "{auditResult.immediateDrill.correctiveSentence}"
                        </p>
                      </div>
                    )}

                    {/* Botão de Repetir no Fim do Relatório */}
                    <button
                      id="btn-retry-bottom"
                      type="button"
                      onClick={handleStartRecordingEn}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 text-amber-400" />
                      <span>Gravar Novamente para Subir Nota</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
