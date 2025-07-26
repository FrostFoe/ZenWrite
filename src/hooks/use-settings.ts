
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserProfile } from "src/lib/types";

interface Settings {
  theme: string;
  font: string;
  isDriveSyncEnabled: boolean;
  userProfile: UserProfile | null;
}

interface SettingsState extends Settings {
  setSetting: (key: keyof Omit<Settings, 'userProfile' | 'isDriveSyncEnabled'>, value: string | boolean) => void;
  setUserProfile: (profile: UserProfile) => void;
  clearUserProfile: () => void;
  toggleDriveSync: (enabled: boolean) => void;
}

const defaultSettings: Settings = {
  theme: "theme-vanilla-fog",
  font: "font-hind-siliguri",
  isDriveSyncEnabled: false,
  userProfile: null,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      setSetting: (key, value) => set({ [key]: value }),
      setUserProfile: (profile) => set({ userProfile: profile, isDriveSyncEnabled: true }),
      clearUserProfile: () => set({ userProfile: null, isDriveSyncEnabled: false }),
      toggleDriveSync: (enabled) => set({ isDriveSyncEnabled: enabled }),
    }),
    {
      name: "mnrnotes-settings-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        font: state.font,
        isDriveSyncEnabled: state.isDriveSyncEnabled,
        userProfile: state.userProfile,
      }),
    },
  ),
);
