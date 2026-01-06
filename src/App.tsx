import { useState, useEffect } from 'react';
import type { GameState, Prompt, GameStats } from './types/game';
import { generateNumberPhrase } from './utils/numberGenerator';
import { GAME_CONFIG } from './utils/gameConfig';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ReportScreen from './components/ReportScreen';
import './App.css';

function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [currentPhrase, setCurrentPhrase] = useState<{
    phrase: string;
    ttsText: string;
    answer: number;
  } | null>(null);
  const [feedbackState, setFeedbackState] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [gameLength] = useState(GAME_CONFIG.DEFAULT_GAME_LENGTH);

  // Initialize game prompts
  const startGame = () => {
    const newPrompts: Prompt[] = [];
    for (let i = 0; i < gameLength; i++) {
      const generated = generateNumberPhrase();
      newPrompts.push({
        id: `prompt-${i}-${Date.now()}`,
        category: generated.category,
        number: generated.number,
        phrase: generated.phrase,
        answer: generated.answer,
        ttsText: generated.ttsText,
        startTime: 0,
      });
    }
    setPrompts(newPrompts);
    setCurrentPromptIndex(0);
    setGameState('playing');
    setFeedbackState('none');
  };

  // Load current prompt
  useEffect(() => {
    if (gameState === 'playing') {
      setPrompts((prevPrompts) => {
        if (prevPrompts.length > 0 && currentPromptIndex < prevPrompts.length) {
          const prompt = prevPrompts[currentPromptIndex];
          
          // Update current phrase display
          setCurrentPhrase({
            phrase: prompt.phrase,
            ttsText: prompt.ttsText,
            answer: prompt.answer,
          });
          
          // Only update start time if it hasn't been set yet
          if (prompt.startTime === 0) {
            const updatedPrompts = [...prevPrompts];
            updatedPrompts[currentPromptIndex] = {
              ...prompt,
              startTime: performance.now(),
            };
            return updatedPrompts;
          }
        }
        return prevPrompts;
      });
    }
  }, [gameState, currentPromptIndex]);

  // Handle answer submission
  const handleAnswer = (userAnswer: number, timeSpent: number) => {
    if (currentPromptIndex >= prompts.length) return;

    const prompt = prompts[currentPromptIndex];
    const isCorrect = !isNaN(userAnswer) && userAnswer === prompt.answer;
    
    const updatedPrompts = [...prompts];
    updatedPrompts[currentPromptIndex] = {
      ...prompt,
      endTime: performance.now(),
      userAnswer: isNaN(userAnswer) ? undefined : userAnswer,
      isCorrect,
      timeSpent,
    };
    setPrompts(updatedPrompts);

    setFeedbackState(isCorrect ? 'correct' : 'incorrect');

    // Wait for feedback duration, then move to next prompt or finish
    setTimeout(() => {
      setFeedbackState('none');
      
      if (currentPromptIndex + 1 < prompts.length) {
        setCurrentPromptIndex(currentPromptIndex + 1);
      } else {
        setGameState('finished');
      }
    }, GAME_CONFIG.FEEDBACK_DURATION);
  };

  // Calculate game statistics
  const calculateStats = (): GameStats => {
    const validPrompts = prompts.filter(p => p.timeSpent !== undefined);
    const times = validPrompts.map(p => p.timeSpent!);
    
    const totalTime = times.reduce((sum, time) => sum + time, 0);
    const averageTime = times.length > 0 ? totalTime / times.length : 0;
    const longestTime = times.length > 0 ? Math.max(...times) : 0;
    const shortestTime = times.length > 0 ? Math.min(...times) : 0;
    
    const correctCount = prompts.filter(p => p.isCorrect).length;
    const totalCount = prompts.length;

    return {
      prompts,
      averageTime,
      longestTime,
      shortestTime,
      totalTime,
      correctCount,
      totalCount,
    };
  };


  const handlePlayAgain = () => {
    setGameState('start');
    setCurrentPromptIndex(0);
    setPrompts([]);
    setCurrentPhrase(null);
    setFeedbackState('none');
  };

  // Render based on game state
  if (gameState === 'start') {
    return <StartScreen onStart={startGame} />;
  }

  if (gameState === 'finished') {
    return <ReportScreen stats={calculateStats()} onPlayAgain={handlePlayAgain} />;
  }

  const handleReplay = () => {
    if (currentPromptIndex < prompts.length) {
      const updatedPrompts = [...prompts];
      const prompt = updatedPrompts[currentPromptIndex];
      updatedPrompts[currentPromptIndex] = {
        ...prompt,
        replayCount: (prompt.replayCount || 0) + 1,
      };
      setPrompts(updatedPrompts);
    }
  };

  const handleAbort = () => {
    if (window.confirm('Are you sure you want to abort the game? Your progress will be lost.')) {
      setGameState('start');
      setCurrentPromptIndex(0);
      setPrompts([]);
      setCurrentPhrase(null);
      setFeedbackState('none');
    }
  };

  if (gameState === 'playing' && currentPhrase) {
    return (
      <GameScreen
        phrase={currentPhrase.phrase}
        ttsText={currentPhrase.ttsText}
        answer={currentPhrase.answer}
        onAnswer={handleAnswer}
        feedbackState={feedbackState}
        onReplay={handleReplay}
        onAbort={handleAbort}
      />
    );
  }

  return <div>Loading...</div>;
}

export default App;
