/**
 * Text-to-Speech utility using Web Speech API
 * Designed to be easily upgradeable to a more universal TTS utility
 */

export interface TTSOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

class TTSService {
  private synth: SpeechSynthesis | null = null;
  private isSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isSupported = true;
    }
  }

  /**
   * Check if TTS is supported in the current browser
   */
  isAvailable(): boolean {
    return this.isSupported;
  }

  /**
   * Speak text using Web Speech API
   */
  speak(text: string, options: TTSOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported || !this.synth) {
        reject(new Error('Speech synthesis is not supported in this browser'));
        return;
      }

      // Cancel any ongoing speech
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang || 'zh-CN';
      utterance.rate = options.rate ?? 1.0;
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);

      this.synth.speak(utterance);
    });
  }

  /**
   * Stop any ongoing speech
   */
  stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  /**
   * Check if speech is currently in progress
   */
  isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}

// Export a singleton instance
export const tts = new TTSService();

// Export the class for potential future use
export default TTSService;

