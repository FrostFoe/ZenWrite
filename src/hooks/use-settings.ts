
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useState, useEffect } from "react";

interface Settings {
  theme: string;
  font: string;
  showSakura: boolean;
}

interface SettingsState extends Settings {
  setSetting: (key: keyof Settings, value: string | boolean) => void;
}

const defaultSettings: Settings = {
  theme: "theme-vanilla-fog",
  font: "font-hind-siliguri",
  showSakura: false,
};

const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      setSetting: (key, value) => set({ [key]: value }),
    }),
    {
      name: "mnrnotes-settings-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// This custom hook handles hydration-safe settings.
export const useSettings = () => {
  // On the server, and during the initial client render, we use default settings.
  const [settings, setSettings] = useState(defaultSettings);
  const setSetting = useSettingsStore((state) => state.setSetting);

  useEffect(() => {
    // After the component mounts on the client, we subscribe to the store.
    // This ensures that we get the settings from localStorage only on the client.
    const unsubscribe = useSettingsStore.subscribe((state) => {
      setSettings({
        theme: state.theme,
        font: state.font,
        showSakura: state.showSakura,
      });
    });

    // Set the initial state from the store once on mount.
    const initialState = useSettingsStore.getState();
    setSettings({
      theme: initialState.theme,
      font: initialState.font,
      showSakura: initialState.showSakura,
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { settings, setSetting };
};
