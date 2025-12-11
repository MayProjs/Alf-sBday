import { create } from "zustand";

export const useGameStore = create((set) => ({
  score: 0,
  isPlaying: false,
  gameOver: false,

  isBirthdayUnlocked: false,   // for StartScreen
  showBirthdayPopup: false,    // for toast popup

  startGame: () =>
    set({
      score: 0,
      isPlaying: true,
      gameOver: false,
      showBirthdayPopup: false,
    }),

  endGame: () =>
    set({
      isPlaying: false,
      gameOver: true,
    }),

  addScore: () =>
    set((state) => {
      const newScore = state.score + 1;

      let changes = { score: newScore };

      if (newScore === 3 && !state.isBirthdayUnlocked) {
        changes.isBirthdayUnlocked = true;
        changes.showBirthdayPopup = true;
      }

      return changes;
    }),

  closeBirthdayPopup: () => set({ showBirthdayPopup: false }),
}));
