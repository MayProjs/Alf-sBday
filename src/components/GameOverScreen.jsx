import { useGameStore } from "../store/useGameStore";

export default function GameOverScreen() {
  const score = useGameStore((s) => s.score);
  const startGame = useGameStore((s) => s.startGame);

  return (
    <div className="game-over-screen">
      <h1 className="go-title">Game Over 💀</h1>
      <p className="go-score">Score: {score}</p>

      <button className="go-btn" onClick={startGame}>
        Play Again
      </button>
    </div>
  );
}
