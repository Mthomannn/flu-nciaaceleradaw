import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Eye,
  EyeOff,
  Filter,
  ArrowRight,
  Plus,
  Trash2,
  Clock,
  Layers,
  Search,
  Calendar,
  Zap,
  HelpCircle,
  Headphones,
  MessageSquareQuote,
  RefreshCw,
  AlertCircle,
  SlidersHorizontal,
  Brain,
} from 'lucide-react';
import { TargetLanguage, FluencyLevel, VocabularyItem, AnkiRating, AnkiCardData, ModuleId } from '../types';
import { LevelCurriculum } from '../data/curriculum';
import { AudioSynthesizer } from '../services/audio';
import { GuidedStepBanner } from './GuidedStepBanner';
import {
  CONTRACTION_CHALLENGES,
  LISTENING_DICTATION_ITEMS,
} from '../data/nativeExpressionsData';
import {
  createDefaultAnkiData,
  getAnkiIntervalPreviews,
  processAnkiRating,
  getSavedAnkiDeck,
  saveAnkiDeck,
  getCustomLearnedItems,
  saveCustomLearnedItem,
  saveMultipleCustomLearnedItems,
  removeCustomLearnedItem,
  isDue,
  getTodayDateString,
} from '../services/srs';

interface VocabularyModuleProps {
  language: TargetLanguage;
  level: FluencyLevel;
  curriculum: LevelCurriculum;
  onAddXp: (amount: number) => void;
  onNavigate?: (module: ModuleId) => void;
}

const loadSavedVocabTabs = () => {
  try {
    const raw = localStorage.getItem('fluency_vocab_tab_state');
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
};

export const VocabularyModule: React.FC<VocabularyModuleProps> = ({
  language,
  level,
  curriculum,
  onAddXp,
  onNavigate,
}) => {
  const savedVocab = useRef(loadSavedVocabTabs()).current;

  // Tabs: AnkiDroid SRS, Desafio de Contrações, Ditado Auditivo, Cartões Tradicionais, Teste Ativo, Gerenciador do Baralho
  const [activeTab, setActiveTab] = useState<'anki' | 'contractions' | 'dictation' | 'cards' | 'test' | 'deckList'>(
    savedVocab.activeTab || 'anki'
  );

  // Dados do Baralho Anki (id -> AnkiCardData)
  const [ankiDeck, setAnkiDeck] = useState<Record<string, AnkiCardData>>(() =>
    getSavedAnkiDeck(language)
  );

  // Palavras customizadas salvas pelo usuário
  const [customItems, setCustomItems] = useState<VocabularyItem[]>(() =>
    getCustomLearnedItems(language)
  );

  // Lista unificada de vocabulário (currículo + customizados)
  const allItems = useMemo<VocabularyItem[]>(() => {
    const list = [...customItems, ...curriculum.vocabItems];
    // Garantir IDs únicos
    const seen = new Set<string>();
    return list.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [customItems, curriculum.vocabItems]);

  // Controles de Áudio e Filtros
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [autoPlayAudio, setAutoPlayAudio] = useState<boolean>(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [onlyEssential50, setOnlyEssential50] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // -------------------------------------------------------------
  // ESTADOS DO MODO ANKIDROID (SRS)
  // -------------------------------------------------------------
  const [ankiSessionQueue, setAnkiSessionQueue] = useState<string[]>([]);
  const [ankiQueueIndex, setAnkiQueueIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [cramMode, setCramMode] = useState(false); // Modo estudo antecipado (sem limite de vencimento)
  const [reviewedInSessionCount, setReviewedInSessionCount] = useState(0);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  // Estados para geração de novos lotes com IA e limites cognitivos de retenção sólida
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);
  const [batchSize, setBatchSize] = useState<number>(15);
  const [batchTheme, setBatchTheme] = useState('Contrações & Expressões Nativas do Cotidiano');
  const [batchNotification, setBatchNotification] = useState<string | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  // Estados dos Exercícios de Contrações
  const [contractionIndex, setContractionIndex] = useState(savedVocab.contractionIndex || 0);
  const [selectedContractionOption, setSelectedContractionOption] = useState<string | null>(null);
  const [isContractionAnswered, setIsContractionAnswered] = useState(false);
  const [contractionScore, setContractionScore] = useState(0);

  // Estados do Ditado Auditivo Conectado
  const [dictationIndex, setDictationIndex] = useState(savedVocab.dictationIndex || 0);
  const [dictationInput, setDictationInput] = useState('');
  const [dictationFeedback, setDictationFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showDictationHint, setShowDictationHint] = useState(false);
  const [showDictationAnswer, setShowDictationAnswer] = useState(false);
  const [dictationScore, setDictationScore] = useState(0);

  // Persistir aba e índices de exercícios de vocabulário
  useEffect(() => {
    try {
      localStorage.setItem(
        'fluency_vocab_tab_state',
        JSON.stringify({
          activeTab,
          contractionIndex,
          dictationIndex,
        })
      );
    } catch {}
  }, [activeTab, contractionIndex, dictationIndex]);

  // Modal para adicionar nova palavra ou frase ao Anki
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newWordTerm, setNewWordTerm] = useState('');
  const [newWordTr, setNewWordTr] = useState('');
  const [newWordPhonetic, setNewWordPhonetic] = useState('');
  const [newWordSentence, setNewWordSentence] = useState('');
  const [newWordSentenceTr, setNewWordSentenceTr] = useState('');
  const [newWordCategory, setNewWordCategory] = useState('Conversação Prática');

  // Estados dos modos tradicionais (cards e test)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  // Sincronizar dados quando mudar de idioma ou currículo
  useEffect(() => {
    const loadedDeck = getSavedAnkiDeck(language);
    setAnkiDeck(loadedDeck);
    const loadedCustom = getCustomLearnedItems(language);
    setCustomItems(loadedCustom);
    setCurrentIndex(0);
    setShowDetails(false);
    setDictationIndex(0);
    setDictationInput('');
    setDictationFeedback(null);
    setShowDictationHint(false);
    setShowDictationAnswer(false);
  }, [language, level, curriculum]);

  // Construir a fila de revisão do AnkiDroid
  const buildAnkiQueue = useCallback(() => {
    const deck = getSavedAnkiDeck(language);
    const today = getTodayDateString();

    const dueCards: string[] = [];
    const learningCards: string[] = [];
    const newCards: string[] = [];

    allItems.forEach((item) => {
      const data = deck[item.id] || createDefaultAnkiData();
      if (cramMode) {
        dueCards.push(item.id);
      } else {
        if (data.state === 'learning') {
          learningCards.push(item.id);
        } else if (data.state === 'review') {
          if (isDue(data.dueDate)) {
            dueCards.push(item.id);
          }
        } else {
          // new card
          newCards.push(item.id);
        }
      }
    });

    // Ordem clássica do Anki: 1) Cards a revisar vencidos, 2) Cards em aprendizagem, 3) Novos cards (calibrados pelo batchSize de retenção sólida)
    const sessionNewCards = cramMode ? newCards : newCards.slice(0, batchSize);
    const combinedQueue = [...dueCards, ...learningCards, ...sessionNewCards];
    setAnkiSessionQueue(combinedQueue);
    setAnkiQueueIndex(0);
    setIsAnswerRevealed(false);
    setIsSessionComplete(combinedQueue.length === 0);
  }, [allItems, language, cramMode, batchSize]);

  useEffect(() => {
    buildAnkiQueue();
  }, [buildAnkiQueue]);

  // Contadores tri-colores do AnkiDroid
  const ankiCounts = useMemo(() => {
    let newCount = 0;
    let learningCount = 0;
    let dueCount = 0;

    allItems.forEach((item) => {
      const card = ankiDeck[item.id] || createDefaultAnkiData();
      if (card.state === 'new') {
        newCount += 1;
      } else if (card.state === 'learning') {
        learningCount += 1;
      } else if (card.state === 'review') {
        if (isDue(card.dueDate)) {
          dueCount += 1;
        }
      }
    });

    return { newCount, learningCount, dueCount };
  }, [allItems, ankiDeck]);

  // Card atual na sessão Anki
  const currentAnkiItemId = ankiSessionQueue[ankiQueueIndex];
  const currentAnkiItem = useMemo(() => {
    return allItems.find((i) => i.id === currentAnkiItemId);
  }, [allItems, currentAnkiItemId]);

  const currentAnkiCardData = useMemo<AnkiCardData>(() => {
    if (!currentAnkiItem) return createDefaultAnkiData();
    return ankiDeck[currentAnkiItem.id] || createDefaultAnkiData();
  }, [ankiDeck, currentAnkiItem]);

  const intervalPreviews = useMemo(() => {
    return getAnkiIntervalPreviews(currentAnkiCardData);
  }, [currentAnkiCardData]);

  const handlePlayAudio = useCallback(
    (text: string) => {
      AudioSynthesizer.getInstance().speak(text, language, speechRate);
    },
    [language, speechRate]
  );

  // Auto-tocar áudio ao virar o cartão se habilitado
  useEffect(() => {
    if (activeTab === 'anki' && isAnswerRevealed && currentAnkiItem && autoPlayAudio) {
      handlePlayAudio(currentAnkiItem.wordOrPhrase);
    }
  }, [isAnswerRevealed, activeTab, currentAnkiItem, autoPlayAudio, handlePlayAudio]);

  // -------------------------------------------------------------
  // RATING ANKIDROID (Errei, Difícil, Bom, Fácil)
  // -------------------------------------------------------------
  const handleAnkiRate = useCallback(
    (rating: AnkiRating) => {
      if (!currentAnkiItem) return;

      const nextData = processAnkiRating(currentAnkiCardData, rating);
      const updatedDeck = { ...ankiDeck, [currentAnkiItem.id]: nextData };
      setAnkiDeck(updatedDeck);
      saveAnkiDeck(language, updatedDeck);

      // Conceder XP
      const xpAmount = rating === 'easy' ? 25 : rating === 'good' ? 20 : 10;
      onAddXp(xpAmount);
      setReviewedInSessionCount((p) => p + 1);

      // Se o usuário "Errou", recolocar o card mais para frente na fila da sessão atual
      if (rating === 'again') {
        setAnkiSessionQueue((prev) => [...prev, currentAnkiItem.id]);
      }

      // Avançar para o próximo card da fila
      if (ankiQueueIndex + 1 < ankiSessionQueue.length) {
        setAnkiQueueIndex((prev) => prev + 1);
        setIsAnswerRevealed(false);
      } else {
        setIsSessionComplete(true);
      }
    },
    [currentAnkiItem, currentAnkiCardData, ankiDeck, language, onAddXp, ankiQueueIndex, ankiSessionQueue.length]
  );

  // Atalhos de teclado idênticos ao AnkiDroid / Anki Desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar se o usuário estiver digitando em inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (activeTab === 'anki' && !isSessionComplete) {
        if (e.code === 'Space') {
          e.preventDefault();
          if (!isAnswerRevealed) {
            setIsAnswerRevealed(true);
          } else {
            // Se já revelado, espaço equivale a "Bom"
            handleAnkiRate('good');
          }
        } else if (isAnswerRevealed) {
          if (e.key === '1') handleAnkiRate('again');
          if (e.key === '2') handleAnkiRate('hard');
          if (e.key === '3') handleAnkiRate('good');
          if (e.key === '4') handleAnkiRate('easy');
        }

        if (e.key === 'r' || e.key === 'R') {
          if (currentAnkiItem) handlePlayAudio(currentAnkiItem.wordOrPhrase);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, isSessionComplete, isAnswerRevealed, handleAnkiRate, currentAnkiItem, handlePlayAudio]);

  // Salvar nova palavra/frase customizada
  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWordTerm.trim() || !newWordTr.trim()) return;

    const newItem: VocabularyItem = {
      id: `custom_${Date.now()}`,
      wordOrPhrase: newWordTerm.trim(),
      translation: newWordTr.trim(),
      phoneticApprox: newWordPhonetic.trim() || undefined,
      category: newWordCategory.trim() || 'Minhas Frases',
      naturalSentence1: newWordSentence.trim() || newWordTerm.trim(),
      naturalSentence1Tr: newWordSentenceTr.trim() || newWordTr.trim(),
      naturalSentence2: '',
      naturalSentence2Tr: '',
      commonCollocation: 'Uso diário',
      masteryStatus: 'aprendendo',
      isEssential50: false,
    };

    saveCustomLearnedItem(language, newItem);
    setCustomItems((prev) => [newItem, ...prev]);

    // Inicializar no Anki Deck como novo
    const updatedDeck = { ...ankiDeck, [newItem.id]: createDefaultAnkiData() };
    setAnkiDeck(updatedDeck);
    saveAnkiDeck(language, updatedDeck);

    // Resetar campos
    setNewWordTerm('');
    setNewWordTr('');
    setNewWordPhonetic('');
    setNewWordSentence('');
    setNewWordSentenceTr('');
    setIsAddModalOpen(false);
    onAddXp(30);
  };

  const handleDeleteCustomItem = (id: string) => {
    removeCustomLearnedItem(language, id);
    setCustomItems((prev) => prev.filter((it) => it.id !== id));
    const nextDeck = { ...ankiDeck };
    delete nextDeck[id];
    setAnkiDeck(nextDeck);
  };

  // Resetar baralho para revisão completa
  const handleResetAnkiDeck = () => {
    if (window.confirm('Deseja resetar o progresso de repetição espaçada deste idioma? Todos os cartões voltarão ao estado inicial.')) {
      const resetDeck: Record<string, AnkiCardData> = {};
      allItems.forEach((it) => {
        resetDeck[it.id] = createDefaultAnkiData();
      });
      setAnkiDeck(resetDeck);
      saveAnkiDeck(language, resetDeck);
      buildAnkiQueue();
    }
  };

  // Geração de Novo Lote Inteligente com IA ou Fallback Nativo
  const handleGenerateBatch = async () => {
    setIsGeneratingBatch(true);
    setBatchNotification(null);
    try {
      const response = await fetch('/api/generate-vocab-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          level,
          batchSize,
          theme: batchTheme,
          existingWords: allItems.map((i) => i.wordOrPhrase),
        }),
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.items) && data.items.length > 0) {
        saveMultipleCustomLearnedItems(language, data.items);
        const updatedCustom = getCustomLearnedItems(language);
        setCustomItems(updatedCustom);
        const updatedDeck = getSavedAnkiDeck(language);
        setAnkiDeck(updatedDeck);
        onAddXp(data.items.length * 5);
        setBatchNotification(
          `Excelente! Lote calibrado com ${data.items.length} novas expressões e contrações nativas foi integrado ao seu baralho.`
        );
        setIsBatchModalOpen(false);
        setCramMode(false);
        setTimeout(() => {
          buildAnkiQueue();
        }, 100);
      } else {
        alert('Não foi possível gerar novos termos no momento. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro ao gerar lote de vocabulário:', err);
      alert('Falha na comunicação ao gerar o lote de vocabulário.');
    } finally {
      setIsGeneratingBatch(false);
    }
  };

  // -------------------------------------------------------------
  // MODO CLÁSSICO DE CARTÕES
  // -------------------------------------------------------------
  const filteredItems = allItems.filter((item) => {
    if (onlyEssential50 && !item.isEssential50) return false;
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        item.wordOrPhrase.toLowerCase().includes(term) ||
        item.translation.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const currentClassicItem = filteredItems[currentIndex] || filteredItems[0];
  const categories = Array.from(new Set(allItems.map((i) => i.category)));

  return (
    <div className="space-y-6 max-w-7xl w-full mx-auto pb-12">
      <GuidedStepBanner currentModule="vocabulary" onNavigate={onNavigate} onAddXp={onAddXp} />

      {/* Cabeçalho Principal */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                  Repetição Espaçada SRS
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                  {language} • Nível {level}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Controle de Memória AnkiDroid (SM-2)
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Palavras e expressões retidas na memória de longo prazo através do algoritmo de repetição espaçada.
              </p>
            </div>
          </div>

          {/* Os 3 Contadores Icônicos do AnkiDroid */}
          <div className="flex items-center gap-2">
            {/* Azul: Novos */}
            <div
              className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-center"
              title="Novos Cartões não estudados"
            >
              <span className="text-[10px] uppercase font-bold text-blue-700 block">Novos</span>
              <span className="text-base font-black text-blue-900">{ankiCounts.newCount}</span>
            </div>

            {/* Vermelho: A Aprender / Erros */}
            <div
              className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-center"
              title="Cartões em fase de aprendizado ou com falhas"
            >
              <span className="text-[10px] uppercase font-bold text-rose-700 block">Aprender</span>
              <span className="text-base font-black text-rose-900">{ankiCounts.learningCount}</span>
            </div>

            {/* Verde: A Revisar hoje */}
            <div
              className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center"
              title="Cartões programados para revisão hoje"
            >
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">A Revisar</span>
              <span className="text-base font-black text-emerald-900">{ankiCounts.dueCount}</span>
            </div>
          </div>
        </div>

        {/* Abas e Controles de Velocidade (Alinhado em Mobile, Tablet e PC) */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setActiveTab('anki')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'anki'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>AnkiDroid (SRS)</span>
            </button>

            <button
              onClick={() => setActiveTab('contractions')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'contractions'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100'
              }`}
            >
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>Contrações</span>
            </button>

            <button
              onClick={() => setActiveTab('dictation')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'dictation'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-900 border border-purple-200/80 hover:bg-purple-100'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Ditado</span>
            </button>

            <button
              onClick={() => setActiveTab('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === 'cards'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>Explorador</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('test');
                setShowDetails(false);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'test'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Teste Reverso
            </button>

            <button
              onClick={() => setActiveTab('deckList')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'deckList'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Baralho ({allItems.length})
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsBatchModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1.5 shadow-2xs transition-colors"
              title="Gerar um lote de 10 a 20 expressões nativas calibradas para retenção sólida"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>+ Lote Nativo com IA</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Frase Manual</span>
            </button>

            {/* Controle de Velocidade do Áudio */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-bold">
              <button
                onClick={() => setSpeechRate(0.8)}
                className={`px-2 py-1 rounded ${
                  speechRate === 0.8 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                0.8x
              </button>
              <button
                onClick={() => setSpeechRate(1.0)}
                className={`px-2 py-1 rounded ${
                  speechRate === 1.0 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                1.0x
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notificação de Novo Lote Gerado */}
      {batchNotification && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between text-xs font-bold animate-fadeIn shadow-2xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{batchNotification}</span>
          </div>
          <button
            onClick={() => setBatchNotification(null)}
            className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-xs transition-colors"
          >
            ✕ Fechar
          </button>
        </div>
      )}

      {/* ============================================================= */}
      {/* ABA 1: MODO ANKIDROID SRS (REPETIÇÃO ESPAÇADA AUTÊNTICA) */}
      {/* ============================================================= */}
      {activeTab === 'anki' && (
        <div className="space-y-4">
          {!isSessionComplete && currentAnkiItem ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Barra de Status do Cartão Anki */}
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">
                    Cartão {ankiQueueIndex + 1} de {ankiSessionQueue.length}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="font-medium text-slate-600">{currentAnkiItem.category}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      currentAnkiCardData.state === 'new'
                        ? 'bg-blue-100 text-blue-800'
                        : currentAnkiCardData.state === 'learning'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {currentAnkiCardData.state === 'new'
                      ? 'Novo Cartão'
                      : currentAnkiCardData.state === 'learning'
                      ? 'Em Aprendizagem'
                      : `Revisão (${currentAnkiCardData.intervalDays}d)`}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    Facilidade: {(currentAnkiCardData.easeFactor * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Corpo do Cartão (Frente e Verso) */}
              <div className="p-6 sm:p-10 space-y-6">
                {/* Frente do Cartão */}
                <div className="text-center py-4 space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    FRENTE DO CARTÃO (COMO SE DIZ OU O QUE SIGNIFICA)
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {currentAnkiItem.wordOrPhrase}
                  </h2>
                  {currentAnkiItem.phoneticApprox && (
                    <p className="text-sm font-medium text-slate-400">
                      Pronúncia: [{currentAnkiItem.phoneticApprox}]
                    </p>
                  )}

                  <div className="flex justify-center items-center gap-2 pt-1">
                    <button
                      onClick={() => handlePlayAudio(currentAnkiItem.wordOrPhrase)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                      Ouvir Pronúncia (R)
                    </button>
                  </div>
                </div>

                {/* Divisor do Anki */}
                {isAnswerRevealed && <div className="border-t-2 border-dashed border-slate-200" />}

                {/* Verso do Cartão (Resposta Revelada) */}
                {isAnswerRevealed ? (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="text-center space-y-1">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                        Tradução Natural:
                      </span>
                      <div className="text-2xl sm:text-3xl font-extrabold text-indigo-900">
                        "{currentAnkiItem.translation}"
                      </div>
                    </div>

                    {/* OS 4 BOTÕES DO ANKIDROID (NO CAMPO DE VISÃO IMEDIATO) */}
                    <div className="pt-1">
                      <div className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Como foi lembrar este termo? (Selecione o intervalo ou use teclas 1, 2, 3 ou 4):
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {/* 1. ERREI (Again) */}
                        <button
                          onClick={() => handleAnkiRate('again')}
                          className="py-3 px-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold transition-all shadow-xs flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                        >
                          <span className="text-sm">Errei</span>
                          <span className="text-[11px] font-medium opacity-90">
                            {intervalPreviews.again} <span className="opacity-75">[1]</span>
                          </span>
                        </button>

                        {/* 2. DIFÍCIL (Hard) */}
                        <button
                          onClick={() => handleAnkiRate('hard')}
                          className="py-3 px-2 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-bold transition-all shadow-xs flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                        >
                          <span className="text-sm">Difícil</span>
                          <span className="text-[11px] font-medium opacity-90">
                            {intervalPreviews.hard} <span className="opacity-75">[2]</span>
                          </span>
                        </button>

                        {/* 3. BOM (Good) */}
                        <button
                          onClick={() => handleAnkiRate('good')}
                          className="py-3 px-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold transition-all shadow-xs flex flex-col items-center justify-center gap-0.5 cursor-pointer ring-2 ring-blue-400/40"
                        >
                          <span className="text-sm">Bom</span>
                          <span className="text-[11px] font-medium opacity-90">
                            {intervalPreviews.good} <span className="opacity-75">[3 / Espaço]</span>
                          </span>
                        </button>

                        {/* 4. FÁCIL (Easy) */}
                        <button
                          onClick={() => handleAnkiRate('easy')}
                          className="py-3 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold transition-all shadow-xs flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                        >
                          <span className="text-sm">Fácil</span>
                          <span className="text-[11px] font-medium opacity-90">
                            {intervalPreviews.easy} <span className="opacity-75">[4]</span>
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Frases Reais no Contexto */}
                    <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Exemplos no Contexto Real:
                      </span>

                      <div className="space-y-2.5">
                        <div className="p-3 bg-white rounded-lg border border-slate-200/60 flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <p className="text-sm font-bold text-slate-900">
                              {currentAnkiItem.naturalSentence1}
                            </p>
                            <p className="text-xs text-slate-500 font-medium">
                              {currentAnkiItem.naturalSentence1Tr}
                            </p>
                          </div>
                          <button
                            onClick={() => handlePlayAudio(currentAnkiItem.naturalSentence1)}
                            className="p-1 text-slate-400 hover:text-slate-800 shrink-0"
                          >
                            <Volume2 className="w-4 h-4 text-slate-500" />
                          </button>
                        </div>

                        {currentAnkiItem.naturalSentence2 && (
                          <div className="p-3 bg-white rounded-lg border border-slate-200/60 flex items-start justify-between gap-2">
                            <div className="space-y-0.5">
                              <p className="text-sm font-bold text-slate-900">
                                {currentAnkiItem.naturalSentence2}
                              </p>
                              <p className="text-xs text-slate-500 font-medium">
                                {currentAnkiItem.naturalSentence2Tr}
                              </p>
                            </div>
                            <button
                              onClick={() => handlePlayAudio(currentAnkiItem.naturalSentence2)}
                              className="p-1 text-slate-400 hover:text-slate-800 shrink-0"
                            >
                              <Volume2 className="w-4 h-4 text-slate-500" />
                            </button>
                          </div>
                        )}
                      </div>

                      {currentAnkiItem.commonCollocation && (
                        <div className="text-xs text-slate-600 pt-1">
                          <span className="font-bold text-slate-700">Combinação Comum:</span>{' '}
                          <span className="italic">{currentAnkiItem.commonCollocation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Botão Principal: Mostrar Resposta */
                  <div className="text-center pt-4">
                    <button
                      onClick={() => setIsAnswerRevealed(true)}
                      className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-black text-base shadow-xs transition-all w-full sm:w-auto min-w-[280px]"
                    >
                      Mostrar Resposta <span className="text-xs opacity-80 font-normal ml-1">(Espaço)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* TELA DE PARABÉNS / BARALHO DO DIA ZERADO (IDÊNTICO AO ANKIDROID) */
            <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-6 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Parabéns! Fila do Dia Concluída!
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Você concluiu todas as revisões programadas pelo algoritmo de repetição espaçada para hoje com absorção sólida!
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase">Revisões nesta sessão</span>
                  <span className="text-lg font-black text-slate-900">{reviewedInSessionCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase">Novos no Baralho</span>
                  <span className="text-lg font-black text-blue-600">{ankiCounts.newCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase">Total de Expressões</span>
                  <span className="text-lg font-black text-slate-900">{allItems.length}</span>
                </div>
              </div>

              {/* Ações Inteligentes para Continuar sem Bloqueios */}
              <div className="max-w-xl mx-auto space-y-3 pt-2">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {ankiCounts.newCount > 0 ? (
                    <button
                      onClick={() => {
                        setCramMode(false);
                        setReviewedInSessionCount(0);
                        buildAnkiQueue();
                      }}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Próximo Lote ({Math.min(batchSize, ankiCounts.newCount)} Expressões)
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsBatchModalOpen(true)}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Gerar Novo Lote (+15 com IA)
                    </button>
                  )}

                  <button
                    onClick={() => setActiveTab('contractions')}
                    className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 font-bold text-xs transition-colors flex items-center gap-2"
                  >
                    <MessageSquareQuote className="w-4 h-4 text-amber-600" />
                    Fazer Desafio de Contrações
                  </button>

                  <button
                    onClick={() => setActiveTab('dictation')}
                    className="px-4 py-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 hover:bg-purple-100 font-bold text-xs transition-colors flex items-center gap-2"
                  >
                    <Headphones className="w-4 h-4 text-purple-600" />
                    Treinar Ouvido Nativo
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setCramMode(true);
                      setReviewedInSessionCount(0);
                      buildAnkiQueue();
                    }}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold"
                  >
                    Estudo Antecipado (Revisar Baralho Completo)
                  </button>

                  <button
                    onClick={handleResetAnkiDeck}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs"
                  >
                    Resetar Progresso
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dica do Algoritmo AnkiDroid */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/70 text-xs text-blue-950 flex items-start gap-3">
            <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="block font-bold">Como funciona o espaçamento AnkiDroid:</strong>
              <span>
                Quando você clica em <strong>Errei</strong>, a palavra reaparece imediatamente para reforço. Ao clicar em <strong>Bom</strong> ou <strong>Fácil</strong>, o intervalo multiplica-se exponencialmente (1 dia → 3 dias → 8 dias → 21 dias), transferindo o vocabulário para a memória permanente antes da curva do esquecimento.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* ABA: DESAFIO DE CONTRAÇÕES & EXPRESSÕES NATIVAS */}
      {/* ============================================================= */}
      {activeTab === 'contractions' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          {contractionIndex < CONTRACTION_CHALLENGES.length ? (
            (() => {
              const currentChallenge = CONTRACTION_CHALLENGES[contractionIndex];
              const isCorrect = selectedContractionOption === currentChallenge.correctNativePhrase;

              return (
                <div className="space-y-6">
                  {/* Topo do Exercício */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                        Expressões & Contrações Nativas
                      </span>
                      <h2 className="text-lg font-black text-slate-900 mt-1">
                        Desafio {contractionIndex + 1} de {CONTRACTION_CHALLENGES.length}
                      </h2>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
                      Pontuação: {contractionScore} pts
                    </div>
                  </div>

                  {/* Situação Contextualizada */}
                  <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/70 space-y-3">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                      Cenário do Cotidiano:
                    </span>
                    <p className="text-base sm:text-lg font-medium text-slate-900 leading-snug">
                      {currentChallenge.situationPrompt}
                    </p>
                    <div className="pt-2 border-t border-amber-200/50 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>Como seria em inglês formal/literal:</span>
                      <span className="font-semibold text-slate-700 italic">"{currentChallenge.formalOrLiteral}"</span>
                    </div>
                  </div>

                  {/* Pergunta */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-800">
                      Como um falante nativo expressaria isso naturalmente no dia a dia?
                    </h3>

                    {/* Opções de Resposta */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentChallenge.options.map((opt, idx) => {
                        let btnStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800';
                        if (isContractionAnswered) {
                          if (opt === currentChallenge.correctNativePhrase) {
                            btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-400';
                          } else if (opt === selectedContractionOption) {
                            btnStyle = 'border-rose-400 bg-rose-50 text-rose-900 line-through';
                          } else {
                            btnStyle = 'opacity-40 border-slate-200';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            disabled={isContractionAnswered}
                            onClick={() => {
                              setSelectedContractionOption(opt);
                              setIsContractionAnswered(true);
                              if (opt === currentChallenge.correctNativePhrase) {
                                setContractionScore((s) => s + 25);
                                onAddXp(25);
                              }
                            }}
                            className={`p-4 rounded-xl border text-left text-sm font-medium transition-all ${btnStyle}`}
                          >
                            <span className="font-mono text-xs text-slate-400 mr-2 font-bold">
                              {String.fromCharCode(65 + idx)}.
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Feedback e Explicação Cultural */}
                  {isContractionAnswered && (
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-black uppercase px-2.5 py-1 rounded-full ${
                              isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {isCorrect ? 'Correto! Expressão Autêntica' : 'Atenção ao Uso Real'}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            Pronúncia e ritmo conectado
                          </span>
                        </div>

                        <button
                          onClick={() => handlePlayAudio(currentChallenge.audioSnippet)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Ouvir Frase Completa</span>
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        <strong className="text-slate-900 block mb-1">Por que nativos usam essa expressão:</strong>
                        {currentChallenge.explanation}
                      </p>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            setSelectedContractionOption(null);
                            setIsContractionAnswered(false);
                            setContractionIndex((prev) => prev + 1);
                          }}
                          className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <span>Próximo Desafio</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="text-center py-10 space-y-5">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-2xl font-black text-slate-900">Desafios de Contrações Concluídos!</h3>
                <p className="text-sm text-slate-600">
                  Você concluiu todas as expressões do ciclo atual. Pontuação final: <strong>{contractionScore} pontos</strong>.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setContractionIndex(0);
                    setSelectedContractionOption(null);
                    setIsContractionAnswered(false);
                    setContractionScore(0);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm transition-colors"
                >
                  Reiniciar Desafio
                </button>
                <button
                  onClick={() => setActiveTab('dictation')}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm transition-colors"
                >
                  Ir para Ditado Conectado
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* ABA: DITADO AUDITIVO CONECTADO (LISTENING NATIVO) */}
      {/* ============================================================= */}
      {activeTab === 'dictation' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          {dictationIndex < LISTENING_DICTATION_ITEMS.length ? (
            (() => {
              const currentDict = LISTENING_DICTATION_ITEMS[dictationIndex];

              const handleCheckDictation = () => {
                const cleanInput = dictationInput.trim().toLowerCase().replace(/[.,!?'"]/g, '');
                const cleanExpected = currentDict.missingWord.toLowerCase().replace(/[.,!?'"]/g, '');

                if (cleanInput === cleanExpected) {
                  setDictationFeedback('correct');
                  setDictationScore((s) => s + 25);
                  onAddXp(25);
                } else {
                  setDictationFeedback('wrong');
                }
              };

              const handleNextDictation = () => {
                setDictationInput('');
                setDictationFeedback(null);
                setShowDictationHint(false);
                setShowDictationAnswer(false);
                setDictationIndex((p) => p + 1);
              };

              return (
                <div className="space-y-6">
                  {/* Topo do Exercício */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                        Ditado & Ouvido Nativo
                      </span>
                      <h2 className="text-lg font-black text-slate-900 mt-1">
                        Áudio {dictationIndex + 1} de {LISTENING_DICTATION_ITEMS.length}
                      </h2>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-xs font-bold text-purple-900">
                      Pontuação: {dictationScore} pts
                    </div>
                  </div>

                  {/* Player de Áudio Duplo (Natural vs Analítico) */}
                  <div className="p-6 rounded-2xl bg-purple-50/40 border border-purple-200/70 text-center space-y-4">
                    <p className="text-xs font-bold text-purple-800 uppercase tracking-wider">
                      Ouça a frase falada por um nativo e preencha a contração ou termo que falta:
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        id="btn-dictation-play-normal"
                        onClick={() => handlePlayAudio(currentDict.audioPrompt)}
                        className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                      >
                        <Volume2 className="w-5 h-5 text-amber-300" />
                        <span>Ouvir Velocidade Real (1.0x)</span>
                      </button>

                      <button
                        id="btn-dictation-play-slow"
                        onClick={() => AudioSynthesizer.getInstance().speak(currentDict.audioPrompt, language, 0.75)}
                        className="px-4 py-3 rounded-xl bg-white border border-purple-200 text-purple-900 hover:bg-purple-50 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Headphones className="w-4 h-4 text-purple-600" />
                        <span>Ouvir Pausado (0.75x)</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 italic">
                      "{currentDict.targetTranslation}"
                    </p>
                  </div>

                  {/* Frase com Lacuna para Preenchimento */}
                  <div className="space-y-4">
                    <div className="text-center text-lg sm:text-xl font-bold text-slate-800 py-3 px-4 bg-slate-50 rounded-xl border border-slate-200">
                      {showDictationAnswer ? (
                        <span>
                          {currentDict.blankPrompt.split('_____').map((part, i, arr) => (
                            <React.Fragment key={i}>
                              {part}
                              {i < arr.length - 1 && (
                                <span className="text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-lg border border-purple-300 font-black underline mx-1 shadow-2xs">
                                  {currentDict.missingWord}
                                </span>
                              )}
                            </React.Fragment>
                          ))}
                        </span>
                      ) : (
                        currentDict.blankPrompt
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                      <input
                        type="text"
                        placeholder="Digite a palavra ou contração que falta..."
                        value={dictationInput}
                        disabled={dictationFeedback === 'correct'}
                        onChange={(e) => {
                          setDictationInput(e.target.value);
                          if (dictationFeedback === 'wrong') setDictationFeedback(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && dictationFeedback !== 'correct') {
                            handleCheckDictation();
                          }
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-center font-bold text-base text-slate-900 focus:outline-hidden focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                      />

                      <button
                        onClick={handleCheckDictation}
                        disabled={!dictationInput.trim() || dictationFeedback === 'correct'}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-sm transition-colors shrink-0"
                      >
                        Verificar
                      </button>
                    </div>
                  </div>

                  {/* Barra de Apoio (Dica & Opção de Ver Resposta) */}
                  <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
                    {!showDictationHint ? (
                      <button
                        onClick={() => setShowDictationHint(true)}
                        className="text-slate-500 hover:text-slate-800 underline flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                        <span>Precisa de uma dica?</span>
                      </button>
                    ) : (
                      <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-medium inline-flex items-center gap-1.5">
                        <span>💡 Dica: {currentDict.hint}</span>
                      </div>
                    )}

                    <span className="text-slate-300 hidden sm:inline">•</span>

                    {!showDictationAnswer ? (
                      <button
                        onClick={() => setShowDictationAnswer(true)}
                        className="text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1.5 cursor-pointer bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Resposta</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowDictationAnswer(false)}
                        className="text-slate-500 hover:text-slate-700 font-medium flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Ocultar Resposta</span>
                      </button>
                    )}
                  </div>

                  {/* Feedback */}
                  {dictationFeedback && (
                    <div
                      className={`p-5 rounded-xl border text-center space-y-3 animate-fadeIn ${
                        dictationFeedback === 'correct'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                          : 'bg-rose-50 border-rose-200 text-rose-950'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2 font-bold text-sm">
                        {dictationFeedback === 'correct' ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            <span>Perfeito! Você reconheceu a contração exata: "{currentDict.missingWord}"</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                            <span>Não é exatamente isso. Tente escutar novamente ou veja a resposta abaixo!</span>
                          </>
                        )}
                      </div>

                      {dictationFeedback === 'wrong' && !showDictationAnswer && (
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                          <button
                            onClick={() => setShowDictationAnswer(true)}
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Ver Resposta Correta</span>
                          </button>
                          <button
                            onClick={() => setDictationFeedback(null)}
                            className="px-4 py-2 rounded-xl bg-white border border-rose-200 text-rose-800 hover:bg-rose-100 font-bold text-xs transition-colors"
                          >
                            Tentar Digitar Novamente
                          </button>
                        </div>
                      )}

                      {dictationFeedback === 'correct' && (
                        <button
                          onClick={handleNextDictation}
                          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-colors inline-flex items-center gap-1.5"
                        >
                          <span>Próximo Áudio</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Card de Resposta Revelada */}
                  {showDictationAnswer && (
                    <div className="p-5 rounded-2xl bg-purple-50/70 border-2 border-purple-200 space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-purple-200 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            Resposta Correta
                          </span>
                          <span className="text-xl font-black text-purple-950 font-mono bg-white px-3.5 py-1 rounded-xl border border-purple-300 shadow-2xs">
                            {currentDict.missingWord}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => AudioSynthesizer.getInstance().speak(currentDict.missingWord, language, 0.85)}
                            className="px-3 py-1.5 rounded-lg bg-white border border-purple-300 text-purple-800 hover:bg-purple-100 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                            title="Ouvir apenas a contração"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                            <span>Ouvir Palavra</span>
                          </button>
                          <button
                            onClick={() => handlePlayAudio(currentDict.audioPrompt)}
                            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                            title="Ouvir a frase inteira falada por nativo"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                            <span>Ouvir Frase Completa</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 text-left text-xs sm:text-sm text-slate-700">
                        <div className="p-3 bg-white rounded-xl border border-purple-100 space-y-1">
                          <div className="text-slate-900 font-bold text-base">
                            {currentDict.blankPrompt.split('_____').map((part, i, arr) => (
                              <React.Fragment key={i}>
                                {part}
                                {i < arr.length - 1 && (
                                  <span className="text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md border border-purple-300 font-black mx-1">
                                    {currentDict.missingWord}
                                  </span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                          <p className="text-slate-500 italic text-xs">
                            "{currentDict.targetTranslation}"
                          </p>
                        </div>

                        <p className="text-purple-900 text-xs sm:text-sm">
                          <strong className="text-purple-950 font-bold">Por que é assim: </strong>
                          {currentDict.hint}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between flex-wrap gap-2 border-t border-purple-200">
                        <button
                          onClick={() => {
                            setDictationInput(currentDict.missingWord);
                            setDictationFeedback(null);
                          }}
                          className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1.5 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Copiar para o campo</span>
                        </button>

                        <button
                          onClick={handleNextDictation}
                          className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-xs ml-auto"
                        >
                          <span>Avançar para o Próximo Áudio</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="text-center py-10 space-y-5">
              <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-2xl font-black text-slate-900">Ditados Auditivos Concluídos!</h3>
                <p className="text-sm text-slate-600">
                  Excelente calibração do seu ouvido com a fala conectada nativa. Pontuação final: <strong>{dictationScore} pontos</strong>.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setDictationIndex(0);
                    setDictationInput('');
                    setDictationFeedback(null);
                    setShowDictationHint(false);
                    setShowDictationAnswer(false);
                    setDictationScore(0);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm transition-colors"
                >
                  Reiniciar Ditados
                </button>
                <button
                  onClick={() => setActiveTab('anki')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-colors"
                >
                  Voltar ao Baralho SRS
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* ABA 2: EXPLORADOR DE CARTÕES TRADICIONAL */}
      {/* ============================================================= */}
      {activeTab === 'cards' && currentClassicItem && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Bloco: {currentClassicItem.category} • Expressão {currentIndex + 1} de {filteredItems.length}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                (ankiDeck[currentClassicItem.id]?.state || 'new') === 'review'
                  ? 'bg-emerald-100 text-emerald-800'
                  : (ankiDeck[currentClassicItem.id]?.state || 'new') === 'learning'
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {(ankiDeck[currentClassicItem.id]?.state || 'new') === 'review'
                ? `Dominada (${ankiDeck[currentClassicItem.id]?.intervalDays || 1}d)`
                : (ankiDeck[currentClassicItem.id]?.state || 'new') === 'learning'
                ? 'Em Aprendizagem'
                : 'Novo Cartão'}
            </span>
          </div>

          <div className="text-center py-4 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {currentClassicItem.wordOrPhrase}
            </h2>
            {currentClassicItem.phoneticApprox && (
              <p className="text-sm font-medium text-slate-400 mt-1">
                Pronúncia aproximada: [{currentClassicItem.phoneticApprox}]
              </p>
            )}
            <p className="text-lg font-bold text-indigo-700 mt-2">
              {currentClassicItem.translation}
            </p>

            <div className="pt-2 flex justify-center items-center gap-3">
              <button
                onClick={() => handlePlayAudio(currentClassicItem.wordOrPhrase)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-sm shadow-xs transition-all active:scale-95"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
                Ouvir Áudio ({speechRate}x)
              </button>
            </div>
          </div>

          {/* Exemplos Naturais */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Exemplos em Conversas Reais:
            </span>

            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2 p-3 bg-white rounded-lg border border-slate-200/60">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">
                    1. {currentClassicItem.naturalSentence1}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {currentClassicItem.naturalSentence1Tr}
                  </p>
                </div>
                <button
                  onClick={() => handlePlayAudio(currentClassicItem.naturalSentence1)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {currentClassicItem.naturalSentence2 && (
                <div className="flex items-start justify-between gap-2 p-3 bg-white rounded-lg border border-slate-200/60">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">
                      2. {currentClassicItem.naturalSentence2}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      {currentClassicItem.naturalSentence2Tr}
                    </p>
                  </div>
                  <button
                    onClick={() => handlePlayAudio(currentClassicItem.naturalSentence2)}
                    className="p-1.5 text-slate-400 hover:text-slate-800 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navegação */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
              disabled={currentIndex === 0}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentIndex((p) => Math.min(filteredItems.length - 1, p + 1))}
              disabled={currentIndex === filteredItems.length - 1}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-40 flex items-center gap-1"
            >
              <span>Próxima</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* ABA 3: TESTE ATIVO REVERSO */}
      {/* ============================================================= */}
      {activeTab === 'test' && currentClassicItem && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="text-center py-6 space-y-4">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Como você diz em {language}:
            </span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900">
              "{currentClassicItem.translation}"
            </div>
            <p className="text-xs text-slate-500">
              Fale em voz alta antes de clicar para revelar a expressão original!
            </p>

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
            >
              {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showDetails ? 'Ocultar Resposta' : 'Revelar Resposta Original'}
            </button>

            {showDetails && (
              <div className="pt-4 space-y-3 animate-fadeIn">
                <div className="text-3xl font-black text-blue-700">
                  {currentClassicItem.wordOrPhrase}
                </div>
                {currentClassicItem.phoneticApprox && (
                  <div className="text-xs text-slate-400">[{currentClassicItem.phoneticApprox}]</div>
                )}
                <button
                  onClick={() => handlePlayAudio(currentClassicItem.wordOrPhrase)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  Ouvir Pronúncia
                </button>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                setCurrentIndex((p) => Math.max(0, p - 1));
                setShowDetails(false);
              }}
              disabled={currentIndex === 0}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              onClick={() => {
                setCurrentIndex((p) => Math.min(filteredItems.length - 1, p + 1));
                setShowDetails(false);
              }}
              disabled={currentIndex === filteredItems.length - 1}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-40 flex items-center gap-1"
            >
              <span>Próxima</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* ABA 4: GERENCIADOR DO BARALHO & PALAVRAS APRENDIDAS */}
      {/* ============================================================= */}
      {activeTab === 'deckList' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Banco de Palavras & Frases Aprendidas
              </h2>
              <p className="text-xs text-slate-500">
                Acompanhe o intervalo de retenção de cada expressão gerenciada pelo algoritmo SM-2
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar no baralho..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 w-48"
                />
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Nova Frase
              </button>
            </div>
          </div>

          {/* Tabela de Palavras do Baralho */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Palavra / Expressão</th>
                  <th className="py-2.5 px-3">Tradução</th>
                  <th className="py-2.5 px-3">Categoria</th>
                  <th className="py-2.5 px-3 text-center">Intervalo</th>
                  <th className="py-2.5 px-3 text-center">Facilidade</th>
                  <th className="py-2.5 px-3 text-center">Status Anki</th>
                  <th className="py-2.5 px-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const cardData = ankiDeck[item.id] || createDefaultAnkiData();
                  const isCustom = item.id.startsWith('custom_');

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                        <span>{item.wordOrPhrase}</span>
                        {item.phoneticApprox && (
                          <span className="text-[10px] text-slate-400 font-normal">
                            [{item.phoneticApprox}]
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 font-medium">{item.translation}</td>
                      <td className="py-2.5 px-3 text-slate-500">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px]">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700">
                        {cardData.intervalDays === 0 ? '< 1 dia' : `${cardData.intervalDays} dias`}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                        {(cardData.easeFactor * 100).toFixed(0)}%
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            cardData.state === 'review'
                              ? 'bg-emerald-100 text-emerald-800'
                              : cardData.state === 'learning'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {cardData.state === 'review'
                            ? 'Revisão'
                            : cardData.state === 'learning'
                            ? 'Aprender'
                            : 'Novo'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handlePlayAudio(item.wordOrPhrase)}
                            title="Ouvir áudio"
                            className="p-1 text-slate-400 hover:text-blue-600 rounded"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          {isCustom && (
                            <button
                              onClick={() => handleDeleteCustomItem(item.id)}
                              title="Excluir"
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: ADICIONAR NOVA PALAVRA OU FRASE AO BARALHO ANKI */}
      {/* ============================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  +
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Adicionar Frase ao Baralho Anki ({language})
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕ Fechar
              </button>
            </div>

            <form onSubmit={handleAddNewItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Palavra ou Expressão no Idioma ({language}) *
                </label>
                <input
                  type="text"
                  required
                  placeholder='Ex: "To hit the ground running"'
                  value={newWordTerm}
                  onChange={(e) => setNewWordTerm(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-600 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tradução em Português *
                </label>
                <input
                  type="text"
                  required
                  placeholder='Ex: "Começar algo a todo vapor / com máxima energia"'
                  value={newWordTr}
                  onChange={(e) => setNewWordTr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-600 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Pronúncia Aproximada (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: tu rít dê gráund rânin"
                    value={newWordPhonetic}
                    onChange={(e) => setNewWordPhonetic(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoria / Tag</label>
                  <input
                    type="text"
                    placeholder="Ex: Trabalho, Série, Viagem"
                    value={newWordCategory}
                    onChange={(e) => setNewWordCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Frase de Exemplo no Contexto (Opcional)
                </label>
                <input
                  type="text"
                  placeholder='Ex: "We need to hit the ground running on Monday."'
                  value={newWordSentence}
                  onChange={(e) => setNewWordSentence(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tradução da Frase de Exemplo
                </label>
                <input
                  type="text"
                  placeholder='Ex: "Precisamos começar o projeto a todo vapor na segunda-feira."'
                  value={newWordSentenceTr}
                  onChange={(e) => setNewWordSentenceTr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs"
                >
                  Salvar no Baralho Anki (+30 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: GERAR NOVO LOTE NATIVO COM IA (RETENÇÃO SÓLIDA) */}
      {/* ============================================================= */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100 animate-scaleUp">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Gerar Novo Lote Nativo
                    </h3>
                    <p className="text-xs text-slate-500">
                      Expressões, termos e contrações do dia a dia ({language})
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => !isGeneratingBatch && setIsBatchModalOpen(false)}
                disabled={isGeneratingBatch}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold disabled:opacity-30"
              >
                ✕ Fechar
              </button>
            </div>

            {/* Aviso Científico sobre Absorção Sólida */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-3">
              <Brain className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="block font-bold">Diretriz de Absorção Sólida:</strong>
                <p className="text-slate-700 leading-relaxed">
                  Para não esquecer rapidamente nem sobrecarregar o cérebro, o aprendizado deve ser feito em blocos controlados de <strong>10 a 20 termos</strong>. A repetição espaçada irá intercalar esses termos ao longo dos próximos dias.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Seletor de Tamanho do Lote */}
              <div>
                <label className="block font-bold text-slate-800 mb-2">
                  Quantidade no Lote (Absorção Calibrada):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 15, 20].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      disabled={isGeneratingBatch}
                      onClick={() => setBatchSize(qty)}
                      className={`py-2.5 px-3 rounded-xl font-bold border transition-all text-center ${
                        batchSize === qty
                          ? 'border-amber-500 bg-amber-50 text-amber-950 ring-2 ring-amber-400'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm block">{qty} palavras</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {qty === 10 ? 'Foco Rápido' : qty === 15 ? 'Equilibrado' : 'Avançado'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tema ou Foco Nativo */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Foco do Vocabulário Nativo:
                </label>
                <select
                  disabled={isGeneratingBatch}
                  value={batchTheme}
                  onChange={(e) => setBatchTheme(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-medium text-xs text-slate-800 focus:outline-hidden focus:border-amber-500"
                >
                  <option value="Contrações & Expressões Nativas do Cotidiano">
                    Contrações & Conexões da Fala Cotidiana (gonna, gotta, wanna...)
                  </option>
                  <option value="Expressões Idiomáticas Nativas & Phrasal Verbs">
                    Expressões Idiomáticas & Phrasal Verbs das Ruas
                  </option>
                  <option value="Conversação Prática em Viagens, Cafés & Bares">
                    Conversação Prática em Viagens, Cafés & Bares
                  </option>
                  <option value="Ambiente de Trabalho Moderno & Reuniões Informais">
                    Ambiente de Trabalho Moderno & Networking
                  </option>
                  <option value="Gírias Contemporâneas & Reações Espontâneas">
                    Gírias Contemporâneas & Reações Espontâneas
                  </option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={isGeneratingBatch}
                onClick={() => setIsBatchModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isGeneratingBatch}
                onClick={handleGenerateBatch}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
              >
                {isGeneratingBatch ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gerando Termos Nativos...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Gerar Lote de {batchSize} Expressões</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
