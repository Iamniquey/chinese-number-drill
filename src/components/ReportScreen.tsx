import type { GameStats } from '../types/game';
import './ReportScreen.css';

interface ReportScreenProps {
  stats: GameStats;
  onPlayAgain: () => void;
}

export default function ReportScreen({ stats, onPlayAgain }: ReportScreenProps) {
  const formatTime = (ms: number): string => {
    return (ms / 1000).toFixed(2) + 's';
  };

  // Calculate shortest time from correct answers only
  const correctTimes = stats.prompts
    .filter(p => p.isCorrect && p.timeSpent !== undefined)
    .map(p => p.timeSpent!);
  
  const shortestTime = correctTimes.length > 0 ? Math.min(...correctTimes) : 0;
  
  // Find prompts with longest and shortest times
  const allTimes = stats.prompts
    .filter(p => p.timeSpent !== undefined)
    .map(p => ({ id: p.id, time: p.timeSpent! }));
  
  const longestTimeValue = allTimes.length > 0 ? Math.max(...allTimes.map(t => t.time)) : 0;
  const shortestTimeValue = correctTimes.length > 0 ? Math.min(...correctTimes) : 0;
  
  // Find prompt IDs with longest and shortest times
  const longestPromptIds = allTimes
    .filter(t => t.time === longestTimeValue)
    .map(t => t.id);
  
  const shortestPromptIds = stats.prompts
    .filter(p => p.isCorrect && p.timeSpent === shortestTimeValue)
    .map(p => p.id);

  return (
    <div className="report-screen">
      <div className="report-card">
        <h1 className="report-title">Game Complete</h1>
        
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-label">Average Time</div>
            <div className="stat-value">{formatTime(stats.averageTime)}</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-label">Total Time</div>
            <div className="stat-value">{formatTime(stats.totalTime)}</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-label">Longest Time</div>
            <div className="stat-value">{formatTime(stats.longestTime)}</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-label">Shortest Time</div>
            <div className="stat-value">
              {shortestTime > 0 ? formatTime(shortestTime) : 'N/A'}
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-label">Correct</div>
            <div className="stat-value">{stats.correctCount} / {stats.totalCount}</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-label">Accuracy</div>
            <div className="stat-value">
              {stats.totalCount > 0 
                ? ((stats.correctCount / stats.totalCount) * 100).toFixed(1) + '%'
                : '0%'}
            </div>
          </div>
        </div>

        <div className="prompt-details">
          <h2 className="details-title">Question Details</h2>
          <div className="details-list">
            {stats.prompts.map((prompt, index) => (
              <div key={prompt.id} className="detail-item">
                <span className="detail-number">#{index + 1}</span>
                <span className="detail-phrase">{prompt.phrase}</span>
                {prompt.replayCount !== undefined && prompt.replayCount > 0 ? (
                  <span className="detail-replay">🔄 {prompt.replayCount}</span>
                ) : <span className="detail-replay">&nbsp;</span>}
                <span className={`detail-result ${prompt.isCorrect ? 'correct' : 'incorrect'}`}>
                  {prompt.isCorrect ? '✓' : '✗'}
                </span>
                <span className="detail-time">
                  {longestPromptIds.includes(prompt.id) && (
                    <span className="time-label longest-label">Longest: </span>
                  )}
                  {shortestPromptIds.includes(prompt.id) && (
                    <span className="time-label shortest-label">Shortest: </span>
                  )}
                  {prompt.timeSpent ? formatTime(prompt.timeSpent) : 'N/A'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button className="play-again-button" onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
}

