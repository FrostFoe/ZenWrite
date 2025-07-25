"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Maximize, Loader2, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import PomodoroTimer from "@/components/pomodoro-timer";

type SaveStatus = "unsaved" | "saving" | "saved";

interface EditorHeaderProps {
  saveStatus: SaveStatus;
  onSave: () => void;
  isZenMode: boolean;
  setIsZenMode: (isZen: boolean) => void;
  charCount: number;
}

export default function EditorHeader({
  saveStatus,
  onSave,
  isZenMode,
  setIsZenMode,
  charCount,
}: EditorHeaderProps) {
  const router = useRouter();

  const headerVariants = {
    hidden: { opacity: 0, y: -40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: { opacity: 0, y: -40, transition: { duration: 0.2 } },
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case "saving":
        return "সংরক্ষণ করা হচ্ছে...";
      case "saved":
        return "সংরক্ষিত";
      default:
        return "সংরক্ষিত নয়";
    }
  };

  return (
    <AnimatePresence>
      {!isZenMode && (
        <motion.header
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed top-0 left-0 right-0 z-10 flex h-16 items-center justify-between gap-2 border-b bg-background/80 px-4 backdrop-blur-sm lg:h-auto lg:relative lg:border-none lg:bg-transparent lg:px-0 lg:backdrop-blur-none"
        >
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/notes")}
              className="lg:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/notes")}
              className="hidden lg:inline-flex"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              নোটে ফিরে যান
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground hidden sm:block">
              {charCount} অক্ষর
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {saveStatus === "saving" && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {getSaveStatusText()}
            </div>
            <Button
              variant="outline"
              onClick={onSave}
              size="icon"
              aria-label="Save Note"
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsZenMode(true)}
              aria-label="Enter Zen Mode"
            >
              <Maximize className="h-4 w-4" />
            </Button>
            <PomodoroTimer />
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
