"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useState, useEffect } from "react";

interface Settings {
  theme: string;
  font: string;
}

interface SettingsState extends Settings {
  setSetting: (key: keyof Settings, value: string) => void;
}

const defaultSettings: Settings = {
  theme: "theme-vanilla-fog",
  font: "font-tiro-bangla",
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

export const useSettings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const storeSettings = useSettingsStore((state) => state);

  useEffect(() => {
    // This effect runs on the client after hydration
    // It updates the state with the values from localStorage (via the store)
    setSettings(storeSettings);
  }, [storeSettings]);

  // On the server, and during the initial client render before hydration,
  // `settings` will be `defaultSettings`.
  // After hydration, `settings` will be updated to the stored values.
  return { settings: settings, setSetting: storeSettings.setSetting };
};

// Apply theme class to HTML element
if (typeof window !== "undefined") {
  const applyTheme = (state: SettingsState) => {
    const html = document.documentElement;
    const currentClasses = Array.from(html.classList);
    const themeClasses = currentClasses.filter(
      (c) => c.startsWith("theme-") || c.startsWith("font-"),
    );
    html.classList.remove(...themeClasses);
    html.classList.add(state.theme);
    html.classList.add(state.font);
  };

  // Initial load
  applyTheme(useSettingsStore.getState());

  // Subscribe to changes
  useSettingsStore.subscribe(applyTheme);
}
