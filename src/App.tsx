import React, { useState, useEffect } from 'react';
import { TargetLanguage, FluencyLevel, ModuleId } from './types';
import { getCurriculumFor, LevelCurriculum } from './data/curriculum';
import { TopNavigation } from './components/TopNavigation';
import { OverviewDashboard } from './components/OverviewDashboard';
import { ArchitectModule } from './components/ArchitectModule';
import { VocabularyModule } from './components/VocabularyModule';
import { ConversationModule } from './components/ConversationModule';
import { ListeningModule } from './components/ListeningModule';
import { SpeechDrillsModule } from './components/SpeechDrillsModule';
import { PronunciationModule } from './components/PronunciationModule';
import { ThinkingDirectModule } from './components/ThinkingDirectModule';
import { ImmersionModule } from './components/ImmersionModule';
import { PtToEnVoiceCoachModal } from './components/PtToEnVoiceCoachModal';
import { AuthModal } from './components/AuthModal';
import { StudentEvolutionModal } from './components/StudentEvolutionModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { InstallAppModal } from './components/InstallAppModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { useAuth } from './context/AuthContext';
import { AudioSynthesizer } from './services/audio';

export function App() {
  const { studentProfile, updateProfileData } = useAuth();

  const [currentLanguage, setCurrentLanguage] = useState<TargetLanguage>(() => {
    try {
      return (localStorage.getItem('fluency_lang') as TargetLanguage) || 'Inglês';
    } catch {
      return 'Inglês';
    }
  });

  const [currentLevel, setCurrentLevel] = useState<FluencyLevel>(() => {
    try {
      return (localStorage.getItem('fluency_level') as FluencyLevel) || 'A1';
    } catch {
      return 'A1';
    }
  });

  const [activeModule, setActiveModule] = useState<ModuleId>(() => {
    try {
      return (localStorage.getItem('fluency_active_module') as ModuleId) || 'overview';
    } catch {
      return 'overview';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fluency_active_module', activeModule);
    } catch {}
  }, [activeModule]);

  const [streakDays, setStreakDays] = useState<number>(() => {
    try {
      const active = localStorage.getItem('fluency_profile_active');
      if (active) {
        const p = JSON.parse(active);
        return typeof p.streakDays === 'number' ? p.streakDays : 0;
      }
      return 0; // Novo aluno ou visitante começa com 0 dias!
    } catch {
      return 0;
    }
  });

  const [totalXp, setTotalXp] = useState<number>(() => {
    try {
      const active = localStorage.getItem('fluency_profile_active');
      if (active) {
        const p = JSON.parse(active);
        return typeof p.totalXp === 'number' ? p.totalXp : 0;
      }
      return 0; // Novo aluno começa com plataforma 100% zerada!
    } catch {
      return 0;
    }
  });

  const [curriculum, setCurriculum] = useState<LevelCurriculum>(() =>
    getCurriculumFor(currentLanguage, currentLevel)
  );

  const [isAudioReady, setIsAudioReady] = useState(true);
  const [xpToast, setXpToast] = useState<{ show: boolean; amount: number }>({
    show: false,
    amount: 0,
  });

  const [levelNotification, setLevelNotification] = useState<string | null>(null);
  const [isVoiceCoachOpen, setIsVoiceCoachOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEvolutionModalOpen, setIsEvolutionModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Sincronizar dados quando o aluno logar com sua conta na nuvem ou deslogar
  useEffect(() => {
    if (studentProfile) {
      if (studentProfile.targetLanguage) setCurrentLanguage(studentProfile.targetLanguage);
      if (studentProfile.level) setCurrentLevel(studentProfile.level);
      setTotalXp(typeof studentProfile.totalXp === 'number' ? studentProfile.totalXp : 0);
      setStreakDays(typeof studentProfile.streakDays === 'number' ? studentProfile.streakDays : 0);
    } else {
      setTotalXp(0);
      setStreakDays(0);
    }
  }, [studentProfile]);

  // Listener para eventos de troca de usuário (novo cadastro, login de usuário existente ou logout)
  useEffect(() => {
    const handleUserChanged = () => {
      try {
        const raw = localStorage.getItem('fluency_profile_active');
        if (raw) {
          const p = JSON.parse(raw);
          setTotalXp(typeof p.totalXp === 'number' ? p.totalXp : 0);
          setStreakDays(typeof p.streakDays === 'number' ? p.streakDays : 0);
          if (p.targetLanguage) setCurrentLanguage(p.targetLanguage);
          if (p.level) setCurrentLevel(p.level);
        } else {
          setTotalXp(0);
          setStreakDays(0);
        }
      } catch {}
    };

    window.addEventListener('fluency_user_changed', handleUserChanged);
    return () => window.removeEventListener('fluency_user_changed', handleUserChanged);
  }, []);

  // Rolagem garantida para o começo absoluto da página sempre que mudar de módulo ou selecionar qualquer número
  const handleSelectModule = (mod: ModuleId) => {
    setActiveModule(mod);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeModule]);

  // Atualizar currículo dinamicamente ao mudar idioma ou nível
  useEffect(() => {
    const updated = getCurriculumFor(currentLanguage, currentLevel);
    setCurriculum(updated);
    try {
      localStorage.setItem('fluency_lang', currentLanguage);
      localStorage.setItem('fluency_level', currentLevel);
    } catch (e) {
      // noop
    }
  }, [currentLanguage, currentLevel]);

  // Pré-aquecimento do sintetizador de áudio
  useEffect(() => {
    const synth = AudioSynthesizer.getInstance();
    setIsAudioReady(synth.isSupported());
  }, []);

  const handleAddXp = (amount: number) => {
    setTotalXp((prev) => {
      const next = prev + amount;
      try {
        localStorage.setItem('fluency_xp', String(next));
      } catch (e) {
        // noop
      }
      if (studentProfile) {
        updateProfileData({ totalXp: next });
      }
      return next;
    });

    setXpToast({ show: true, amount });
    setTimeout(() => {
      setXpToast({ show: false, amount: 0 });
    }, 2000);
  };

  const handleSelectLanguage = (lang: TargetLanguage) => {
    setCurrentLanguage(lang);
    const updated = getCurriculumFor(lang, currentLevel);
    setCurriculum(updated);
    setLevelNotification(`Idioma alterado para ${lang}!`);
    handleAddXp(10);
    setTimeout(() => setLevelNotification(null), 3000);
  };

  const handleSelectLevel = (lvl: FluencyLevel) => {
    setCurrentLevel(lvl);
    const updated = getCurriculumFor(currentLanguage, lvl);
    setCurriculum(updated);
    setLevelNotification(`Nível ${lvl} ativado: aulas, vocabulário e exercícios atualizados!`);
    handleAddXp(15);
    setTimeout(() => setLevelNotification(null), 3500);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-amber-200 selection:text-slate-900">
      {/* Banner de Instalação no Celular / PWA Nativo */}
      <PWAInstallBanner onOpenModal={() => setIsInstallModalOpen(true)} />

      {/* Navegação Superior Principal */}
      <TopNavigation
        currentLanguage={currentLanguage}
        onSelectLanguage={handleSelectLanguage}
        currentLevel={currentLevel}
        onSelectLevel={handleSelectLevel}
        activeModule={activeModule}
        onSelectModule={handleSelectModule}
        streakDays={streakDays}
        totalXp={totalXp}
        isAudioReady={isAudioReady}
        onOpenVoiceCoach={() => setIsVoiceCoachOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenEvolution={() => setIsEvolutionModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* Notificação Flutuante de Nível Alterado */}
      {levelNotification && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-indigo-900 text-white font-semibold px-4 py-2 rounded-xl shadow-lg border border-indigo-400/40 flex items-center gap-2 text-xs sm:text-sm animate-in fade-in slide-in-from-top-2 duration-150">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{levelNotification}</span>
        </div>
      )}

      {/* Notificação Flutuante de Ganho de XP */}
      {xpToast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-amber-400 font-bold px-4 py-2.5 rounded-2xl shadow-xl border border-amber-400/30 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="text-base">⚡</span>
          <span className="text-sm text-white">+{xpToast.amount} Pontos de Fluência!</span>
        </div>
      )}

      {/* Conteúdo Central Dinâmico Alinhado (Mobile, Tablet e PC) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6 pb-24 sm:pb-16">
        {activeModule === 'overview' && (
          <OverviewDashboard
            language={currentLanguage}
            level={currentLevel}
            curriculum={curriculum}
            onNavigate={handleSelectModule}
            onAddXp={handleAddXp}
            onOpenVoiceCoach={() => setIsVoiceCoachOpen(true)}
            streakDays={streakDays}
            totalXp={totalXp}
            onOpenEvolution={() => setIsEvolutionModalOpen(true)}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
          />
        )}

        {activeModule === 'architect' && (
          <ArchitectModule
            language={currentLanguage}
            level={currentLevel}
            onAddXp={handleAddXp}
            onNavigate={handleSelectModule}
          />
        )}

        {activeModule === 'vocabulary' && (
          <VocabularyModule
            language={currentLanguage}
            level={currentLevel}
            curriculum={curriculum}
            onAddXp={handleAddXp}
            onNavigate={handleSelectModule}
          />
        )}

        {activeModule === 'conversation' && (
          <ConversationModule
            language={currentLanguage}
            level={currentLevel}
            onAddXp={handleAddXp}
            onNavigate={handleSelectModule}
          />
        )}

        {activeModule === 'listening' && (
          <ListeningModule
            language={currentLanguage}
            level={currentLevel}
            curriculum={curriculum}
            onAddXp={handleAddXp}
            onNavigate={handleSelectModule}
          />
        )}

        {activeModule === 'drills' && (
          <SpeechDrillsModule
            language={currentLanguage}
            level={currentLevel}
            curriculum={curriculum}
            onAddXp={handleAddXp}
            onNavigate={handleSelectModule}
          />
        )}

        {activeModule === 'pronunciation' && (
          <PronunciationModule
            language={currentLanguage}
            level={currentLevel}
            curriculum={curriculum}
            onAddXp={handleAddXp}
            onOpenVoiceCoach={() => setIsVoiceCoachOpen(true)}
            onNavigate={handleSelectModule}
          />
        )}

        {activeModule === 'thinking' && (
          <ThinkingDirectModule
            language={currentLanguage}
            level={currentLevel}
            curriculum={curriculum}
            onAddXp={handleAddXp}
            onNavigate={handleSelectModule}
          />
        )}

        {activeModule === 'immersion' && (
          <ImmersionModule
            language={currentLanguage}
            level={currentLevel}
            curriculum={curriculum}
            onAddXp={handleAddXp}
          />
        )}

        {/* Barra de Transição e Próximo Passo ao final de cada módulo */}
        {activeModule !== 'overview' && (() => {
          const MODULE_FLOW: { id: ModuleId; title: string; number: number }[] = [
            { id: 'architect', title: 'Arquiteto 90D', number: 1 },
            { id: 'vocabulary', title: 'Vocabulário 80/20', number: 2 },
            { id: 'conversation', title: 'Conversação Real', number: 3 },
            { id: 'listening', title: 'Treino de Ouvido', number: 4 },
            { id: 'drills', title: 'Resposta Rápida', number: 5 },
            { id: 'pronunciation', title: 'Pronúncia & Fonética', number: 6 },
            { id: 'thinking', title: 'Pensar no Idioma', number: 7 },
            { id: 'immersion', title: 'Imersão 360°', number: 8 },
          ];
          const currIdx = MODULE_FLOW.findIndex((m) => m.id === activeModule);
          const prev = currIdx > 0 ? MODULE_FLOW[currIdx - 1] : null;
          const next = currIdx >= 0 && currIdx < MODULE_FLOW.length - 1 ? MODULE_FLOW[currIdx + 1] : null;

          return (
            <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
              <button
                onClick={() => handleSelectModule('overview')}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                <span>🏠</span>
                <span>Voltar ao Painel Geral</span>
              </button>

              <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2">
                {prev ? (
                  <button
                    onClick={() => handleSelectModule(prev.id)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-colors cursor-pointer"
                  >
                    <span>‹</span>
                    <span>Pilar {prev.number}: {prev.title}</span>
                  </button>
                ) : (
                  <div />
                )}

                {next ? (
                  <button
                    onClick={() => handleSelectModule(next.id)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <span>Avançar para Pilar {next.number}</span>
                    <span>›</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleSelectModule('overview')}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <span>🎉 Concluir Ciclo e Voltar ao Início</span>
                  </button>
                )}
              </div>
            </div>
          );
        })()}
      </main>

      {/* Rodapé Clean */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Fluência Acelerada</span>
            <span>•</span>
            <span>Sistema Prático Baseado em Fonoaudiologia & Aquisição Rápida</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <span>Conexão Segura & Resiliente</span>
            <span>•</span>
            <span>Áudio & Gravação Calibrados</span>
          </div>
        </div>
      </footer>
      {/* Modal do Treinador e Avaliador Crítico de Pronúncia PT -> EN */}
      <PtToEnVoiceCoachModal
        isOpen={isVoiceCoachOpen}
        onClose={() => setIsVoiceCoachOpen(false)}
        onAddXp={handleAddXp}
      />

      {/* Modal de Cadastro e Login do Aluno */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Modal de Acompanhamento da Necessidade e Evolução do Aluno */}
      <StudentEvolutionModal
        isOpen={isEvolutionModalOpen}
        onClose={() => setIsEvolutionModalOpen(false)}
        currentLanguage={currentLanguage}
        currentLevel={currentLevel}
        streakDays={streakDays}
        totalXp={totalXp}
        onOpenAuth={() => {
          setIsEvolutionModalOpen(false);
          setIsAuthModalOpen(true);
        }}
      />

      {/* Modal de Instalação no Celular & Geração de Executável APK */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Indicador de Status Offline */}
      <OfflineIndicator />
    </div>
  );
}

export default App;
