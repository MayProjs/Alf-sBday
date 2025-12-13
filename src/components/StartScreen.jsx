import { useGameStore } from "../store/useGameStore";
import GameOverScreen from "./GameOverScreen";
import BirthdayPage from "./BirthdayPage";

export default function StartScreen() {
  const isPlaying = useGameStore((s) => s.isPlaying);
  const score = useGameStore((s) => s.score);
  const gameOver = useGameStore((s) => s.gameOver);
  const birthdayUnlocked = useGameStore((s) => s.isBirthdayUnlocked);
  const shouldRedirect = useGameStore((s) => s.birthdayShouldRedirect);
  const startGame = useGameStore((s) => s.startGame);

  // 🎮 Never show UI while playing
  if (isPlaying) return null;

  // 🎉 Game over AND birthday unlocked → redirect to birthday page
  if (gameOver && shouldRedirect) {
    return (
      <BirthdayPage/>
    );
  }

  // 💀 Normal Game Over
  if (gameOver) {
    return (
      <GameOverScreen/>
    );
  }

  // 🟡 Start screen before gameplay
  return (
    <div className="start-screen">
      <h1>Tap to Start</h1>
      <button onClick={startGame}>Start Game</button>
    </div>
  );
}
