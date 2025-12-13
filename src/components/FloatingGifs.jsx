import "./FloatingGifs.css";

const gifs = [
  "/gifs/gif1.mp4",
  "/gifs/gif2.mp4",
  "/gifs/gif3.mp4",
  "/gifs/gif4.mp4",
  "/gifs/gif5.mp4",
  "/gifs/gif6.mp4",
];

export default function FloatingGifs() {
  return (
    <div className="floating-gifs-container">
      {gifs.map((src, i) => (
        <video
          key={i}
          src={src}
          autoPlay
          loop
          muted
          className="floating-gif"
          style={{
            animationDelay: `${i * 2}s`,
            left: `${Math.random() * 80 + 5}%`,
          }}
        />
      ))}
    </div>
  );
}
