import React from "react";
import "./BirthdayPage.css";
import RouletteWheel from "./RouletteWheel";
import FloatingGifs from "./FloatingGifs";

export default function BirthdayPage() {
  return (

    
    <div className="birthday-fullscreen">
      <FloatingGifs />
      <div className="birthday-card">
        <h1 className="birthday-title">Happy Birthday Alf!</h1>

        <p className="birthday-message">
          You unlocked the secret birthday zone only the elite make it here.<br />
          Wishing you a day full of joy, chaos, and legendary moments! 📸✨
        </p>

        {/* 👉 Add roulette wheel here */}
        <RouletteWheel />
        <p className="disclaimer">sorry for the bad UI i had bare minimum time to prepare this sheet</p>
      </div>
    </div>
  );
}