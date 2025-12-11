// src/components/BirthdayScreen.js
import { useGameStore } from "../store/useGameStore.js";

export default function BirthdayScreen() {
  const isBirthdayUnlocked = useGameStore((s) => s.isBirthdayUnlocked);
  const startGame = useGameStore((s) => s.startGame);

  if (!isBirthdayUnlocked) return null;

  return (
    <div className="birthday-screen">
      <h1>🎉 Happy Birthday Alf! 🎉</h1>
      <p>You reached the party! 🥳</p>
      <button onClick={startGame}>Play Again</button>
    </div>
  );
}
