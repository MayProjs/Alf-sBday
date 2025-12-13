import { useGameStore } from "../store/useGameStore";
import "./GameOverScreen.css";

export default function GameOverScreen() {
  const score = useGameStore((s) => s.score);
  const startGame = useGameStore((s) => s.startGame);

  return (
    <div className="ios-modal-overlay">
      <div className="ios-modal-card">
        <div className="ios-modal-icon">💀</div>

        <h2 className="ios-modal-title">Game Over</h2>
        <p className="ios-modal-subtitle">Score: {score}</p>

        <button className="ios-btn" onClick={startGame}>
          Play Again
        </button>
      </div>
    </div>
  );
}
