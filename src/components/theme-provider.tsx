"use client";

import { useSettings } from "@/hooks/use-settings";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();

  return (
    <div className={`${settings.theme} ${settings.font.split(" ")[0]}`}>
      {children}
    </div>
  );
}
