"use client";

import { useMemo } from "react";
import { Book, Tag, Type } from "lucide-react";
import { motion } from "framer-motion";

import { useNotes } from "@/stores/use-notes";
import { useSettingsStore } from "@/stores/use-settings";
import { cn } from "@/lib/utils";
import Loading from "@/app/loading";
import StatCard from "./_components/stat-card";

export default function DashboardPage() {
  const font = useSettingsStore((state) => state.font);
  const fontClass = font.split(" ")[0];
  const notes = useNotes((state) => state.notes);
  const isLoading = useNotes((state) => state.isLoading);

  const stats = useMemo(() => {
    const totalNotes = notes.length;
    const totalWords = notes.reduce((acc, note) => {
      if (!note.content || !note.content.blocks) return acc;
      const text =
        note.content.blocks
          .map((block) => block.data.text || "")
          .join(" ") || "";
      return acc + text.split(/\s+/).filter(Boolean).length;
    }, 0);

    const tagCounts: { [key: string]: number } = {};
    notes.forEach((note) => {
      note.tags?.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return {
      totalNotes,
      totalWords,
      totalTags: Object.keys(tagCounts).length,
    };
  }, [notes]);

  if (isLoading) {
    return <Loading />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className={cn("h-full space-y-8 p-4 sm:p-6 lg:p-8", fontClass)}>
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          ড্যাশবোর্ড
        </h1>
        <p className="mt-2 text-muted-foreground">
          আপনার লেখার পরিসংখ্যান দেখুন।
        </p>
      </header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <StatCard title="মোট নোট" value={stats.totalNotes} icon={Book} />
        <StatCard
          title="মোট শব্দ"
          value={stats.totalWords.toLocaleString()}
          icon={Type}
        />
        <StatCard title="ব্যবহৃত ট্যাগ" value={stats.totalTags} icon={Tag} />
      </motion.div>
    </div>
  );
}
