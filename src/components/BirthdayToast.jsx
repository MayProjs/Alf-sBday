import { useEffect } from "react";
import { useGameStore } from "../store/useGameStore";

export default function BirthdayToast() {
  const show = useGameStore((s) => s.showBirthdayPopup);
  const close = useGameStore((s) => s.closeBirthdayPopup);

  // auto-hide after 3 seconds
  useEffect(() => {
    if (show) {
      const t = setTimeout(() => {
        close();
      }, 3000);

      return () => clearTimeout(t);
    }
  }, [show]);

  return (
    <div className={`birthday-toast ${show ? "show" : ""}`}>
      🎉 Birthday Mode Unlocked! Continue scoring to explore it!
    </div>
  );
}
