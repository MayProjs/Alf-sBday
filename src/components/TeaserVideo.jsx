import { useEffect, useRef } from "react";
import "./TeaserVideo.css";

export default function TeaserVideo({ onVideoEnd }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "red",
        zIndex: 999999
      }}
      onClick={onVideoEnd}
    >
      <video
        src="/teaser.mp4"
        autoPlay
        muted
        playsInline
        style={{
          width: "100vw",
          height: "100vh",
          objectFit: "cover"
        }}
      />
    </div>
  );
}

