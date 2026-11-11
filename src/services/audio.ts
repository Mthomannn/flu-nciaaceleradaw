/**
 * Servico de Audio e Gravacao de Alta Resiliencia
 * Suporta Web Speech Synthesis, MediaRecorder com Analisador de Onda e Reconhecimento de Fala
 */

import { TargetLanguage } from '../types';

export const LANGUAGE_LOCALE_MAP: Record<TargetLanguage, string> = {
  Inglês: 'en-US',
};

// Web Speech Synthesis (Texto para Fala com Controle de Velocidade e Resiliência Anti-Travamento)
export class AudioSynthesizer {
  private static instance: AudioSynthesizer;
  private voicesLoaded: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentSessionId: number = 0;
  private heartbeatInterval: any = null;

  private constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.voicesLoaded = true;
      };
      // Forçar carregamento inicial das vozes
      try {
        window.speechSynthesis.getVoices();
      } catch (e) {
        // Ignorar
      }
    }
  }

  public static getInstance(): AudioSynthesizer {
    if (!AudioSynthesizer.instance) {
      AudioSynthesizer.instance = new AudioSynthesizer();
    }
    return AudioSynthesizer.instance;
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public speak(
    text: string,
    language: TargetLanguage = 'Inglês',
    rate: number = 1.0,
    onEnd?: () => void
  ): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis nao disponivel neste navegador.');
      return false;
    }

    try {
      // Interromper qualquer áudio anterior e invalidar callbacks de sessões anteriores
      this.stop();

      const sessionId = ++this.currentSessionId;
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      const targetLocale = LANGUAGE_LOCALE_MAP[language] || 'en-US';
      utterance.lang = targetLocale;
      utterance.rate = Math.max(0.5, Math.min(1.5, rate));
      utterance.pitch = 1.0;

      // Seleção de voz natural
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const matchingVoice =
          voices.find(
            (v) =>
              v.lang.startsWith(targetLocale.slice(0, 2)) &&
              (v.name.includes('Natural') ||
                v.name.includes('Google') ||
                v.name.includes('Enhanced') ||
                v.name.includes('Siri') ||
                v.name.includes('Premium'))
          ) || voices.find((v) => v.lang.startsWith(targetLocale.slice(0, 2)));

        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      let completed = false;
      const cleanup = () => {
        if (this.heartbeatInterval) {
          clearInterval(this.heartbeatInterval);
          this.heartbeatInterval = null;
        }
        if (this.currentUtterance === utterance) {
          this.currentUtterance = null;
        }
      };

      utterance.onend = () => {
        cleanup();
        if (completed) return;
        completed = true;
        // Só executar callback se esta sessão ainda for a ativa
        if (this.currentSessionId === sessionId && onEnd) {
          onEnd();
        }
      };

      utterance.onerror = (e) => {
        cleanup();
        if (completed) return;
        completed = true;
        // Erros de interrupção esperada pelo cancel() não disparam onEnd para evitar repetição em loop
        if (e.error === 'interrupted' || e.error === 'canceled') {
          return;
        }
        if (this.currentSessionId === sessionId && onEnd) {
          onEnd();
        }
      };

      // Workaround para bug histórico do Chromium/WebKit onde o sintetizador pausa silenciosamente em textos longos
      if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = setInterval(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }
      }, 5000);

      // Desbloquear estado de pausa se houver ficado travado em navegadores Chrome
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      console.error('Erro ao reproduzir sintese de voz:', err);
      if (onEnd) onEnd();
      return false;
    }
  }

  public stop(): void {
    // Incrementa sessionId para que nenhum callback pendente ou em fila execute
    this.currentSessionId++;

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.currentUtterance) {
      this.currentUtterance.onend = null;
      this.currentUtterance.onerror = null;
      this.currentUtterance = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // Ignorar
      }
    }
  }
}

// Conversão utilitária de Blob para Base64
export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64 || '');
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Transcrição de áudio via API do servidor (com modelos Gemini)
export async function transcribeAudioWithServer(
  audioBlob: Blob,
  language: TargetLanguage | string = 'Inglês',
  expectedText?: string
): Promise<string> {
  try {
    const audioBase64 = await blobToBase64(audioBlob);
    if (!audioBase64 || audioBase64.length < 50) return '';

    const mimeType = audioBlob.type || 'audio/webm';
    const res = await fetch('/api/transcribe-audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audioBase64,
        mimeType,
        language,
        expectedText,
      }),
    });

    const data = await res.json();
    if (data.success && typeof data.transcript === 'string') {
      return data.transcript.trim();
    }
    return '';
  } catch (err) {
    console.warn('Falha na transcrição remota de voz:', err);
    return '';
  }
}

// MediaRecorder para Gravacao de Voz com Analisador de Audio em Tempo Real
export class VoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private animationFrameId: number | null = null;

  public async startRecording(
    onWaveformData?: (volume: number, frequencies: Uint8Array) => void
  ): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('Microfone nao suportado neste ambiente.');
        return false;
      }

      this.audioChunks = [];
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Configurar Analisador Web Audio
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        try {
          this.audioContext = new AudioCtx();
          const source = this.audioContext.createMediaStreamSource(this.mediaStream);
          this.analyser = this.audioContext.createAnalyser();
          this.analyser.fftSize = 64;
          source.connect(this.analyser);

          const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
          const updateWave = () => {
            if (this.analyser) {
              this.analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const avgVolume = sum / (dataArray.length * 255);
              if (onWaveformData) {
                onWaveformData(avgVolume, dataArray);
              }
              this.animationFrameId = requestAnimationFrame(updateWave);
            }
          };
          updateWave();
        } catch (ctxErr) {
          console.warn('Aviso: Analisador de áudio não inicializado:', ctxErr);
        }
      }

      // Definir formato compativel
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        'audio/ogg',
      ];
      let selectedMime = '';
      for (const mime of mimeTypes) {
        if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(mime)) {
          selectedMime = mime;
          break;
        }
      }

      const options = selectedMime ? { mimeType: selectedMime } : undefined;
      this.mediaRecorder = new MediaRecorder(this.mediaStream, options);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100);
      return true;
    } catch (err) {
      console.error('Falha ao iniciar gravacao de audio:', err);
      return false;
    }
  }

  public stopRecording(): Promise<{
    audioBlob: Blob;
    audioUrl: string;
    audioBase64: string;
    mimeType: string;
  }> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        return reject(new Error('Nenhuma gravacao em andamento'));
      }

      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      this.mediaRecorder.onstop = async () => {
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);
        let audioBase64 = '';
        try {
          audioBase64 = await blobToBase64(audioBlob);
        } catch (e) {
          console.warn('Erro na codificação base64 do áudio:', e);
        }

        // Desligar trilhas do microfone
        if (this.mediaStream) {
          this.mediaStream.getTracks().forEach((track) => track.stop());
          this.mediaStream = null;
        }
        if (this.audioContext && this.audioContext.state !== 'closed') {
          try {
            this.audioContext.close();
          } catch (e) {}
          this.audioContext = null;
        }

        this.mediaRecorder = null;
        resolve({ audioBlob, audioUrl, audioBase64, mimeType });
      };

      try {
        if (this.mediaRecorder.state !== 'inactive') {
          this.mediaRecorder.stop();
        } else {
          // Já inativo
          const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
          const audioBlob = new Blob(this.audioChunks, { type: mimeType });
          const audioUrl = URL.createObjectURL(audioBlob);
          blobToBase64(audioBlob).then((b64) => {
            resolve({ audioBlob, audioUrl, audioBase64: b64, mimeType });
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  }
}

// Reconhecimento de Voz Resiliente (Web Speech API com reinicialização limpa)
export class SpeechTranscriber {
  private activeRecognition: any = null;
  private isListening: boolean = false;
  private accumulatedFinalText: string = '';

  public isSupported(): boolean {
    return typeof window !== 'undefined' && Boolean(
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    );
  }

  public listenWithLocale(
    locale: string,
    onResult: (text: string, isFinal: boolean) => void,
    onError: (err: any) => void
  ): void {
    if (!this.isSupported()) {
      onError(new Error('Reconhecimento de fala nativo não suportado no navegador.'));
      return;
    }

    try {
      this.stop();

      const SpeechRec =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      const rec = new SpeechRec();
      this.activeRecognition = rec;
      this.isListening = true;
      this.accumulatedFinalText = '';

      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = locale;

      rec.onresult = (event: any) => {
        let interimText = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            this.accumulatedFinalText += ' ' + res[0].transcript;
          } else {
            interimText += res[0].transcript;
          }
        }

        this.accumulatedFinalText = this.accumulatedFinalText.trim();
        const fullCurrentText = (this.accumulatedFinalText + ' ' + interimText).trim();
        if (fullCurrentText) {
          onResult(fullCurrentText, false);
        }
      };

      rec.onerror = (event: any) => {
        // 'no-speech' é comum se o usuário demorar a falar, não abortamos silenciosamente
        if (event.error === 'no-speech') {
          return;
        }
        if (event.error === 'aborted') {
          return;
        }
        onError(event.error);
      };

      rec.onend = () => {
        this.isListening = false;
        if (this.accumulatedFinalText) {
          onResult(this.accumulatedFinalText, true);
        }
      };

      rec.start();
    } catch (e) {
      this.isListening = false;
      onError(e);
    }
  }

  public listen(
    language: TargetLanguage,
    onResult: (text: string, isFinal: boolean) => void,
    onError: (err: any) => void
  ): void {
    const locale = LANGUAGE_LOCALE_MAP[language] || 'en-US';
    this.listenWithLocale(locale, onResult, onError);
  }

  public stop(): void {
    if (this.activeRecognition) {
      try {
        this.activeRecognition.stop();
      } catch (e) {}
      this.activeRecognition = null;
    }
    this.isListening = false;
  }
}
