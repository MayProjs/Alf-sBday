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

/* FloatingVideo unchanged */
function FloatingVideo({ src, index }) {
  const ref = useRef();
  const pos = useRef({ x: 0, y: 0, vx: 0, vy: 0, w: 150, h: 150 });
  const rafRef = useRef();

  useEffect(() => {
    const el = ref.current;

    pos.current.x = Math.random() * (window.innerWidth - pos.current.w);
    pos.current.y = Math.random() * (window.innerHeight - pos.current.h);
    pos.current.vx = (Math.random() - 0.5) * 0.6;
    pos.current.vy = (Math.random() - 0.5) * 0.6;

    function step() {
      const p = pos.current;
      p.x += p.vx;
      p.y += p.vy;

      if (p.x <= 0 || p.x + p.w >= window.innerWidth) p.vx *= -1;
      if (p.y <= 0 || p.y + p.h >= window.innerHeight) p.vy *= -1;

      if (el) {
        el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
        el.style.rotate = `${Math.sin((p.x + p.y + index) / 200) * 3}deg`;
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
    >
      <video src={src} loop muted playsInline autoPlay />
    </div>
  );
}

export default function CountdownOverlay() {
  const targetISO = "2025-12-13T18:30:00.000Z"; // IST midnight
  const { timeLeft, days, hours, minutes, seconds } = useCountdown(targetISO);
  const startGame = useGameStore((s) => s.startGame);

  const [stage, setStage] = useState("countdown"); // ⭐ NEW
  const videoRef = useRef(null);                   // ⭐ NEW

  const sources = [
    "/videos/gif1.mp4",
    "/videos/gif2.mp4",
    "/videos/gif3.mp4",
    "/videos/gif4.mp4",
    "/videos/gif5.mp4",
    "/videos/gif6.mp4",
  ];

  // ⭐ switch to video when countdown ends
  useEffect(() => {
    if (timeLeft <= 0 && stage === "countdown") {
      setStage("video");
    }
  }, [timeLeft, stage]);

  // ⭐ autoplay video when stage switches
  useEffect(() => {
    if (stage === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [stage]);

  // 🎬 VIDEO STAGE
  if (stage === "video") {
    return (
      <div className="teaser-overlay">
        <video
          ref={videoRef}
          src="/teaser.mp4"
          autoPlay
          muted
          playsInline
          onClick={() => (videoRef.current.muted = false)}
          onEnded={() => {
            setStage("done");
            startGame(); // ⭐ GAME STARTS ONLY AFTER VIDEO
          }} style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
       <div
        style={{
          position: "absolute",
          bottom: "20px",
          width: "100%",
          textAlign: "center",
          color: "white",
          fontSize: "14px",
          opacity: 0.7,
        }}
      >
        Tap for here for sound 🔊
      </div>
      </div>
    );
  }

  // 🧹 AFTER VIDEO — REMOVE OVERLAY
  if (stage === "done") return null;

  // ⏳ COUNTDOWN STAGE
  return (
    <div className="countdown-overlay">
      {sources.map((s, i) => (
        <FloatingVideo key={s} src={s} index={i} />
      ))}

      <div className="countdown-center">
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

        <div className="subtext">
          left to skip this khia-est day of the year.
        </div>
      </div>
    </div>
  );
}
