import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Volume2,
  AlertCircle,
  Sparkles,
  User,
  Bot,
  RefreshCw,
  Award,
  Play,
  RotateCcw,
} from 'lucide-react';
import { TargetLanguage, FluencyLevel, ChatMessage, VocabularyItem, ModuleId } from '../types';
import { AudioSynthesizer, VoiceRecorder, SpeechTranscriber } from '../services/audio';
import { saveCustomLearnedItem } from '../services/srs';
import { GuidedStepBanner } from './GuidedStepBanner';

interface ConversationModuleProps {
  language: TargetLanguage;
  level: FluencyLevel;
  onAddXp: (amount: number) => void;
  onNavigate?: (module: ModuleId) => void;
}

interface ConversationSavedState {
  messages: ChatMessage[];
  inputText: string;
  persona: string;
  topic: string;
  userTurnCount: number;
  sessionFinished: boolean;
}

const loadSavedConversation = (lvl: string): ConversationSavedState | null => {
  try {
    const raw = localStorage.getItem(`fluency_conversation_state_${lvl}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return null;
};

export const ConversationModule: React.FC<ConversationModuleProps> = ({
  language,
  level,
  onAddXp,
  onNavigate,
}) => {
  const getInitialGreeting = (targetPersona = 'amigo'): ChatMessage => {
    let englishGreeting = "Hey there! How's your day going so far? Did you do anything interesting today?";
    let englishTr = "Olá! Como está seu dia até agora? Fez algo interessante hoje?";

    if (level === 'Zero') {
      englishGreeting =
        targetPersona === 'amigo'
          ? "Hello! Nice to meet you. My name is Alex. What is your name?"
          : "Hello, welcome! How can I help you today?";
      englishTr =
        targetPersona === 'amigo'
          ? "Olá! Prazer em te conhecer. Meu nome é Alex. Qual é o seu nome?"
          : "Olá, bem-vindo! Como posso te ajudar hoje?";
    } else if (level === 'A1') {
      englishGreeting =
        targetPersona === 'amigo'
          ? "Hi! How are you doing today? What do you want to do this weekend?"
          : targetPersona === 'atendente'
          ? "Hello, welcome! What would you like to order today?"
          : "Good morning! How are your tasks going today?";
      englishTr =
        targetPersona === 'amigo'
          ? "Oi! Como você está hoje? O que você quer fazer neste fim de semana?"
          : "Olá, bem-vindo! O que você gostaria de pedir hoje?";
    } else if (level === 'A2') {
      englishGreeting =
        targetPersona === 'amigo'
          ? "Hey! How's your week going? Did you do anything fun last weekend?"
          : targetPersona === 'atendente'
          ? "Good afternoon! Could you please tell me your booking reference or destination?"
          : "Hi there! Let's check our recent updates. How did your last project go?";
      englishTr = "Olá! Como vai sua semana? Fez algo divertido no último fim de semana?";
    } else if (level === 'B1') {
      englishGreeting =
        targetPersona === 'amigo'
          ? "Hey! I was just thinking: in your opinion, what's the best way to handle work-life balance?"
          : targetPersona === 'colega'
          ? "Good morning! Thanks for joining. How are the current project milestones progressing?"
          : "Hello! How can I assist you with your reservation details today?";
      englishTr = "Olá! Estava pensando: na sua opinião, qual a melhor forma de equilibrar trabalho e vida pessoal?";
    } else if (level === 'B2') {
      englishGreeting =
        targetPersona === 'amigo'
          ? "Hey! Good to catch up. What interesting challenges have you been tackling lately?"
          : targetPersona === 'colega'
          ? "Good morning! Let's touch base on the upcoming project deliverables. What are your main takeaways from yesterday's meeting?"
          : "Welcome! We're ready to proceed with your customized account setup.";
      englishTr = "Bom dia! Vamos nos alinhar sobre as entregas do projeto. Quais foram suas principais conclusões da reunião de ontem?";
    } else if (level === 'C1') {
      englishGreeting =
        targetPersona === 'amigo'
          ? "Good to see you! I've been reflecting on how rapidly market dynamics shift—what's your perspective on that?"
          : targetPersona === 'colega'
          ? "Good morning. In light of the latest strategic directives, how should we strike the balance between rapid growth and operational risk?"
          : "Welcome! How may we tailor our advisory services to align with your organization's overarching vision?";
      englishTr = "Bom dia. À luz das novas diretrizes estratégicas, como deveríamos equilibrar crescimento rápido e risco operacional?";
    }

    return {
      id: 'msg-0',
      sender: 'ai',
      text: englishGreeting,
      translation: englishTr,
      timestamp: 'Agora',
    };
  };

  const savedState = useRef(loadSavedConversation(level)).current;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (savedState && savedState.messages?.length > 0) {
      return savedState.messages;
    }
    return [getInitialGreeting(savedState?.persona || 'amigo')];
  });
  const [inputText, setInputText] = useState(savedState?.inputText || '');
  const [isSending, setIsSending] = useState(false);
  const [persona, setPersona] = useState(savedState?.persona || 'amigo');
  const [topic, setTopic] = useState(savedState?.topic || 'vida cotidiana');
  const [userTurnCount, setUserTurnCount] = useState(savedState?.userTurnCount || 0);
  const [isRecording, setIsRecording] = useState(false);
  const [isRecognizingSpeech, setIsRecognizingSpeech] = useState(false);
  const [recordingVolume, setRecordingVolume] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [sessionFinished, setSessionFinished] = useState(savedState?.sessionFinished || false);
  const [addedToAnkiWords, setAddedToAnkiWords] = useState<Record<string, boolean>>({});

  const handleAddToAnki = (nw: { word: string; translation: string; usage: string }) => {
    const newItem: VocabularyItem = {
      id: `custom_chat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      wordOrPhrase: nw.word,
      translation: nw.translation,
      category: 'Conversação com IA',
      naturalSentence1: nw.usage || nw.word,
      naturalSentence1Tr: nw.translation,
      naturalSentence2: '',
      naturalSentence2Tr: '',
      commonCollocation: 'Diálogo ao vivo',
      masteryStatus: 'aprendendo',
      isEssential50: false,
    };
    saveCustomLearnedItem(language, newItem);
    setAddedToAnkiWords((prev) => ({ ...prev, [nw.word]: true }));
    onAddXp(20);
  };

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const voiceRecorderRef = useRef<VoiceRecorder | null>(null);
  const speechTranscriberRef = useRef<SpeechTranscriber | null>(null);
  const isInitialMount = useRef(true);
  const prevLevelRef = useRef(level);

  // Troca de nível: se houver histórico para o novo nível, carregar; se não, inicializar saudação
  useEffect(() => {
    if (prevLevelRef.current !== level) {
      prevLevelRef.current = level;
      const loaded = loadSavedConversation(level);
      if (loaded && loaded.messages?.length > 0) {
        setMessages(loaded.messages);
        setInputText(loaded.inputText || '');
        setPersona(loaded.persona || 'amigo');
        setTopic(loaded.topic || 'vida cotidiana');
        setUserTurnCount(loaded.userTurnCount || 0);
        setSessionFinished(loaded.sessionFinished || false);
      } else {
        resetConversation();
      }
    }
  }, [level]);

  // Persistir estado sempre que mensagens, turnos, persona ou inputs mudarem
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(
          `fluency_conversation_state_${level}`,
          JSON.stringify({
            messages,
            inputText,
            persona,
            topic,
            userTurnCount,
            sessionFinished,
          })
        );
      } catch {}
    }
  }, [messages, inputText, persona, topic, userTurnCount, sessionFinished, level]);

  // Rola APENAS o container interno do chat sem afetar o scroll global da página
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isSending]);

  const resetConversation = (targetPersona = persona) => {
    setUserTurnCount(0);
    setSessionFinished(false);
    setInputText('');
    const greeting = getInitialGreeting(targetPersona);
    setMessages([greeting]);
    try {
      localStorage.setItem(
        `fluency_conversation_state_${level}`,
        JSON.stringify({
          messages: [greeting],
          inputText: '',
          persona: targetPersona,
          topic,
          userTurnCount: 0,
          sessionFinished: false,
        })
      );
    } catch {}
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending) return;

    const newCount = userTurnCount + 1;
    setUserTurnCount(newCount);
    setInputText('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);
    onAddXp(20);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          level,
          persona,
          topic,
          userMessage: text,
          history: messages.slice(-6),
          turnCount: newCount,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const aiData = resData.data;
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiData.reply,
          translation: aiData.translation,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          corrections: aiData.corrections?.length > 0 ? aiData.corrections : undefined,
          newWords: aiData.newWords?.length > 0 ? aiData.newWords : undefined,
          followUpChallenge: aiData.followUpChallenge,
        };

        setMessages((prev) => [...prev, aiMsg]);

        // Reproduzir áudio da IA automaticamente se o usuário tiver acabado de falar
        const synth = AudioSynthesizer.getInstance();
        synth.speak(aiData.reply, language, 1.0);
      }
    } catch (err) {
      console.warn('Erro no envio de mensagem de conversação:', err);
    } finally {
      setIsSending(false);
    }
  };

  // Gravação de Microfone & Reconhecimento de Fala
  const handleToggleMic = async () => {
    if (isRecording) {
      // Parar gravação
      if (voiceRecorderRef.current) {
        try {
          const { audioUrl } = await voiceRecorderRef.current.stopRecording();
          setRecordedAudioUrl(audioUrl);
        } catch (e) {
          console.error(e);
        }
      }
      if (speechTranscriberRef.current) {
        speechTranscriberRef.current.stop();
      }
      setIsRecording(false);
      setIsRecognizingSpeech(false);
      setRecordingVolume(0);
    } else {
      // Iniciar gravação e reconhecimento
      voiceRecorderRef.current = new VoiceRecorder();
      const started = await voiceRecorderRef.current.startRecording((vol) => {
        setRecordingVolume(Math.min(100, Math.round(vol * 120)));
      });

      if (started) {
        setIsRecording(true);
        speechTranscriberRef.current = new SpeechTranscriber();
        if (speechTranscriberRef.current.isSupported()) {
          setIsRecognizingSpeech(true);
          speechTranscriberRef.current.listen(
            language,
            (transcript, isFinal) => {
              setInputText(transcript);
              if (isFinal) {
                // Ao finalizar fala reconhecida, pode enviar diretamente ou deixar pronto
              }
            },
            (err) => {
              console.warn('Aviso de reconhecimento de voz:', err);
            }
          );
        }
      }
    }
  };

  const handlePlayAudio = (text: string) => {
    const synth = AudioSynthesizer.getInstance();
    synth.speak(text, language, 1.0);
  };

  return (
    <div className="space-y-6 max-w-7xl w-full mx-auto pb-12">
      <GuidedStepBanner currentModule="conversation" onNavigate={onNavigate} onAddXp={onAddXp} />

      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Pilar 3
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {language} • Nível {level}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Conversação Real & Correção Inteligente
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Fale o máximo possível sem travar. O parceiro IA adapta a complexidade para 80% de compreensão e corrige a cada 3 turnos.
              </p>
            </div>
          </div>

          <button
            onClick={resetConversation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reiniciar Diálogo
          </button>
        </div>

        {/* Escolha do Papel / Persona Realista */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase mr-1">
            Simular Papel:
          </span>
          {[
            { id: 'amigo', label: 'Amigo Nativo' },
            { id: 'atendente', label: 'Café / Restaurante' },
            { id: 'chefe', label: 'Colega de Trabalho' },
            { id: 'motorista', label: 'Motorista / Táxi' },
            { id: 'medico', label: 'Médico / Farmácia' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPersona(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                persona === p.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Caixa do Chat de Conversação (Responsivo Mobile, Tablet e PC) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[450px] sm:h-[520px] lg:h-[580px] overflow-hidden">
        {/* Lista de Mensagens */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => {
            const isAi = m.sender === 'ai';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isAi
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-900 text-amber-400'
                  }`}
                >
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Conteúdo */}
                <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isAi
                        ? 'bg-slate-50 border border-slate-200/80 text-slate-900 rounded-tl-none'
                        : 'bg-slate-900 text-white rounded-tr-none'
                    }`}
                  >
                    <p className="font-medium text-sm sm:text-base">{m.text}</p>

                    {isAi && m.translation && (
                      <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-200/60 font-normal">
                        {m.translation}
                      </p>
                    )}

                    {isAi && (
                      <div className="mt-2.5 flex items-center justify-between">
                        <button
                          onClick={() => handlePlayAudio(m.text)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Ouvir Nativo</span>
                        </button>
                        <span className="text-[11px] text-slate-400">{m.timestamp}</span>
                      </div>
                    )}
                  </div>

                  {/* Bloco de Correções Importantes (Metodologia: não interrompe a cada erro, agrupa) */}
                  {m.corrections && m.corrections.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Correções Importantes (Para Destravar)</span>
                      </div>
                      {m.corrections.map((c, idx) => (
                        <div key={idx} className="text-xs space-y-0.5 text-amber-950">
                          <div className="line-through text-slate-400">"{c.mistake}"</div>
                          <div className="font-bold text-emerald-700">✓ {c.correct}</div>
                          <div className="text-amber-800 italic">{c.explanation}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Vocabulário Novo Apresentado no Turno */}
                  {m.newWords && m.newWords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.newWords.map((nw, idx) => {
                        const isAdded = !!addedToAnkiWords[nw.word];
                        return (
                          <span
                            key={idx}
                            className="text-xs px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-900 font-medium inline-flex items-center gap-1.5"
                            title={nw.usage}
                          >
                            <span>
                              <strong>{nw.word}</strong>: {nw.translation}
                            </span>
                            <button
                              type="button"
                              onClick={() => !isAdded && handleAddToAnki(nw)}
                              disabled={isAdded}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                                isAdded
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                              }`}
                              title={isAdded ? 'Salvo no Baralho AnkiDroid' : 'Salvar no Baralho AnkiDroid (SRS)'}
                            >
                              {isAdded ? '✓ No Anki' : '+ Anki'}
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Desafio de Expansão (Evita respostas monossilábicas) */}
                  {m.followUpChallenge && (
                    <div className="text-xs font-medium text-slate-500 bg-slate-100/70 px-3 py-1.5 rounded-lg">
                      💡 <strong>Dica de Expansão:</strong> {m.followUpChallenge}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2 italic">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              O parceiro IA está elaborando uma resposta natural...
            </div>
          )}
        </div>

        {/* Barra de Entrada de Mensagem e Gravação */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 space-y-2">
          {/* Indicador de Onda ao Gravar */}
          {isRecording && (
            <div className="flex items-center justify-between px-3 py-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold animate-pulse">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                Gravando sua voz... (Volume: {recordingVolume}%)
              </span>
              <span className="text-[11px] font-normal">
                Fale naturalmente no microfone
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              id="conversation-mic-button"
              onClick={handleToggleMic}
              className={`p-3 rounded-xl border transition-all shrink-0 ${
                isRecording
                  ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
              title={isRecording ? 'Parar Gravação' : 'Gravar Mensagem de Voz'}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              id="conversation-input-text"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={`Responda em ${language} (ou clique no microfone para falar)...`}
              className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-emerald-600 shadow-2xs"
            />

            <button
              id="conversation-send-button"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isSending}
              className="p-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 transition-colors shrink-0 shadow-xs"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {recordedAudioUrl && (
            <div className="flex items-center justify-between text-xs text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
              <span>Sua última gravação está salva:</span>
              <audio controls src={recordedAudioUrl} className="h-7 w-48" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
