"use client";

import BottomNav from "@/components/layout/bottom-nav";
import Sidebar from "@/components/layout/sidebar";
import ScrollProgress from "@/components/ui/scroll-progress";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores/use-settings";
import { AnimatePresence } from "framer-motion";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const font = useSettingsStore((state) => state.font);

  return (
    <div className="flex h-full bg-background">
      <ScrollProgress />
      <AnimatePresence>
        <Sidebar />
      </AnimatePresence>
      <div className={cn("flex-1 lg:pl-72", font.split(" ")[0])}>
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-0 h-full">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
