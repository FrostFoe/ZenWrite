
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { useSettingsStore } from "@/hooks/use-settings";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { font } = useSettingsStore();

  React.useEffect(() => {
    // Clean up all possible font classes from the html element
    document.documentElement.classList.remove(
        "font-tiro-bangla",
        "font-hind-siliguri",
        "font-baloo-da-2"
    );
    // Add the currently selected font class to the html element
    if (font) {
      document.documentElement.classList.add(font);
    }

  }, [font]);

  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
}
