import { useGameStore } from "../store/useGameStore";

export default function ScoreOverlay() {
  const score = useGameStore((s) => s.score);
  const isPlaying = useGameStore((s) => s.isPlaying);

  if (!isPlaying) return null;

  return (
    <div className="score-overlay">
      {score}
    </div>
  );
}
