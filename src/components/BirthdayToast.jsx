import { useEffect } from "react";
import { useGameStore } from "../store/useGameStore";
import "./BirthdayToast.css";

export default function BirthdayToast() {
  const show = useGameStore((s) => s.showBirthdayPopup);
  const close = useGameStore((s) => s.closeBirthdayPopup);

  // Auto-hide after 3 seconds
  useEffect(() => {
    if (show) {
      const t = setTimeout(() => close(), 3000);
      return () => clearTimeout(t);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="ios-toast">
      {/* <div className="ios-toast-icon">🎉</div> */}
      <div className="ios-toast-text">
        <div className="title">Birthday Zone Unlocked</div>
        <div className="subtitle">You reached Alf's special level</div>
      </div>
    </div>
  );
}
