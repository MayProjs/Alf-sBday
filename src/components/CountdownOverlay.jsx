// src/components/CountdownOverlay.jsx
import React, { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/useGameStore";
import "./CountdownOverlay.css";

function useCountdown(targetDateISO) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = new Date(targetDateISO) - new Date();
    return Math.max(0, diff);
  });

  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDateISO) - new Date();
      setTimeLeft(Math.max(0, diff));
    };

    // update 4x per second for smoothness
    const id = setInterval(tick, 250);
    tick();
    return () => clearInterval(id);
  }, [targetDateISO]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return { timeLeft, days, hours, minutes, seconds };
}

/* FloatingVideo: single drifting video 'particle' */
function FloatingVideo({ src, index }) {
  const ref = useRef();
  const pos = useRef({ x: 0, y: 0, vx: 0, vy: 0, w: 150, h: 150 });
  const rafRef = useRef();

  useEffect(() => {
    const el = ref.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // seed random pos + velocity (slower speeds)
    pos.current.x = Math.random() * (vw - pos.current.w);
    pos.current.y = Math.random() * (vh - pos.current.h);
    pos.current.vx = (Math.random() - 0.5) * (0.2 + Math.random() * 0.6); // px/frame
    pos.current.vy = (Math.random() - 0.5) * (0.2 + Math.random() * 0.6);

    function step() {
      const p = pos.current;
      p.x += p.vx;
      p.y += p.vy;

      // bounce off edges
      if (p.x <= 0) { p.x = 0; p.vx *= -1; }
      if (p.x + p.w >= window.innerWidth) { p.x = window.innerWidth - p.w; p.vx *= -1; }
      if (p.y <= 0) { p.y = 0; p.vy *= -1; }
      if (p.y + p.h >= window.innerHeight) { p.y = window.innerHeight - p.h; p.vy *= -1; }

      // apply transform
      if (el) {
        el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
        // subtle rotation for vibe
        const rot = Math.sin((p.x + p.y + index * 123) / 200) * 3;
        el.style.rotate = `${rot}deg`;
      }

      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [index]);

  return (
    <div
      className="floating-video"
      ref={ref}
      style={{ width: pos.current.w, height: pos.current.h }}
      title="hover to pause"
    >
      <video
        src={src}
        loop
        muted
        playsInline
        autoPlay
        className="floating-video__media"
      />
    </div>
  );
}

export default function CountdownOverlay() {
  // IST target: 2025-12-14T00:00:00+05:30
  const targetISO = "2025-12-13T18:30:00.000Z"; // equivalent UTC for 2025-12-14 00:00 IST
  const { timeLeft, days, hours, minutes, seconds } = useCountdown(targetISO);
  const startGame = useGameStore((s) => s.startGame);
  const [visible, setVisible] = useState(true);

  // sources — edit filenames if you used other names
  const sources = [
    "/videos/gif1.mp4",
    "/videos/gif2.mp4",
    "/videos/gif3.mp4",
    "/videos/gif4.mp4",
    "/videos/gif5.mp4",
    "/videos/gif6.mp4",
    "/videos/gif7.mp4",
    "/videos/gif8.mp4",
    "/videos/gif9.mp4",
    "/videos/gif10.mp4",
    "/videos/gif11.mp4",
    "/videos/gif12.mp4",
    "/videos/gif13.mp4",
    "/videos/gif14.mp4",
    "/videos/gif15.mp4",
  ];

  useEffect(() => {
    if (timeLeft <= 0) {
      // hide overlay, then start the game
      setVisible(false);
      // small delay to let overlay fade
      setTimeout(() => {
        startGame();
      }, 600);
    }
  }, [timeLeft, startGame]);

  if (!visible) return null;

  return (
    <div className="countdown-overlay">
      {/* floating videos */}
      {sources.map((s, i) => (
        <FloatingVideo key={s} src={s} index={i} />
      ))}

      {/* central countdown */}
      <div className="countdown-center" aria-live="polite">
        <div className="countdown-text">
          <span className="big">{String(days).padStart(2, "0")}</span>
          <span className="sep">days</span>
          <span className="big">{String(hours).padStart(2, "0")}</span>
          <span className="sep">hrs</span>
          <span className="big">{String(minutes).padStart(2, "0")}</span>
          <span className="sep">mins</span>
          <span className="big">{String(seconds).padStart(2, "0")}</span>
          <span className="sep">secs</span>
        </div>
        <div className="subtext">left to skip this khia-est day of the year.</div>
      </div>
    </div>
  );
}
