import React, { useState } from 'react';
import {
  Headphones,
  Volume2,
  Eye,
  EyeOff,
  Mic,
  MicOff,
  Play,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Video,
  Radio,
  X,
} from 'lucide-react';
import { TargetLanguage, FluencyLevel, ListeningItem, ModuleId } from '../types';
import { LevelCurriculum } from '../data/curriculum';
import { AudioSynthesizer, VoiceRecorder } from '../services/audio';
import { TimedAudioPlayer } from './listening/TimedAudioPlayer';
import { VideoLessonPlayer } from './listening/VideoLessonPlayer';
import { LessonActionBar } from './common/LessonActionBar';
import { markLessonDone } from '../services/lessonProgress';
import { GuidedStepBanner } from './GuidedStepBanner';

interface ListeningModuleProps {
  language: TargetLanguage;
  level: FluencyLevel;
  curriculum: LevelCurriculum;
  onAddXp: (amount: number) => void;
  onNavigate?: (module: ModuleId) => void;
}

type ListeningSubTab = 'timed-audios' | 'videos' | 'connected-speech';

interface ListeningSavedState {
  currentIndex: number;
  activeTab: ListeningSubTab;
}

const loadSavedListening = (lvl: string): Partial<ListeningSavedState> => {
  try {
    const raw = localStorage.getItem(`fluency_listening_${lvl}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
};

export const ListeningModule: React.FC<ListeningModuleProps> = ({
  language,
  level,
  curriculum,
  onAddXp,
  onNavigate,
}) => {
  const savedListening = React.useRef(loadSavedListening(level)).current;

  const [activeTab, setActiveTab] = useState<ListeningSubTab>(savedListening.activeTab || 'timed-audios');
  const [items, setItems] = useState<ListeningItem[]>(curriculum.listeningItems);
  const [currentIndex, setCurrentIndex] = useState(savedListening.currentIndex || 0);
  const [userGuess, setUserGuess] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const [isRecordingShadow, setIsRecordingShadow] = useState(false);
  const [recordedShadowUrl, setRecordedShadowUrl] = useState<string | null>(null);

  const prevLevelRef = React.useRef(level);
  React.useEffect(() => {
    setItems(curriculum.listeningItems);
    if (prevLevelRef.current !== level) {
      prevLevelRef.current = level;
      const loaded = loadSavedListening(level);
      setCurrentIndex(loaded.currentIndex || 0);
      if (loaded.activeTab) setActiveTab(loaded.activeTab);
      setUserGuess('');
      setIsRevealed(false);
      setRecordedShadowUrl(null);
    }
  }, [curriculum, language, level]);

  // Persistir estado do módulo de escuta no localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem(
        `fluency_listening_${level}`,
        JSON.stringify({
          currentIndex,
          activeTab,
        })
      );
    } catch {}
  }, [currentIndex, activeTab, level]);

  const currentItem = items[currentIndex] || items[0];

  const handlePlayAudio = (targetSpeed?: number) => {
    if (!currentItem) return;
    const synth = AudioSynthesizer.getInstance();
    synth.speak(currentItem.spokenAudioText, language, targetSpeed || speed);
  };

  const handleReveal = () => {
    setIsRevealed(true);
    if (currentItem) {
      markLessonDone(
        language,
        level,
        currentItem.id,
        currentItem.spokenAudioText,
        'listening',
        { preserveMastered: true }
      );
    }
    onAddXp(20);
  };

  const handleToggleShadowRecord = async () => {
    const recorder = new VoiceRecorder();
    if (!isRecordingShadow) {
      const ok = await recorder.startRecording();
      if (ok) {
        setIsRecordingShadow(true);
      }
    } else {
      try {
        const { audioUrl } = await recorder.stopRecording();
        setRecordedShadowUrl(audioUrl);
        onAddXp(25);
      } catch (e) {
        console.error(e);
      } finally {
        setIsRecordingShadow(false);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl w-full mx-auto pb-12">
      <GuidedStepBanner currentModule="listening" onNavigate={onNavigate} onAddXp={onAddXp} />

      {/* Cabeçalho do Módulo */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                  Pilar 4 • Compreensão Auditiva
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {language} • Nível {level}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Treinador de Ouvido & Imersão Audiovisual
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Treine seu cérebro com sessões de 3 a 10 minutos, vídeos com 3 modos de legenda e decodificação de sons nativos.
              </p>
            </div>
          </div>
        </div>

        {/* Abas de Navegação Interna: Áudios 3/5/7/10m, Vídeos por Nível, Fala Conectada */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 overflow-x-auto">
          <button
            id="tab-timed-audios"
            onClick={() => setActiveTab('timed-audios')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'timed-audios'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Áudios de 3, 5, 7 e 10 Min</span>
          </button>

          <button
            id="tab-videos-subtitles"
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'videos'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Pequenos Vídeos (Sem / Com Legenda / Tradução)</span>
          </button>

          <button
            id="tab-connected-speech"
            onClick={() => setActiveTab('connected-speech')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'connected-speech'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Fala Conectada & Shadowing</span>
          </button>
        </div>
      </div>

      {/* CONTEÚDO DA ABA 1: ÁUDIOS CRONOMETRADOS DE 3, 5, 7 E 10 MINUTOS */}
      {activeTab === 'timed-audios' && (
        <TimedAudioPlayer
          language={language}
          level={level}
          onAddXp={onAddXp}
          onNavigate={onNavigate}
        />
      )}

      {/* CONTEÚDO DA ABA 2: PEQUENOS VÍDEOS COM CONTROLE DE LEGENDAS */}
      {activeTab === 'videos' && (
        <VideoLessonPlayer
          language={language}
          level={level}
          onAddXp={onAddXp}
          onNavigate={onNavigate}
        />
      )}

      {/* CONTEÚDO DA ABA 3: FALA CONECTADA E SHADOWING FONÉTICO */}
      {activeTab === 'connected-speech' && currentItem && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
              Desafio Auditivo • Nível {currentItem.level} de 5
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSpeed(0.75)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold border transition-colors ${
                  speed === 0.75
                    ? 'bg-purple-100 border-purple-300 text-purple-900'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                0.75x Lento
              </button>
              <button
                onClick={() => setSpeed(1.0)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold border transition-colors ${
                  speed === 1.0
                    ? 'bg-purple-100 border-purple-300 text-purple-900'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                1.0x Normal (Real)
              </button>
            </div>
          </div>

          {/* Player Principal de Áudio */}
          <div className="text-center py-6 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Passo 1: Ouça sem ler o texto
            </span>

            <div className="flex justify-center items-center gap-3">
              <button
                id="play-listening-audio-button"
                onClick={() => handlePlayAudio()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm shadow-sm transition-all transform active:scale-95"
              >
                <Volume2 className="w-5 h-5 text-white" />
                Ouvir Áudio Nativo ({speed}x)
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Dica: Ouça pelo menos 2 vezes antes de tentar decodificar.
            </p>
          </div>

          {/* Campo de Teste Ativo de Escuta */}
          {!isRevealed ? (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase block">
                Passo 2: O que você conseguiu captar? (Escreva ou pense nas palavras)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value)}
                    placeholder="Digite aqui o que você ouviu..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-4 pr-10 py-2.5 text-sm text-slate-900 focus:outline-purple-600"
                  />
                  {userGuess.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setUserGuess('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      title="Apagar texto digitado"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <button
                  id="reveal-listening-text-button"
                  onClick={handleReveal}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs sm:text-sm hover:bg-slate-800 transition-colors shadow-xs shrink-0"
                >
                  Revelar Transcrição
                </button>
              </div>
            </div>
          ) : (
            /* Transcrição Revelada & Análise de Sons Conectados (Tudo no Campo de Visão) */
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Bloco Unificado: Transcrição + Ouvir + Gravar Shadowing Juntos */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white space-y-3.5 shadow-md border border-purple-500/40">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Passo 3 & 4: Transcrição & Treino de Shadowing
                  </span>
                  <span className="text-xs text-purple-200">
                    Fale em voz alta junto com a frase
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    "{currentItem.spokenAudioText}"
                  </h3>
                  <p className="text-sm font-medium text-purple-200">
                    {currentItem.translation}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-purple-800/80">
                  <button
                    onClick={() => handlePlayAudio(1.0)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    Ouvir Áudio
                  </button>

                  <button
                    id="record-shadowing-button"
                    onClick={handleToggleShadowRecord}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                      isRecordingShadow
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                    }`}
                  >
                    {isRecordingShadow ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isRecordingShadow ? 'Parar Gravação' : 'Gravar Meu Shadowing'}
                  </button>

                  {recordedShadowUrl && (
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-xl border border-white/10">
                      <span className="text-xs text-slate-300">Sua voz:</span>
                      <audio controls src={recordedShadowUrl} className="h-7 w-36" />
                    </div>
                  )}
                </div>
              </div>

              {/* Destaque de Fenômenos Fonéticos & Connected Speech */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Por que iniciantes não entendem quando o nativo fala:</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-amber-950 leading-relaxed">
                  {currentItem.connectedSpeechBreakdown}
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-amber-200/80 text-xs text-slate-800">
                  <strong>Padrão de Redução:</strong>{' '}
                  <span className="font-mono text-purple-700 font-bold">
                    {currentItem.reductionFocus}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Barra de Status e Ações da Lição */}
          <div className="pt-2">
            <LessonActionBar
              lessonId={currentItem.id}
              lessonTitle={currentItem.spokenAudioText}
              module="listening"
              language={language}
              level={level}
              onRefazer={() => {
                setIsRevealed(false);
                setUserGuess('');
                setRecordedShadowUrl(null);
                handlePlayAudio();
              }}
              onNavigateToModule={onNavigate}
              onAddXp={onAddXp}
            />
          </div>

          {/* Navegação entre Frases */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                if (currentIndex > 0) {
                  setCurrentIndex((p) => p - 1);
                  setIsRevealed(false);
                  setUserGuess('');
                  setRecordedShadowUrl(null);
                }
              }}
              disabled={currentIndex === 0}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              Nível Anterior
            </button>

            <button
              onClick={() => {
                if (currentIndex < items.length - 1) {
                  setCurrentIndex((p) => p + 1);
                  setIsRevealed(false);
                  setUserGuess('');
                  setRecordedShadowUrl(null);
                }
              }}
              disabled={currentIndex === items.length - 1}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-40 flex items-center gap-1.5 shadow-xs"
            >
              <span>Próximo Nível</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

