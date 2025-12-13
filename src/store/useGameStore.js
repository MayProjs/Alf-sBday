import { create } from "zustand";

export const useGameStore = create((set) => ({
  score: 0,
  isPlaying: false,
  gameOver: false,

  isBirthdayUnlocked: false,   // for StartScreen
  showBirthdayPopup: false,    // for toast popup
  birthdayShouldRedirect: false, // redirect only AFTER death

  startGame: () =>
  set({
    score: 0,
    isPlaying: true,
    gameOver: false,
    showBirthdayPopup: false,
    // ADD THESE
    birthdayShouldRedirect: false,
    isBirthdayUnlocked: false,
  }),


  endGame: () =>
    set({
      isPlaying: false,
      gameOver: true,
    }),

  addScore: () =>
    set((state) => {
      const newScore = state.score + 1;
      const updates = { score: newScore };

      let changes = { score: newScore };

   // Unlock birthday zone at score 10
     if (newScore === 3 && !state.isBirthdayUnlocked) {
  updates.isBirthdayUnlocked = true;
  updates.birthdayShouldRedirect = true;
  updates.showBirthdayPopup = true;
}


      return updates;
    }),

  closeBirthdayPopup: () => set({ showBirthdayPopup: false }),
}));
