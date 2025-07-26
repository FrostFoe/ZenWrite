
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Settings {
  font: string;
}

interface SettingsState extends Settings {
  setSetting: (key: keyof Settings, value: string) => void;
}

const defaultSettings: Settings = {
  font: "font-hind-siliguri",
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      setSetting: (key, value) => set({ [key]: value }),
    }),
    {
      name: "mnrnotes-settings-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist font setting
      partialize: (state) => ({
        font: state.font,
      }),
    },
  ),
);
