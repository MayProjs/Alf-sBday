import { useEffect, useRef } from "react";
import { useGameStore } from "../store/useGameStore.js";

export default function GameCanvas() {
  const canvasRef = useRef(null);

  const isPlaying = useGameStore((s) => s.isPlaying);
  const addScore = useGameStore((s) => s.addScore);
  const endGame = useGameStore((s) => s.endGame);
  const showPopup = useGameStore((s) => s.showBirthdayPopup);
  const closePopup = useGameStore((s) => s.closeBirthdayPopup);
  const score = useGameStore((s) => s.score);

  const animationRef = useRef(null);

  useEffect(() => {
    if (!isPlaying) return cancelAnimationFrame(animationRef.current);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const width = canvas.width;
    const height = canvas.height;

    let obstacles = [];
    let frame = 0;

    const player = {
      x: 60,
      y: height / 2,
      size: 20,
      vel: 0,
      gravity: 0.25,
      jump: -6,
    };

    const jump = () => (player.vel = player.jump);
    window.addEventListener("mousedown", jump);
    window.addEventListener("touchstart", jump);

    const loop = () => {
      if (!useGameStore.getState().isPlaying) return;

      ctx.clearRect(0, 0, width, height);

      // physics
      player.vel += player.gravity;
      player.y += player.vel;

      // draw
      ctx.fillStyle = "gold";
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
      ctx.fill();

      frame++;
      if (frame % 120 === 0) {
        const gap = 260;
        const top = Math.random() * (height - gap - 100) + 40;

        obstacles.push({
          x: width,
          width: 70,
          top,
          gap,
          counted: false,
        });
      }

      obstacles.forEach((o) => {
        o.x -= 4;

        ctx.fillStyle = "maroon";
        ctx.fillRect(o.x, 0, o.width, o.top);
        ctx.fillRect(o.x, o.top + o.gap, o.width, height);

        // collision
        const hit =
          player.x + player.size > o.x &&
          player.x - player.size < o.x + o.width &&
          (player.y - player.size < o.top ||
            player.y + player.size > o.top + o.gap);

        if (hit) {
          endGame();
          return;
        }

        // scoring
      // scoring (only when actually playing!)
if (!o.counted && o.x + o.width < player.x) {
  
  const state = useGameStore.getState();

  if (state.isPlaying && !state.gameOver) {
    addScore();   // <-- NOW it only increments during true gameplay
  }

  o.counted = true;

  if (showPopup) {
    setTimeout(() => closePopup(), 3000);
  }
}

      });

      animationRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("mousedown", jump);
      window.removeEventListener("touchstart", jump);
    };
  }, [isPlaying]);
  
  return (
    <>
      {/* LIVE SCORE */}
      {isPlaying && <div className="score-display">Score: {score}</div>}

      {/* NON-BLOCKING TOAST */}
      {showPopup && (
        <div className="birthday-toast">🎉 Birthday Zone Unlocked! 🎂</div>
      )}

      <canvas ref={canvasRef} className="game-canvas"></canvas>
    </>
  );
}
