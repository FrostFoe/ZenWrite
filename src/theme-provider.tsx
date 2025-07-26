"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { useSettings } from "@/hooks/use-settings";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { settings } = useSettings();

  React.useEffect(() => {
    // Clean up all possible theme classes
    document.body.classList.remove(
      "theme-vanilla-fog",
      "theme-silk-noir",
      "theme-ocean-mist",
      "theme-minty-fresh",
      "theme-midnight-dusk",
    );
    // Add the currently selected theme class
    if (settings.theme) {
      document.body.classList.add(settings.theme);
    }
    
    // Clean up all possible font classes from the html element
    document.documentElement.classList.remove(
        "font-tiro-bangla",
        "font-hind-siliguri",
        "font-baloo-da-2"
    );
    // Add the currently selected font class to the html element
    if (settings.font) {
      document.documentElement.classList.add(settings.font);
    }

  }, [settings.theme, settings.font]);

  return (
    <NextThemesProvider {...props}>
      <div className={`${settings.theme} ${settings.font}`}>{children}</div>
    </NextThemesProvider>
  );
}
