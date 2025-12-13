import React, { useEffect, useRef } from "react";
import { useGameStore } from "../store/useGameStore.js";

const IMG_SRC = "/alf.png";         // put elf.png in /public
const AUDIO_SRC = "/songs/charlie.mp3"; // looped background track in /public/songs

export default function GameCanvas() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  // Zustand selectors
  const isPlaying = useGameStore((s) => s.isPlaying);
  const endGame = useGameStore((s) => s.endGame);
  const addScore = useGameStore((s) => s.addScore);
  const score = useGameStore((s) => s.score);

  // Refs for media/resources
  const imgRef = useRef(new Image());
  const audioRef = useRef(null);
  const resourcesLoaded = useRef({ img: false, audio: false });

  useEffect(() => {
    // load image
    const img = imgRef.current;
    img.src = IMG_SRC;
    img.onload = () => (resourcesLoaded.current.img = true);
    img.onerror = () => {
      console.warn("Failed to load elf image at", IMG_SRC);
      resourcesLoaded.current.img = false;
    };

    // prepare audio (but don't auto-play until user starts game)
    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;
    audio.oncanplay = () => (resourcesLoaded.current.audio = true);
    audio.onerror = () => {
      console.warn("Failed to load audio at", AUDIO_SRC);
      resourcesLoaded.current.audio = false;
    };

    return () => {
      // cleanup audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // resize
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);

    // player with image
    const player = {
      x: 80,
      y: canvas.height / 2,
      size: 40, // radius for drawing fallback; image will be size*2
      vel: 0,
      gravity: 0.25,
      jumpPower: -6,
    };

    let obstacles = [];
    let frame = 0;

    const addObstacle = () => {
      const gap = 450;
      const top = Math.random() * (canvas.height - gap - 120) + 40;
      obstacles.push({
        x: canvas.width,
        width: 70,
        top,
        gap,
        counted: false,
      });
    };

    const jump = () => {
      player.vel = player.jumpPower;

      // On first user interaction (tap) browsers will allow audio play.
      // If audio loaded, start/resume it on user interaction.
      const audio = audioRef.current;
      if (audio && resourcesLoaded.current.audio && audio.paused && isPlaying) {
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.then === "function") {
          playPromise.catch((e) => {
            // Safari/Chrome might reject if not allowed; ignore gracefully
            console.warn("Audio play blocked:", e);
          });
        }
      }
    };

    // attach touch/mouse
    window.addEventListener("touchstart", jump);
    window.addEventListener("mousedown", jump);

    const loop = () => {
      // stop loop if game no longer playing
      if (!useGameStore.getState().isPlaying) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // physics
      player.vel += player.gravity;
      player.y += player.vel;

      // draw background (optional)
      ctx.fillStyle = "#0f0f0f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // draw player: prefer img if loaded, else fallback circle
      const img = imgRef.current;
      if (resourcesLoaded.current.img && img.complete) {
        const drawW = player.size * 2.8; // scale factor - tweak if needed
        const drawH = player.size * 2.8;
        ctx.save();
        ctx.beginPath();
        // optional: circular mask so elf.png fits in circle
        ctx.arc(player.x, player.y, drawW / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, player.x - drawW / 2, player.y - drawH / 2, drawW, drawH);
        ctx.restore();
      } else {
        // fallback: gold circle
        ctx.fillStyle = "gold";
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // obstacles generation
      frame++;
      if (frame % 120 === 0) addObstacle();

      // move & draw obstacles, detect collisions & scoring
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        o.x -= 4;

        ctx.fillStyle = "#6b0000";
        ctx.fillRect(o.x, 0, o.width, o.top);
        ctx.fillRect(o.x, o.top + o.gap, o.width, canvas.height);

        // collision
        const hit =
          player.x + player.size > o.x &&
          player.x - player.size < o.x + o.width &&
          (player.y - player.size < o.top || player.y + player.size > o.top + o.gap);

        if (hit) {
          // stop music immediately
          if (audioRef.current) {
            try {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            } catch (e) {}
          }

          // mark game over in store
          endGame();
          return; // exit frame
        }

        // scoring: only while actually playing
        if (!o.counted && o.x + o.width < player.x) {
          const state = useGameStore.getState();
          if (state.isPlaying && !state.gameOver) {
            addScore();
          }
          o.counted = true;
        }

        // remove off-screen
        if (o.x + o.width < 0) {
          obstacles.splice(i, 1);
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    if (isPlaying) {
      // start audio when gameplay starts (try to play)
      if (audioRef.current && resourcesLoaded.current.audio) {
        const p = audioRef.current.play();
        if (p && typeof p.then === "function") {
          p.catch(() => {
            /* ignore if blocked (user interaction needed) */
          });
        }
      }

      loop();
    }

    return () => {
      // cleanup
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousedown", jump);
      window.removeEventListener("touchstart", jump);
      window.removeEventListener("resize", setSize);
      // pause audio on unmount
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        } catch (e) {}
      }
    };
  }, [isPlaying, endGame, addScore]);

  return (
    <>
      <canvas ref={canvasRef} className="game-canvas" style={{ display: "block", width: "100%", height: "100vh" }} />
    </>
  );
}
