import { useState, useEffect, useRef } from 'react';
import NumberPrompt from './NumberPrompt';
import './GameScreen.css';

interface GameScreenProps {
  phrase: string;
  ttsText: string;
  answer: number;
  onAnswer: (userAnswer: number, timeSpent: number) => void;
  feedbackState: 'none' | 'correct' | 'incorrect';
  onReplay: () => void;
  onAbort: () => void;
}

export default function GameScreen({
  phrase,
  ttsText,
  answer,
  onAnswer,
  feedbackState,
  onReplay,
  onAbort,
}: GameScreenProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFeedback, setIsFeedback] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number>(performance.now());
  const feedbackTimeoutRef = useRef<number | null>(null);

  // Reset when new phrase appears
  useEffect(() => {
    setInputValue('');
    setIsFeedback(false);
    startTimeRef.current = performance.now();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [phrase]);

  // Handle feedback state changes
  useEffect(() => {
    if (feedbackState === 'correct' || feedbackState === 'incorrect') {
      setIsFeedback(true);
      // Clear any existing timeout
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
      // Auto-advance after 1 second
      feedbackTimeoutRef.current = window.setTimeout(() => {
        setIsFeedback(false);
      }, 1000);
    }

    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, [feedbackState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFeedback) return; // Prevent submission during feedback

    const userAnswer = parseInt(inputValue.trim(), 10);
    const endTime = performance.now();
    const timeSpent = endTime - startTimeRef.current;

    if (!isNaN(userAnswer)) {
      onAnswer(userAnswer, timeSpent);
      setInputValue('');
    } else {
      // Treat empty/invalid input as incorrect
      onAnswer(NaN, timeSpent);
      setInputValue('');
    }
  };

  const getFeedbackClass = () => {
    if (!isFeedback) return '';
    return feedbackState === 'correct' ? 'feedback-correct' : 'feedback-incorrect';
  };

  return (
    <div className={`game-screen ${getFeedbackClass()}`}>
      <button className="abort-button" onClick={onAbort} type="button">
        Abort Game
      </button>
      <NumberPrompt phrase={phrase} ttsText={ttsText} showPhrase={isFeedback} onReplay={onReplay} />
      <form onSubmit={handleSubmit} className="answer-form">
        <input
          ref={inputRef}
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter number"
          className="answer-input"
          disabled={isFeedback}
          autoFocus
        />
        <button type="submit" className="submit-button" disabled={isFeedback}>
          Submit
        </button>
      </form>
    </div>
  );
}

