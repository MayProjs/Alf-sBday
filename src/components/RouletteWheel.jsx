import { useState, useRef } from "react";
import "./RouletteWheel.css";

export default function RouletteWheel() {
  const [angle, setAngle] = useState(0);
  const wheelRef = useRef(null);
  const audioRef = useRef(null);

  // List of 6 songs
  const songs = [
    "/songs/song1.mp3",
    "/songs/song2.mp3",
    "/songs/song3.mp3",
    "/songs/song4.mp3",
    "/songs/song5.mp3",
    "/songs/song6.mp3",
  ];

  const spinWheel = () => {
    // Pick a random section (0–5)
    const randomIndex = Math.floor(Math.random() * 6);

    // Each section = 360 / 6 = 60 degrees
    const newAngle = angle + 360 * 5 + randomIndex * 60;

    setAngle(newAngle);

    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Play selected song after spin animation completes
    setTimeout(() => {
      const selectedSong = new Audio(songs[randomIndex]);
      audioRef.current = selectedSong;
      selectedSong.play();
    }, 3000); // match CSS animation duration
  };

  return (
    <div className="roulette-container">
      <br />
      <h2>Enjoy the Floptropican Roulette</h2>
      <p>Explicit Lyrics warning so lower your volumns. Also, expect delay is audio sometimes</p>
      <p></p>
      <img
        ref={wheelRef}
        onClick={spinWheel}
        className="roulette-wheel"
        src="/wheel.png"   // PNG wheel with 6 slices
        alt="roulette wheel"
        style={{ transform: `rotate(${angle}deg)` }}
      />
      <div className="arrow">▲</div>
    </div>
  );
}
