
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserProfile } from "src/lib/types";

interface Settings {
  font: string;
  userProfile: UserProfile | null;
}

interface SettingsState extends Settings {
  setSetting: (key: keyof Omit<Settings, 'userProfile'>, value: string) => void;
  setUserProfile: (profile: UserProfile) => void;
  clearUserProfile: () => void;
}

const defaultSettings: Settings = {
  font: "font-hind-siliguri",
  userProfile: null,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      setSetting: (key, value) => set({ [key]: value }),
      setUserProfile: (profile) => set({ userProfile: profile }),
      clearUserProfile: () => set({ userProfile: null }),
    }),
    {
      name: "mnrnotes-settings-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist font and user profile settings
      partialize: (state) => ({
        font: state.font,
        userProfile: state.userProfile,
      }),
    },
  ),
);
