import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Smartphone,
  Download,
  X,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Zap,
  Sparkles,
  Share2,
  Cpu,
  ArrowRight,
  Info,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { canInstall, isInstalled, isIOS, installApp } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'pwa' | 'apk' | 'tips'>('pwa');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  // Determina a URL do aplicativo para testes
  useEffect(() => {
    let url = window.location.origin;
    // Se estiver em iframe ou dev server, pega a URL atual
    if (window.location.href && !window.location.href.startsWith('about:')) {
      url = window.location.origin;
    }
    setCustomUrl(url);

    // Gera o QR Code com a URL do app
    QRCode.toDataURL(url, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((dataUrl) => {
        setQrCodeDataUrl(dataUrl);
      })
      .catch((err) => {
        console.error('Erro ao gerar QR Code:', err);
      });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(customUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleInstallPWA = async () => {
    if (canInstall) {
      await installApp();
    }
  };

  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(
    customUrl
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-6 flex items-center justify-between relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              📲
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Instalar no Celular & Executável
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Pronto para Teste
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Teste em tela cheia no Android ou iPhone como aplicativo nativo ou gere o APK.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Abas */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 pt-2 shrink-0 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'pwa'
                ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 rounded-t-xl'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>1. Instalação Instantânea (Recomendado)</span>
          </button>

          <button
            onClick={() => setActiveTab('apk')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'apk'
                ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 rounded-t-xl'
            }`}
          >
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span>2. Gerar Arquivo Executável .APK</span>
          </button>

          <button
            onClick={() => setActiveTab('tips')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tips'
                ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 rounded-t-xl'
            }`}
          >
            <Info className="w-4 h-4 text-slate-500" />
            <span>3. Dicas de Teste</span>
          </button>
        </div>

        {/* Conteúdo com rolagem interna */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 text-slate-800">
          {/* Aba 1: Instalação Instantânea (PWA) */}
          {activeTab === 'pwa' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Box de QR Code + Link direto */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center gap-5">
                {/* QR Code */}
                <div className="flex flex-col items-center bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0">
                  {qrCodeDataUrl ? (
                    <img
                      src={qrCodeDataUrl}
                      alt="QR Code para abrir no celular"
                      className="w-36 h-36 rounded-lg"
                    />
                  ) : (
                    <div className="w-36 h-36 flex items-center justify-center text-xs text-slate-400">
                      Gerando QR Code...
                    </div>
                  )}
                  <span className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-wide">
                    Aponte a câmera do celular
                  </span>
                </div>

                {/* Explicação e Botão de Copiar */}
                <div className="space-y-3 flex-1 text-center md:text-left">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      Abra direto no seu Smartphone
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Aponte a câmera do seu celular para o QR Code ao lado ou copie o link para abrir no <strong>Google Chrome</strong> (Android) ou <strong>Safari</strong> (iPhone).
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={customUrl}
                      className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-700 font-mono select-all"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 transition-all cursor-pointer active:scale-95"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Link</span>
                        </>
                      )}
                    </button>
                  </div>

                  {canInstall && (
                    <div className="pt-1">
                      <button
                        onClick={handleInstallPWA}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Instalar Agora neste Navegador</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Guia passo a passo por sistema operacional */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Android */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
                    <span className="text-base">🤖</span>
                    <span>No Android (Google Chrome)</span>
                  </div>
                  <ol className="text-xs text-slate-700 space-y-1.5 list-decimal pl-4 leading-relaxed">
                    <li>Abra o link no navegador <strong>Chrome</strong>.</li>
                    <li>Toque no menu de <strong>3 pontinhos</strong> (canto superior direito).</li>
                    <li>Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</li>
                    <li>O ícone do app será criado na sua tela inicial e abrirá em tela cheia!</li>
                  </ol>
                </div>

                {/* iPhone / iPad */}
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs sm:text-sm">
                    <span className="text-base">🍎</span>
                    <span>No iPhone (Safari da Apple)</span>
                  </div>
                  <ol className="text-xs text-slate-700 space-y-1.5 list-decimal pl-4 leading-relaxed">
                    <li>Abra o link no navegador <strong>Safari</strong>.</li>
                    <li>Toque no botão <strong>Compartilhar</strong> (quadrado com seta para cima).</li>
                    <li>Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong>.</li>
                    <li>Toque em <strong>"Adicionar"</strong>. O app está pronto para uso!</li>
                  </ol>
                </div>
              </div>

              {/* Vantagens do PWA vs APK Tradicional */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900">Por que o formato PWA é a melhor escolha para testes?</span>
                  <p className="text-[11px] leading-relaxed">
                    Não requer ativar avisos de fontes desconhecidas nem compilar arquivos pesados. Você testa todas as funções nativas (microfone, áudio, conversação IA e persistência) em tela cheia com atualizações automáticas em tempo real.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Aba 2: Gerar Executável .APK */}
          {activeTab === 'apk' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-950 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Configuração de Pacote Android Pronta!</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  O manifesto (`manifest.json`), os ícones adaptativos Android (192px, 512px e maskable) e o Service Worker já estão 100% configurados neste app. Você pode gerar o pacote <strong>.APK instalável</strong> em menos de 2 minutos.
                </p>
              </div>

              {/* Método 1: PWABuilder (Online, sem instalar nada) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        Método Visual: PWABuilder (Oficial Microsoft / Google TWA)
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        Gera o APK para download sem precisar instalar nada no seu computador
                      </span>
                    </div>
                  </div>
                  <a
                    href={pwaBuilderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <span>Abrir PWABuilder</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-indigo-700">Passo 1:</span>
                    <span>Clique no botão acima ou acesse <strong>pwabuilder.com</strong> (o link do app já irá preenchido).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-indigo-700">Passo 2:</span>
                    <span>O PWABuilder vai validar o manifesto e pontuação (100% aprovado).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-indigo-700">Passo 3:</span>
                    <span>Clique em <strong>"Package for Android"</strong> ➔ Selecione <strong>"Download Package"</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-indigo-700">Passo 4:</span>
                    <span>Extraia o arquivo .zip baixado: nele você encontrará o arquivo <strong>.apk</strong> pronto para instalar no seu celular Android!</span>
                  </div>
                </div>
              </div>

              {/* Método 2: Bubblewrap CLI (Linha de Comando da Google) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      Método Avançado: Bubblewrap CLI (Google TWA)
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Para compilar direto no terminal usando as ferramentas oficiais do Google
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900 text-slate-100 rounded-xl p-3.5 font-mono text-xs space-y-1.5 overflow-x-auto">
                  <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Comandos de Terminal (Node.js):</div>
                  <p className="text-emerald-400"># 1. Instalar o gerador oficial de APK da Google</p>
                  <p className="select-all">npm install -g @bubblewrap/cli</p>
                  <p className="text-emerald-400 mt-2"># 2. Inicializar o projeto com o manifesto deste app</p>
                  <p className="select-all">{`bubblewrap init --manifest="${customUrl}/manifest.json"`}</p>
                  <p className="text-emerald-400 mt-2"># 3. Compilar o arquivo .apk de teste</p>
                  <p className="select-all">bubblewrap build</p>
                </div>
              </div>

              {/* Como instalar o APK baixado no Android */}
              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-indigo-900">
                  <span>📥 Como rodar o .APK no celular Android:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-indigo-900/90">
                  Transfira o arquivo <strong>.apk</strong> para o seu smartphone (via WhatsApp, Google Drive, cabo USB ou download direto). Ao tocar no arquivo, o Android perguntará se deseja permitir a instalação: toque em <strong>"Continuar / Instalar"</strong> para abrir o app nativamente!
                </p>
              </div>
            </div>
          )}

          {/* Aba 3: Dicas de Teste */}
          {activeTab === 'tips' && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span className="text-amber-500">🎙️</span>
                  <span>Permissão de Microfone no Celular</span>
                </h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Quando você abrir o <strong>Módulo 3 (Conversação Real)</strong> ou o <strong>Módulo 6 (Pronúncia)</strong> pela primeira vez no celular, o aparelho exibirá a mensagem padrão pedindo permissão para o microfone. Toque em <strong>"Permitir durante o uso do app"</strong> para testar as respostas por voz.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span className="text-indigo-600">🔊</span>
                  <span>Áudio e Fala dos Nativos (Sintetizador)</span>
                </h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Em celulares Android e iPhones, a voz dos áudios usa as vozes de alta definição do próprio sistema operacional (Google Text-to-Speech e Apple Siri Voices). Garanta que o volume de mídia do aparelho não esteja no modo silencioso.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span className="text-emerald-600">💾</span>
                  <span>Persistência de Dados e Progresso do Aluno</span>
                </h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  O cadastro de aluno, ofensiva diária (streak), nível selecionado e pontos de XP ficam salvos automaticamente na nuvem (Firebase) e no armazenamento local do aparelho. Você pode fechar o aplicativo e reabrir que seu progresso continuará exatamente de onde parou.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com botão de fechar */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Smartphone className="w-3.5 h-3.5 text-slate-400" />
            <span>Compatível com Android 8+ e iOS 13+</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
