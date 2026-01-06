import { useEffect, useRef, useState } from 'react';
import { tts } from '../utils/tts';
import './NumberPrompt.css';

interface NumberPromptProps {
  phrase: string;
  ttsText: string;
  showPhrase: boolean; // Only show phrase after answer is submitted
  onReplay?: () => void; // Callback for replay button
}

export default function NumberPrompt({ phrase, ttsText, showPhrase, onReplay }: NumberPromptProps) {
  const hasSpoken = useRef(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const playAudio = () => {
    if (ttsText && !showPhrase) {
      setIsSpeaking(true);
      tts.speak(ttsText, { lang: 'zh-CN', rate: 0.9 })
        .then(() => {
          setIsSpeaking(false);
        })
        .catch((error) => {
          console.warn('TTS error:', error);
          setIsSpeaking(false);
        });
    }
  };

  useEffect(() => {
    // Speak the number when component mounts
    if (!hasSpoken.current && ttsText && !showPhrase) {
      hasSpoken.current = true;
      // Set speaking state immediately so animation appears right away
      setIsSpeaking(true);
      playAudio();
    }

    // Reset when phrase changes
    return () => {
      hasSpoken.current = false;
      tts.stop();
      setIsSpeaking(false);
    };
  }, [phrase, ttsText, showPhrase]);

  const handleReplay = () => {
    tts.stop();
    playAudio();
    if (onReplay) {
      onReplay();
    }
  };

  return (
    <div className="number-prompt">
      {showPhrase ? (
        <div className="prompt-display">{phrase}</div>
      ) : (
        <div className="listening-indicator">
          {isSpeaking ? (
            <>
              <p className="listening-text">Please listen...</p>
              <div className="sound-waves">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              
            </>
          ) : (
            <div className="replay-icon-container">
              <button 
                className="replay-icon-button" 
                onClick={handleReplay} 
                type="button"
                aria-label="Replay audio"
              >
                <div className="audio-icon">🔊</div>
                <span className="replay-tooltip">Replay</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

