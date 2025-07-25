"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { useSettings } from "@/hooks/use-settings";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { settings } = useSettings();

  React.useEffect(() => {
    document.body.classList.remove(
      "theme-vanilla-fog",
      "theme-silk-noir",
      "theme-ocean-mist",
    );
    document.body.classList.add(settings.theme);

    document.documentElement.classList.remove("font-tiro-bangla");
    document.documentElement.classList.add(settings.font);
  }, [settings.theme, settings.font]);

  return (
    <NextThemesProvider {...props}>
      <div className={`${settings.theme} ${settings.font}`}>{children}</div>
    </NextThemesProvider>
  );
}
