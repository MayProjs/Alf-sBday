import { useGameStore } from "../store/useGameStore";

export default function StartScreen() {
  const isPlaying = useGameStore((s) => s.isPlaying);
  const score = useGameStore((s) => s.score);
  const birthdayUnlocked = useGameStore((s) => s.isBirthdayUnlocked);
  const startGame = useGameStore((s) => s.startGame);

  // 👉 DO NOT SHOW anything during gameplay
  if (isPlaying) return null;

  // 👉 Game over + birthday unlocked
  if (score >= 10 && birthdayUnlocked) {
    return (
      <div className="birthday-wrapper">
        <h1>🎉 Happy Birthday Alf! 🎉</h1>
        <p>You reached the party! 🎂</p>
        <button onClick={startGame}>Play Again</button>
      </div>
    );
  }

  // 👉 Normal game over
  if (score > 0) {
    return (
      <div className="game-over">
        <h1>Game Over 💀</h1>
        <p>Score: {score}</p>
        <button onClick={startGame}>Play Again</button>
      </div>
    );
  }

  // 👉 Start screen (before playing)
  return (
    <div className="start-screen">
      <h1>Tap to Start</h1>
      <button onClick={startGame}>Start Game</button>
    </div>
  );
}
