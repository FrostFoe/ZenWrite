"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RefreshCw, Coffee, BrainCircuit } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const WORK_DURATION = 25 * 60; // 25 minutes
const BREAK_DURATION = 5 * 60; // 5 minutes

type TimerMode = "work" | "break";

export default function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Switch modes
      const newMode: TimerMode = mode === "work" ? "break" : "work";
      setMode(newMode);
      setTimeLeft(
        newMode === "work" ? WORK_DURATION : BREAK_DURATION,
      );
      setIsActive(true); // Automatically start next session
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode("work");
    setTimeLeft(WORK_DURATION);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalDuration =
    mode === "work" ? WORK_DURATION : BREAK_DURATION;
  const progress = (totalDuration - timeLeft) / totalDuration;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open Pomodoro Timer">
          {mode === "work" ? (
            <BrainCircuit className="h-5 w-5" />
          ) : (
            <Coffee className="h-5 w-5" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {mode === "work" ? "Focus Session" : "Take a Break"}
          </DialogTitle>
        </DialogHeader>
        <div className="relative my-8 flex h-48 w-48 items-center justify-center self-center">
          <svg className="absolute inset-0" viewBox="0 0 100 100">
            <circle
              className="stroke-current text-muted"
              strokeWidth="5"
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
            />
            <motion.circle
              className="stroke-current text-primary"
              strokeWidth="5"
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ pathLength: progress }}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </svg>
          <AnimatePresence mode="wait">
            <motion.div
              key={timeLeft}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-5xl font-bold tabular-nums text-foreground"
            >
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Button onClick={toggleTimer} size="lg" className="flex-1">
            {isActive ? (
              <Pause className="mr-2 h-5 w-5" />
            ) : (
              <Play className="mr-2 h-5 w-5" />
            )}
            {isActive ? "Pause" : "Start"}
          </Button>
          <Button onClick={resetTimer} variant="outline" size="icon">
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
