import StartScreen from "./components/StartScreen";
import GameCanvas from "./components/GameCanvas";
import GameOverScreen from "./components/GameOverScreen";
import BirthdayScreen from "./components/BirthdayScreen";
import ScoreOverlay from "./components/ScoreOverlay";
import BirthdayToast from "./components/BirthdayToast";
import { useGameStore } from "./store/useGameStore";
import CountdownOverlay from "./components/CountdownOverlay";

export default function App() {
  const isPlaying = useGameStore((s) => s.isPlaying);
  const gameOver = useGameStore((s) => s.gameOver);

  return (
    <div className="app">
       <CountdownOverlay />
      <StartScreen />
      {/* <ScoreOverlay /> */}
      <GameCanvas />
      {gameOver && <GameOverScreen />}
      <BirthdayScreen />
      <BirthdayToast />
    </div>
  );
}
