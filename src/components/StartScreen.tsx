import './StartScreen.css';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="start-screen">
      <div className="start-card">
        <h1 className="start-title">Chinese Number Drill</h1>
        <p className="start-description">
          Listen to numbers and type your answer quickly!
        </p>
        <button className="start-button" onClick={onStart}>
          Start Game
        </button>
      </div>
    </div>
  );
}

