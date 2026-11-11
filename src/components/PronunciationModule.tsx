import React, { useState, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Award,
  Play,
  RotateCcw,
  Zap,
  Flame,
  Music,
  Clock,
} from 'lucide-react';
import { TargetLanguage, FluencyLevel, ModuleId } from '../types';
import { LevelCurriculum } from '../data/curriculum';
import { AudioSynthesizer, VoiceRecorder, transcribeAudioWithServer } from '../services/audio';
import { GuidedStepBanner } from './GuidedStepBanner';
import {
  DetailedPhoneticError,
} from '../data/fluencyPillarsData';
import {
  getPhoneticErrorsForLanguage,
  getWeeklyTestForLanguage,
  getIntonationPatternsForLanguage,
  getPhoneticRoutineForLanguage,
} from '../data/languagePillarsData';

interface PronunciationModuleProps {
  language: TargetLanguage;
  level: FluencyLevel;
  curriculum: LevelCurriculum;
  onAddXp: (amount: number) => void;
  onOpenVoiceCoach?: () => void;
  onNavigate?: (module: ModuleId) => void;
}

interface PronunciationSavedState {
  activeTab: 'tenTraps' | 'daily10min' | 'intonation' | 'weeklyTest';
  selectedErrorIndex: number;
  selectedPracticeWordIndex: number;
  weeklyPhraseIndex: number;
}

const loadSavedPronunciation = (lvl: string): Partial<PronunciationSavedState> => {
  try {
    const raw = localStorage.getItem(`fluency_pronunciation_${lvl}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
};

export const PronunciationModule: React.FC<PronunciationModuleProps> = ({
  language,
  level,
  onAddXp,
  onOpenVoiceCoach,
  onNavigate,
}) => {
  const savedPronunciation = useRef(loadSavedPronunciation(level)).current;

  const [activeTab, setActiveTab] = useState<'tenTraps' | 'daily10min' | 'intonation' | 'weeklyTest'>(
    savedPronunciation.activeTab || 'tenTraps'
  );
  const [selectedErrorIndex, setSelectedErrorIndex] = useState(savedPronunciation.selectedErrorIndex || 0);
  const [selectedPracticeWordIndex, setSelectedPracticeWordIndex] = useState(savedPronunciation.selectedPracticeWordIndex || 0);

  // Estados de Gravação & Avaliação IA
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [spokenDetectedText, setSpokenDetectedText] = useState<string>('');
  const [evaluation, setEvaluation] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const voiceRecorderRef = useRef<VoiceRecorder>(new VoiceRecorder());

  // Estados do teste semanal de 15 frases
  const [weeklyPhraseIndex, setWeeklyPhraseIndex] = useState(savedPronunciation.weeklyPhraseIndex || 0);
  const [completedWeeklyPhrases, setCompletedWeeklyPhrases] = useState<Record<number, boolean>>({});

  const phoneticErrors = getPhoneticErrorsForLanguage(language, level);
  const weeklyPhrases = getWeeklyTestForLanguage(language);
  const dailyRoutine = getPhoneticRoutineForLanguage(language);
  const intonationPatterns = getIntonationPatternsForLanguage(language);

  const prevLevelRef = useRef(level);

  // Se trocar de nível, carregar progresso salvo daquele nível
  React.useEffect(() => {
    if (prevLevelRef.current !== level) {
      prevLevelRef.current = level;
      const loaded = loadSavedPronunciation(level);
      setSelectedErrorIndex(loaded.selectedErrorIndex || 0);
      setSelectedPracticeWordIndex(loaded.selectedPracticeWordIndex || 0);
      setWeeklyPhraseIndex(loaded.weeklyPhraseIndex || 0);
      if (loaded.activeTab) setActiveTab(loaded.activeTab);
      setEvaluation(null);
      setRecordedAudioUrl(null);
      setSpokenDetectedText('');
    }
  }, [language, level]);

  // Persistir estado de pronúncia no localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem(
        `fluency_pronunciation_${level}`,
        JSON.stringify({
          activeTab,
          selectedErrorIndex,
          selectedPracticeWordIndex,
          weeklyPhraseIndex,
        })
      );
    } catch {}
  }, [activeTab, selectedErrorIndex, selectedPracticeWordIndex, weeklyPhraseIndex, level]);

  const currentError: DetailedPhoneticError =
    phoneticErrors[selectedErrorIndex] || phoneticErrors[0];

  const currentPracticeWord =
    currentError?.practiceWords?.[selectedPracticeWordIndex] ||
    currentError?.practiceWords?.[0] ||
    '';

  const currentWeeklyPhrase = weeklyPhrases[weeklyPhraseIndex] || weeklyPhrases[0];

  const handlePlayAudio = (text: string, speed = 1.0) => {
    AudioSynthesizer.getInstance().speak(text, language, speed);
  };

  const handleToggleRecord = async (targetText: string) => {
    if (!isRecording) {
      setEvaluation(null);
      setSpokenDetectedText('');
      setRecordedAudioUrl(null);
      const ok = await voiceRecorderRef.current.startRecording();
      if (ok) {
        setIsRecording(true);
      }
    } else {
      setIsRecording(false);
      setIsEvaluating(true);
      try {
        const { audioBlob, audioUrl, audioBase64, mimeType } =
          await voiceRecorderRef.current.stopRecording();
        setRecordedAudioUrl(audioUrl);

        // Transcrição de áudio com modelo de IA
        let spoken = '';
        try {
          spoken = await transcribeAudioWithServer(audioBlob, language, targetText);
          if (spoken) {
            setSpokenDetectedText(spoken);
          }
        } catch (e) {
          console.warn('Transcrição remota falhou:', e);
        }

        await evaluateSpeechRecording(targetText, spoken, audioBase64, mimeType);
      } catch (e) {
        console.error('Falha ao processar gravação:', e);
        setIsEvaluating(false);
      }
    }
  };

  const evaluateSpeechRecording = async (
    targetText: string,
    spokenText?: string,
    audioBase64?: string,
    mimeType?: string
  ) => {
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/evaluate-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetPhrase: targetText,
          spokenText: spokenText || targetText,
          audioBase64: audioBase64 || '',
          mimeType: mimeType || 'audio/webm',
          language,
          level,
        }),
      });
      const data = await res.json();
      if (data?.data) {
        setEvaluation(data.data);
        if (data.data.spokenDetected && !spokenDetectedText) {
          setSpokenDetectedText(data.data.spokenDetected);
        }
        onAddXp(30);
      }
    } catch {
      // Silêncio resiliente
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl w-full mx-auto pb-12">
      <GuidedStepBanner currentModule="pronunciation" onNavigate={onNavigate} onAddXp={onAddXp} />

      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                  Pilar 6
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {language} • Nível {level}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Fonética de Impacto & Eliminação de Sotaque Bloqueador
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Foco estrito nos erros que causam ruído de comunicação e incompreensão por nativos.
              </p>
            </div>
          </div>

          {/* Abas */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('tenTraps')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'tenTraps'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              10 Erros Mais Prováveis
            </button>
            <button
              onClick={() => setActiveTab('daily10min')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'daily10min'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Rotina Diária 10 Min
            </button>
            <button
              onClick={() => setActiveTab('intonation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'intonation'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Padrões de Entonação
            </button>
            <button
              onClick={() => setActiveTab('weeklyTest')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'weeklyTest'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Teste Semanal (15 Frases)
            </button>
          </div>
        </div>
      </div>

      {/* Banner de Atalho do Treinador e Avaliador Crítico PT -> EN */}
      {onOpenVoiceCoach && (
        <div
          id="pronunciation-coach-shortcut-banner"
          className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 border border-amber-400/30 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-base shrink-0">
              🎙️
            </div>
            <div>
              <div className="font-bold text-sm sm:text-base text-white">
                Treinador & Avaliador Crítico de Pronúncia PT ➔ EN
              </div>
              <p className="text-xs text-slate-300">
                Fale ou digite em português, gere a tradução natural com transcrição IPA, grave sua voz em inglês e receba o laudo hipercrítico do auditor.
              </p>
            </div>
          </div>
          <button
            id="btn-open-coach-from-pronunciation"
            onClick={onOpenVoiceCoach}
            className="shrink-0 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Abrir Treinador PT ➔ EN</span>
          </button>
        </div>
      )}

      {/* ABA 1: OS 10 ERROS MAIS PROVÁVEIS */}
      {activeTab === 'tenTraps' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Menu Lateral de Erros */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Top Vícios de Falantes de Português ({language})
            </div>
            <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
              {phoneticErrors.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedErrorIndex(idx);
                    setSelectedPracticeWordIndex(0);
                    setEvaluation(null);
                    setRecordedAudioUrl(null);
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    selectedErrorIndex === idx
                      ? 'border-amber-500 bg-amber-50/50 shadow-2xs font-bold text-amber-950'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-[10px] font-black text-slate-600 flex items-center justify-center shrink-0">
                      {item.number}
                    </span>
                    <span className="text-xs line-clamp-1">{item.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Cartão de Detalhes do Erro */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                Erro #{currentError.number}
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                {currentError.name}
              </h2>
              <div className="text-xs font-mono text-amber-700 mt-0.5">
                Alvo Fonético: {currentError.targetSoundIpa}
              </div>
            </div>

            {/* 5 Palavras para Treino & Gravador de Voz Integrado (IMEDIATAMENTE NO CAMPO DE VISÃO) */}
            <div className="bg-slate-50/90 border-2 border-amber-300/80 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-black">
                    ★
                  </span>
                  Palavras para Treino Fonético Imediato (Selecione, Ouça e Grave)
                </span>
                <span className="text-xs font-medium text-amber-900 bg-amber-100/60 px-2 py-0.5 rounded">
                  Exercício Prático Ativo
                </span>
              </div>

              {/* Seletor de Palavras */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {currentError.practiceWords.map((word, wIdx) => {
                  const isSelected = selectedPracticeWordIndex === wIdx;
                  return (
                    <button
                      key={wIdx}
                      type="button"
                      onClick={() => {
                        setSelectedPracticeWordIndex(wIdx);
                        handlePlayAudio(word, 0.85);
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-100/70 ring-2 ring-amber-400 font-black text-amber-950 shadow-xs scale-102'
                          : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-800 font-semibold'
                      }`}
                    >
                      <span className="text-xs sm:text-sm block">
                        {word}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center justify-center gap-0.5 mt-0.5">
                        <Volume2 className="w-2.5 h-2.5 text-amber-600" />
                        {isSelected ? 'Ativa' : 'Ouvir'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Palco de Gravação Imediato (Diretamente conectado à palavra selecionada) */}
              <div className="p-3 bg-white border border-amber-200/80 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(currentPracticeWord, 0.85)}
                    className="p-2 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors shrink-0 cursor-pointer"
                    title="Ouvir áudio nativo"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Palavra em foco:</span>
                    <span className="text-sm font-black text-slate-900 truncate block">
                      "{currentPracticeWord}"
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                  <button
                    id="btn-record-pronunciation-drill"
                    type="button"
                    onClick={() => handleToggleRecord(currentPracticeWord)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer w-full sm:w-auto ${
                      isRecording
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isRecording ? 'Parar e Avaliar' : `Gravar Voz p/ "${currentPracticeWord}"`}
                  </button>

                  {recordedAudioUrl && (
                    <audio controls src={recordedAudioUrl} className="h-8 w-40" />
                  )}
                </div>
              </div>

              {isEvaluating && (
                <div className="text-xs text-amber-800 font-bold flex items-center justify-center gap-1.5 p-2 bg-amber-50 rounded-lg animate-pulse border border-amber-200">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Avaliador Fonético de IA analisando sua pronúncia...</span>
                </div>
              )}
            </div>

            {/* Comparativo: O que brasileiros fazem vs O que nativos fazem */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 space-y-1">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Como Brasileiros Falam (Incorreto)
                </span>
                <p className="text-xs text-rose-950 font-medium">
                  {currentError.brazilianTendency}
                </p>
                <div className="text-xs font-bold text-rose-700 mt-1">
                  Exemplo: {currentError.wrongExample}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Pronúncia Nativa Correta
                </span>
                <p className="text-xs text-emerald-950 font-medium">
                  {currentError.nativeCorrection}
                </p>
                <div className="text-xs font-bold text-emerald-800 mt-1">
                  Exemplo: {currentError.correctExample}
                </div>
              </div>
            </div>

            {/* Guia Anatômico */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Guia Anatômico de Boca, Língua e Maxilar
              </span>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {currentError.mouthAnatomyGuide}
              </p>
            </div>

            {/* Feedback da IA */}
            {evaluation && (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase">
                    Pontuação Fonética
                  </span>
                  <span className="text-sm font-black text-emerald-950">
                    {evaluation.accuracyScore}%
                  </span>
                </div>

                {spokenDetectedText && (
                  <div className="text-xs text-slate-700 bg-white/90 px-2.5 py-1.5 rounded-lg border border-emerald-200/80 font-medium">
                    <span className="text-slate-500 font-bold">Sua voz reconhecida: </span>
                    <span className="font-mono text-slate-900 font-bold">"{spokenDetectedText}"</span>
                  </div>
                )}

                <p className="text-xs text-emerald-900">{evaluation.feedback}</p>
                <div className="text-[11px] text-emerald-700 font-semibold">
                  Dica de ajuste: {evaluation.phoneticTip}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 2: ROTINA DIÁRIA DE 10 MINUTOS */}
      {activeTab === 'daily10min' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Hiper-Eficiência Fonética
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                Rotina Diária de 10 Minutos: Os 3 Erros de Maior Impacto
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Protocolo estrito para transformar memória muscular de boca e língua em 30 dias.
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-bold">
              <Clock className="w-4 h-4" />
              10 Min / Dia
            </div>
          </div>

          <div className="space-y-4">
            {dailyRoutine.map((step, sIdx) => (
              <div
                key={sIdx}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-xs font-mono font-bold">
                      {step.minutes}
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      {step.focusTitle}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 w-fit">
                    {step.drillType}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {step.instructions}
                </p>

                <div className="space-y-2 pt-1">
                  {step.practiceLines.map((line, lIdx) => (
                    <div
                      key={lIdx}
                      className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/80 hover:border-amber-300 transition-colors"
                    >
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                          "{line.phrase}"
                        </span>
                        <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">
                          Foco: {line.phoneticTarget}
                        </span>
                      </div>
                      <button
                        onClick={() => handlePlayAudio(line.phrase, 0.9)}
                        className="text-slate-400 hover:text-amber-700 p-1.5"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 3: PADRÕES DE ENTONAÇÃO */}
      {activeTab === 'intonation' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Melodia e Musicalidade
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              Os 4 Padrões Fundamentais de Entonação
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Falar com o tom correto evita soar ríspido, confuso ou entediado para os nativos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {intonationPatterns.map((p, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-amber-400 transition-all space-y-2.5 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">
                    {p.name}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-50 text-amber-800 rounded border border-amber-200">
                    {p.pitchMovement}
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium">
                  {p.rule}
                </p>

                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-xs sm:text-sm font-black text-slate-900">
                    {p.exampleSentence}
                  </span>
                  <button
                    onClick={() => handlePlayAudio(p.exampleSentence.replace(/[↗↘]/g, ''))}
                    className="text-amber-700 hover:text-amber-900"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 italic">
                  Por que importa: {p.whyItMatters}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 4: TESTE SEMANAL DE 15 FRASES */}
      {activeTab === 'weeklyTest' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Verificação de Progresso
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                Teste Semanal de Pronúncia (15 Frases)
              </h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-lg text-slate-700">
              Frase {weeklyPhraseIndex + 1} de {weeklyPhrases.length}
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Foco Avaliado: {currentWeeklyPhrase.target}
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              "{currentWeeklyPhrase.sentence}"
            </h3>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => handlePlayAudio(currentWeeklyPhrase.sentence.replace(/[↗↘]/g, ''))}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 transition-colors flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" />
                Ouvir Modelo Nativo
              </button>

              <button
                onClick={() => handleToggleRecord(currentWeeklyPhrase.sentence)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isRecording ? 'Finalizar Gravação' : 'Gravar Esta Frase'}
              </button>
            </div>

            {recordedAudioUrl && (
              <div className="pt-2 flex items-center gap-2">
                <span className="text-xs text-slate-500">Sua gravação:</span>
                <audio controls src={recordedAudioUrl} className="h-7 w-48" />
              </div>
            )}
          </div>

          {evaluation && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">Resultado Semanal</span>
                <span className="text-sm font-black text-emerald-950">{evaluation.accuracyScore}% de Precisão</span>
              </div>
              {spokenDetectedText && (
                <div className="text-xs text-slate-700 bg-white/90 px-2.5 py-1.5 rounded-lg border border-emerald-200/80 font-medium">
                  <span className="text-slate-500 font-bold">Sua voz reconhecida: </span>
                  <span className="font-mono text-slate-900 font-bold">"{spokenDetectedText}"</span>
                </div>
              )}
              <p className="text-xs text-emerald-900">{evaluation.feedback}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                if (weeklyPhraseIndex > 0) setWeeklyPhraseIndex((p) => p - 1);
                setEvaluation(null);
                setRecordedAudioUrl(null);
              }}
              disabled={weeklyPhraseIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            >
              Frase Anterior
            </button>

            <button
              onClick={() => {
                if (weeklyPhraseIndex < weeklyPhrases.length - 1) {
                  setWeeklyPhraseIndex((p) => p + 1);
                } else {
                  setWeeklyPhraseIndex(0);
                }
                setEvaluation(null);
                setRecordedAudioUrl(null);
                onAddXp(25);
              }}
              className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Próxima Frase do Teste
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
