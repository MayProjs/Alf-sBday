import { useState, useRef, useEffect } from "react";
import StartScreen from "./components/StartScreen";
import GameCanvas from "./components/GameCanvas";
import CountdownOverlay from "./components/CountdownOverlay";

export default function App() {
  const [showVideo, setShowVideo] = useState(true);
  const videoRef = useRef(null);

  // useEffect(() => {
  //   if (videoRef.current) {
  //     videoRef.current.play().catch(() => {
  //       // if autoplay fails, user can tap once
  //     });
  //   }
  // }, []);

  //  if (showVideo) {
  //   return (
  //     <div style={{ width: "100vw", height: "100vh", background: "black" }}>
  //       <video
  //       ref={videoRef}
  //       src="/teaser.mp4"
  //       autoPlay
  //       muted
  //       playsInline
  //       onClick={() => {
  //         videoRef.current.muted = false;
  //       }}
  //       onEnded={() => setShowVideo(false)}
  //       style={{
  //         position: "absolute",
  //         inset: 0,
  //         width: "100%",
  //         height: "100%",
  //         objectFit: "contain",
  //       }}
  //     />
  //      <div
  //       style={{
  //         position: "absolute",
  //         bottom: "20px",
  //         width: "100%",
  //         textAlign: "center",
  //         color: "white",
  //         fontSize: "14px",
  //         opacity: 0.7,
  //       }}
  //     >
  //       Tap for sound 🔊
  //     </div>
  //     </div>
  //   );
  // }


  return (
    <>
      <CountdownOverlay />
      <StartScreen />
      <GameCanvas />
    </>
  );
}
