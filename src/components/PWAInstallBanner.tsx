import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  X,
  Share,
  PlusSquare,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallBannerProps {
  onOpenModal?: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ onOpenModal }) => {
  const { canInstall, isInstalled, isIOS, installApp } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return localStorage.getItem('fluency_pwa_dismissed') === 'true';
    } catch {
      return false;
    }
  });
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [showApkInfoModal, setShowApkInfoModal] = useState(false);

  // Se já está instalado como app standalone, oculta automaticamente o banner
  if (isInstalled || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem('fluency_pwa_dismissed', 'true');
    } catch {
      // noop
    }
  };

  const handleInstallClick = async () => {
    if (onOpenModal) {
      onOpenModal();
      return;
    }
    if (isIOS) {
      setShowIOSInstructions(true);
    } else if (canInstall) {
      await installApp();
    } else {
      setShowApkInfoModal(true);
    }
  };

  const handleApkClick = () => {
    if (onOpenModal) {
      onOpenModal();
    } else {
      setShowApkInfoModal(true);
    }
  };

  return (
    <>
      <div
        id="pwa-install-banner"
        className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-3 sm:px-6 py-2.5 shadow-md border-b border-indigo-500/30 relative z-30"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              📲
            </div>
            <div>
              <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                <span className="font-bold text-xs sm:text-sm text-white">
                  Instalar Fluência Acelerada no Celular
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  App Nativo / PWA
                </span>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-1">
                Instale direto na tela inicial sem precisar de lojas. Funciona offline, tela cheia e com microfone.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="btn-install-app-banner"
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-xs transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar Aplicativo</span>
            </button>

            <button
              onClick={handleApkClick}
              className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
              title="Informações sobre pacote APK / Android"
            >
              <span>Gerar APK</span>
            </button>

            <button
              onClick={handleDismiss}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Fechar aviso por enquanto"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Instruções para iPhone / iOS Safari */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-slate-900 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm">Instalar no iPhone (iOS Safari)</h3>
              </div>
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              No Safari da Apple, você pode instalar o app nativo em 2 passos rápidos:
            </p>

            <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  Toque no botão <strong>Compartilhar</strong> (ícone de um quadrado com uma seta para cima) na barra inferior do Safari.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong>.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSInstructions(false)}
              className="w-full py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      {/* Modal de Informações para Instalação no Celular & Geração de APK */}
      {showApkInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 text-slate-900 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  📱
                </div>
                <div>
                  <h3 className="font-bold text-sm">Instalar no Celular & Pacote APK</h3>
                  <span className="text-[11px] text-slate-500">Duas formas de testar no seu aparelho</span>
                </div>
              </div>
              <button
                onClick={() => setShowApkInfoModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              {/* Opção 1: PWA Direto (Recomendado) */}
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-1">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Método 1: Instalação Instantânea (PWA)</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Abra este link no <strong>Google Chrome</strong> do seu celular Android (ou Safari no iPhone). Toque nos 3 pontinhos do Chrome e selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
                </p>
                <div className="text-[11px] font-semibold text-emerald-800">
                  ✓ Ícone no celular • Sem barra de URL • Tela cheia • Microfone e áudio nativos
                </div>
              </div>

              {/* Opção 2: Gerar arquivo .APK */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-indigo-600" />
                  <span>Método 2: Gerar arquivo executável .APK</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Como este app possui o manifesto e o service worker PWA configurados, você pode gerar um arquivo <strong>.APK instalável</strong> em 1 clique usando o <strong>PWABuilder</strong> da Microsoft ou <strong>Bubblewrap</strong> da Google:
                </p>
                <ol className="list-decimal pl-4 space-y-1 text-[11px]">
                  <li>Acesse <strong>pwabuilder.com</strong></li>
                  <li>Cole o link público do app</li>
                  <li>Clique em <strong>"Package for Android"</strong> para baixar o seu <strong>.apk</strong> assinado para testes!</li>
                </ol>
              </div>
            </div>

            <button
              onClick={() => setShowApkInfoModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
