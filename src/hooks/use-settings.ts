
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useState, useEffect } from "react";
import { UserProfile } from "src/lib/types";

interface Settings {
  theme: string;
  font: string;
  isDriveSyncEnabled: boolean;
  userProfile: UserProfile | null;
}

interface SettingsState extends Settings {
  setSetting: (key: keyof Settings, value: string | boolean) => void;
  setUserProfile: (profile: UserProfile) => void;
  clearUserProfile: () => void;
}

const defaultSettings: Settings = {
  theme: "theme-vanilla-fog",
  font: "font-hind-siliguri",
  isDriveSyncEnabled: false,
  userProfile: null,
};

const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      setSetting: (key, value) => set({ [key]: value }),
      setUserProfile: (profile) => set({ userProfile: profile, isDriveSyncEnabled: true }),
      clearUserProfile: () => set({ userProfile: null, isDriveSyncEnabled: false }),
    }),
    {
      name: "mnrnotes-settings-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist a subset of the fields
      partialize: (state) => ({
        theme: state.theme,
        font: state.font,
        isDriveSyncEnabled: state.isDriveSyncEnabled,
        userProfile: state.userProfile,
      }),
    },
  ),
);

// This custom hook handles hydration-safe settings.
export const useSettings = () => {
  const settings = useSettingsStore((state) => state);
  const [hydratedSettings, setHydratedSettings] = useState(defaultSettings);

  useEffect(() => {
    // After the component mounts on the client, we subscribe to the store.
    // This ensures that we get the settings from localStorage only on the client.
    const unsubscribe = useSettingsStore.subscribe((state) => {
      setHydratedSettings({
        theme: state.theme,
        font: state.font,
        isDriveSyncEnabled: state.isDriveSyncEnabled,
        userProfile: state.userProfile,
      });
    });

    // Set the initial state from the store once on mount.
    const initialState = useSettingsStore.getState();
    setHydratedSettings({
      theme: initialState.theme,
      font: initialState.font,
      isDriveSyncEnabled: initialState.isDriveSyncEnabled,
      userProfile: initialState.userProfile,
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { 
    settings: hydratedSettings, 
    setSetting: settings.setSetting, 
    setUserProfile: settings.setUserProfile,
    clearUserProfile: settings.clearUserProfile
  };
};

// Also export the store directly for non-React usage
export { useSettingsStore };
