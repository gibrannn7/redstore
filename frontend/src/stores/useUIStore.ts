import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEY_DARK_MODE } from '../app/config';

interface UIState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () => set((state) => {
        const newValue = !state.isDarkMode;
        if (newValue) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { isDarkMode: newValue };
      }),
      setDarkMode: (value) => {
        if (value) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ isDarkMode: value });
      },
    }),
    {
      name: STORAGE_KEY_DARK_MODE,
    }
  )
);
