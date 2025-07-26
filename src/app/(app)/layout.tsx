
"use client";

import BottomNav from "@/components/nav/bottom-nav";
import ScrollProgress from "@/components/ui/scroll-progress";
import { useSettings } from "@/hooks/use-settings";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  return (
    <div className="flex h-full flex-col">
      <ScrollProgress />
      <main className="flex-1 overflow-y-auto pb-24 lg:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
