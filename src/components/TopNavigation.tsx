import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  Flame,
  Zap,
  Volume2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  BookOpen,
  MessageSquare,
  Headphones,
  Timer,
  Mic,
  Brain,
  Radio,
  Home,
  LayoutGrid,
  CheckCircle2,
  Minimize2,
  Maximize2,
  User,
  TrendingUp,
  LogOut,
  Smartphone,
} from 'lucide-react';
import { TargetLanguage, FluencyLevel, ModuleId } from '../types';
import { SUPPORTED_LANGUAGES, FLUENCY_LEVELS } from '../data/curriculum';
import { useAuth } from '../context/AuthContext';
import { getSavedGuidedStep, getGuidedStepData } from '../services/guidedSequence';

interface TopNavigationProps {
  currentLanguage: TargetLanguage;
  onSelectLanguage: (lang: TargetLanguage) => void;
  currentLevel: FluencyLevel;
  onSelectLevel: (lvl: FluencyLevel) => void;
  activeModule: ModuleId;
  onSelectModule: (mod: ModuleId) => void;
  streakDays: number;
  totalXp: number;
  isAudioReady: boolean;
  onOpenVoiceCoach?: () => void;
  onOpenAuth: () => void;
  onOpenEvolution: () => void;
  onOpenInstallModal?: () => void;
}

interface PillarItem {
  id: ModuleId;
  number: number;
  label: string;
  shortLabel: string;
  tabletLabel: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const PILLARS: PillarItem[] = [
  {
    id: 'architect',
    number: 1,
    label: '1. Arquiteto 90D',
    shortLabel: 'Arquiteto',
    tabletLabel: '1. Arq',
    tag: 'Estratégia & Diagnóstico',
    icon: Compass,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  },
  {
    id: 'vocabulary',
    number: 2,
    label: '2. Vocabulário 80/20',
    shortLabel: 'Vocabulário',
    tabletLabel: '2. Vocab',
    tag: '300 Palavras & Flashcards',
    icon: BookOpen,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  {
    id: 'conversation',
    number: 3,
    label: '3. Conversação Real',
    shortLabel: 'Conversação',
    tabletLabel: '3. Diálogo',
    tag: 'Parceiro IA & Diálogo',
    icon: MessageSquare,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  {
    id: 'listening',
    number: 4,
    label: '4. Treino de Ouvido',
    shortLabel: 'Ouvido',
    tabletLabel: '4. Ouvido',
    tag: 'Fala Conectada & Áudio',
    icon: Headphones,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
  },
  {
    id: 'drills',
    number: 5,
    label: '5. Resposta Rápida',
    shortLabel: 'Drills',
    tabletLabel: '5. Drills',
    tag: 'Reflexo em 5 Segundos',
    icon: Timer,
    color: 'text-rose-600 bg-rose-50 border-rose-200',
  },
  {
    id: 'pronunciation',
    number: 6,
    label: '6. Pronúncia & Fonética',
    shortLabel: 'Pronúncia',
    tabletLabel: '6. Fonética',
    tag: 'Auditoria Fonética & Vícios',
    icon: Mic,
    color: 'text-teal-600 bg-teal-50 border-teal-200',
  },
  {
    id: 'thinking',
    number: 7,
    label: '7. Pensar no Idioma',
    shortLabel: 'Pensar',
    tabletLabel: '7. Pensar',
    tag: 'Tradução Mental Zero',
    icon: Brain,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  {
    id: 'immersion',
    number: 8,
    label: '8. Imersão 360°',
    shortLabel: 'Imersão',
    tabletLabel: '8. Imersão',
    tag: 'Rotina & Consumo Ativo',
    icon: Radio,
    color: 'text-orange-600 bg-orange-50 border-orange-200',
  },
];

export const TopNavigation: React.FC<TopNavigationProps> = ({
  currentLanguage,
  onSelectLanguage,
  currentLevel,
  onSelectLevel,
  activeModule,
  onSelectModule,
  streakDays,
  totalXp,
  isAudioReady,
  onOpenVoiceCoach,
  onOpenAuth,
  onOpenEvolution,
  onOpenInstallModal,
}) => {
  const { currentUser, studentProfile, logout } = useAuth();
  const [levelMenuOpen, setLevelMenuOpen] = useState(false);
  const [pillarsMenuOpen, setPillarsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isBarCollapsed, setIsBarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('fluency_nav_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const menuRef = useRef<HTMLDivElement>(null);

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setLevelMenuOpen(false);
        setPillarsMenuOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleBarCollapsed = () => {
    setIsBarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('fluency_nav_collapsed', String(next));
      } catch {
        // noop
      }
      return next;
    });
  };

  const selectedLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.name === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const currentPillarIndex = PILLARS.findIndex((p) => p.id === activeModule);
  const activePillar = currentPillarIndex !== -1 ? PILLARS[currentPillarIndex] : null;

  // Garante que a rolagem seja redefinida para o topo absoluto da página
  const handleNavigate = (mod: ModuleId) => {
    onSelectModule(mod);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  // Funções de navegação passo a passo (anterior / próximo)
  const handlePrevPillar = () => {
    if (activeModule === 'overview') {
      handleNavigate(PILLARS[PILLARS.length - 1].id);
    } else if (currentPillarIndex === 0) {
      handleNavigate('overview');
    } else {
      handleNavigate(PILLARS[currentPillarIndex - 1].id);
    }
  };

  const handleNextPillar = () => {
    if (activeModule === 'overview') {
      handleNavigate(PILLARS[0].id);
    } else if (currentPillarIndex === PILLARS.length - 1) {
      handleNavigate('overview');
    } else {
      handleNavigate(PILLARS[currentPillarIndex + 1].id);
    }
  };

  return (
    <header ref={menuRef} className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      {/* Barra Principal de Controles (Alinhada p/ Mobile, Tablet e PC) */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 py-2 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Lado Esquerdo: Marca + Seletor de Idioma + Nível */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          {/* Logo / Retorno ao Painel */}
          <button
            id="brand-logo"
            onClick={() => handleNavigate('overview')}
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none group text-left border-0 bg-transparent p-0 shrink-0"
            title="Voltar ao Painel Geral"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-base sm:text-lg shadow-sm transition-transform group-hover:scale-105 shrink-0">
              ⚡
            </div>
            <div className="min-w-0">
              <span className="font-black text-slate-900 text-sm sm:text-base tracking-tight block leading-tight truncate">
                Fluência
                <span className="hidden xs:inline"> Acelerada</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium hidden md:block">
                8 Motores de Fluência Prática
              </span>
            </div>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block shrink-0" />

          {/* Indicador de Idioma (Inglês Exclusivo) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 shadow-2xs shrink-0 select-none">
            <span className="text-sm">🇺🇸</span>
            <span className="text-xs">Inglês</span>
          </div>

          {/* Seletor de Nível */}
          <div className="relative shrink-0">
            <button
              id="level-selector-button"
              onClick={() => {
                setLevelMenuOpen(!levelMenuOpen);
                setPillarsMenuOpen(false);
              }}
              className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 rounded-lg border border-indigo-200 bg-indigo-50/90 hover:bg-indigo-100 transition-colors text-xs font-bold text-indigo-900 cursor-pointer shadow-2xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              <span>{currentLevel}</span>
              <ChevronDown className="w-3 h-3 text-indigo-500" />
            </button>

            {levelMenuOpen && (
              <div
                id="level-dropdown-menu"
                className="absolute left-0 mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Nível CEFR
                </div>
                {FLUENCY_LEVELS.map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => {
                      onSelectLevel(lvl.id);
                      setLevelMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left transition-colors cursor-pointer ${
                      lvl.id === currentLevel
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-semibold text-xs">{lvl.label}</div>
                    <div
                      className={`text-[10px] ${
                        lvl.id === currentLevel ? 'text-indigo-100' : 'text-slate-500'
                      }`}
                    >
                      {lvl.desc}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Seletor Rápido de Módulos (Visível em Tablets e PC) */}
          <div className="relative hidden md:block shrink-0">
            <button
              id="btn-open-pillars-popover"
              onClick={() => {
                setPillarsMenuOpen(!pillarsMenuOpen);
                setLevelMenuOpen(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                activeModule === 'overview'
                  ? 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800'
                  : 'border-indigo-300 bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
              title="Acessar qualquer um dos 8 pilares em 1 clique"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="max-w-[120px] lg:max-w-[180px] truncate">
                {activePillar ? `${activePillar.number}. ${activePillar.shortLabel}` : 'Painel Geral'}
              </span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {/* Menu Dropdown em Grid com todos os 8 Pilares */}
            {pillarsMenuOpen && (
              <div
                id="pillars-dropdown-grid"
                className="absolute left-0 mt-2 w-[340px] sm:w-[480px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <LayoutGrid className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-800">
                      Mapa dos 8 Pilares da Fluência
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleNavigate('overview');
                      setPillarsMenuOpen(false);
                    }}
                    className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 px-2 py-0.5 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Abrir Painel Geral
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[360px] overflow-y-auto pr-1">
                  {PILLARS.map((p) => {
                    const isSelected = activeModule === p.id;
                    return (
                      <button
                        key={p.id}
                        id={`menu-item-pillar-${p.id}`}
                        onClick={() => {
                          handleNavigate(p.id);
                          setPillarsMenuOpen(false);
                        }}
                        className={`flex items-start gap-2.5 p-2 rounded-xl text-left transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                            isSelected ? 'bg-amber-400 text-slate-950' : p.color
                          }`}
                        >
                          {p.number}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            className={`font-bold text-xs truncate ${
                              isSelected ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {p.shortLabel}
                          </div>
                          <div
                            className={`text-[10px] truncate ${
                              isSelected ? 'text-slate-300' : 'text-slate-500'
                            }`}
                          >
                            {p.tag}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Avanço sequencial recomendado: 1 ➔ 8</span>
                  <span className="font-semibold text-indigo-600">80/20 Prático</span>
                </div>
              </div>
            )}
          </div>

          {/* Navegação Sequencial Rápida: Anterior e Próximo (PC) */}
          <div className="hidden lg:flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
            <button
              onClick={handlePrevPillar}
              className="p-1 rounded hover:bg-white text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Módulo Anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNextPillar}
              className="p-1 rounded hover:bg-white text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Próximo Módulo"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Lado Direito: Avaliador de Voz, Streak, XP, Instalar e Usuário */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Botão de Direcionamento da Trilha do Aluno */}
          <button
            id="btn-nav-guided-step"
            onClick={() => {
              const currentStep = getGuidedStepData(getSavedGuidedStep());
              handleNavigate(currentStep.targetModule);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-900 text-xs font-black shadow-2xs transition-all cursor-pointer"
            title="Ir para a Lição Atual da Trilha Guiada pelo Sistema"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Trilha:</span>
            <span>Passo {getSavedGuidedStep()}/12</span>
          </button>

          {/* Botão Destaque: Avaliador de Voz PT ➔ EN */}
          {onOpenVoiceCoach && (
            <button
              id="btn-nav-open-voice-coach"
              onClick={onOpenVoiceCoach}
              className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all border border-slate-700 cursor-pointer"
              title="Fale em português, receba tradução nativa e tenha sua pronúncia avaliada"
            >
              <span className="text-amber-400 text-xs">🎙️</span>
              <span className="hidden sm:inline">Avaliador Voz</span>
            </button>
          )}

          {/* Dias de Ofensiva */}
          <div
            id="streak-counter"
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold shrink-0"
            title="Dias seguidos de prática"
          >
            <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
            <span>{streakDays}d</span>
          </div>

          {/* Pontos de Fluência / XP */}
          <div
            id="xp-counter"
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold shrink-0"
            title="Pontos de experiência acumulados"
          >
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span className="hidden xs:inline">{totalXp} XP</span>
            <span className="xs:hidden">{totalXp}</span>
          </div>

          {/* Botão de Instalação no Celular / Executável (Tablet e Desktop) */}
          {onOpenInstallModal && (
            <button
              id="btn-nav-install-mobile"
              onClick={onOpenInstallModal}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-2xs transition-all cursor-pointer shrink-0"
              title="Instalar no Celular ou Gerar Pacote Executável APK"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Instalar</span>
            </button>
          )}

          {/* Botão de Perfil / Cadastro / Login do Aluno */}
          {(currentUser || studentProfile) ? (
            <div className="relative shrink-0">
              <button
                id="btn-user-profile-menu"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 px-2 py-1 sm:px-2.5 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                title="Perfil e Acompanhamento do Aluno"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold shrink-0">
                  {(studentProfile?.name || currentUser?.displayName || 'A').charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline max-w-[80px] truncate">
                  {studentProfile?.name?.split(' ')[0] || currentUser?.displayName?.split(' ')[0] || 'Aluno'}
                </span>
                <ChevronDown className="w-3 h-3 text-indigo-600 hidden xs:inline" />
              </button>

              {userMenuOpen && (
                <div
                  id="user-dropdown-menu"
                  className="absolute right-0 mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  <div className="px-3 py-2 border-b border-slate-100">
                    <div className="font-bold text-xs text-slate-900 truncate">
                      {studentProfile?.name || currentUser?.displayName || 'Aluno'}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {studentProfile?.email || currentUser?.email || 'aluno@fluencia.app'}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-indigo-600">
                      <span>Nível: {currentLevel}</span>
                      <span>•</span>
                      <span>{currentLanguage}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenEvolution();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 font-semibold text-left transition-colors cursor-pointer"
                  >
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    <span>Acompanhar Evolução</span>
                  </button>

                  {onOpenInstallModal && (
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenInstallModal();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-900 font-semibold text-left transition-colors cursor-pointer"
                    >
                      <Smartphone className="w-4 h-4 text-amber-500" />
                      <span>Instalar no Celular / APK</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 font-semibold text-left border-t border-slate-100 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Sair da Conta</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              id="btn-nav-login"
              onClick={onOpenAuth}
              className="flex items-center gap-1 px-2 py-1.5 sm:px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
              title="Cadastre-se ou entre para guardar e acompanhar sua evolução de aluno"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Entrar</span>
            </button>
          )}

          {/* Botão para Recolher / Expandir barra secundária */}
          <button
            onClick={toggleBarCollapsed}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors hidden lg:block cursor-pointer shrink-0"
            title={isBarCollapsed ? 'Expandir atalhos dos pilares' : 'Recolher atalhos para modo foco'}
          >
            {isBarCollapsed ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Barra de Navegação dos 8 Pilares (Visualmente Perfeita em Mobile, Tablet e PC) */}
      {!isBarCollapsed && (
        <div className="border-t border-slate-100 bg-slate-50/90 py-1 px-2 sm:px-6 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 sm:gap-2">
            {/* Atalho Painel Geral */}
            <button
              id="nav-tab-overview"
              onClick={() => handleNavigate('overview')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                activeModule === 'overview'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="Visão Geral do Curso"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Painel</span>
            </button>

            <div className="h-4 w-px bg-slate-200 shrink-0 mx-0.5" />

            {/* Grid dos 8 Pilares:
                - Mobile: grade de 8 botões uniformes com largura idêntica, sem quebra nem scroll
                - Tablet: botões compactos com tabletLabel (ex: 1. Arq, 2. Vocab)
                - Desktop: botões completos com ícone + número + rótulo
            */}
            <nav className="flex-1 grid grid-cols-8 sm:flex sm:items-center sm:justify-start gap-1">
              {PILLARS.map((p) => {
                const Icon = p.icon;
                const isActive = activeModule === p.id;
                return (
                  <button
                    key={p.id}
                    id={`nav-tab-${p.id}`}
                    onClick={() => handleNavigate(p.id)}
                    className={`flex items-center justify-center sm:justify-start gap-1 rounded-lg text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white font-bold shadow-2xs py-1 px-1 sm:px-2.5'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 py-1 px-1 sm:px-2'
                    }`}
                    title={`${p.number}. ${p.shortLabel} - ${p.tag}`}
                  >
                    {/* Mobile: apenas número destacado */}
                    <span className="sm:hidden font-black text-xs text-center w-full">{p.number}</span>

                    {/* Tablet: tabletLabel conciso que cabe em 768px sem quebra */}
                    <span className="hidden sm:inline lg:hidden font-semibold whitespace-nowrap text-[11px]">
                      {p.tabletLabel}
                    </span>

                    {/* Desktop: ícone + número + rótulo completo */}
                    <Icon className="w-3.5 h-3.5 hidden lg:inline shrink-0" />
                    <span className="hidden lg:inline font-medium whitespace-nowrap">
                      {p.number}. {p.shortLabel}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Indicador do Módulo Selecionado no mobile */}
            {activePillar && (
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 sm:hidden shrink-0 ml-1">
                Pilar {activePillar.number}
              </span>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

