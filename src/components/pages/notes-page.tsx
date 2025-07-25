"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, PenSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Note } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/nav/sidebar";
import { NotesGrid } from "@/components/notes/notes-grid";
import { NotesList } from "@/components/notes/notes-list";
import NotesHeader from "@/components/notes/notes-header";
import { useSettings } from "@/hooks/use-settings";
import { cn } from "@/lib/utils";
import { createNote } from "@/lib/storage";
import { toast } from "sonner";

type SortOption =
  `${"updatedAt" | "createdAt" | "title" | "charCount"}-${"asc" | "desc"}`;
type ViewMode = "grid" | "list";

export default function NotesPage({ initialNotes }: { initialNotes: Note[] }) {
  const [notes] = useState<Note[]>(initialNotes);
  const [sortOption, setSortOption] = useState<SortOption>("updatedAt-desc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const { settings } = useSettings();
  const fontClass = settings.font.split(" ")[0];
  const router = useRouter();

  const handleNewNote = async () => {
    const noteId = await createNote();
    toast.success("নতুন নোট তৈরি হয়েছে!");
    router.push(`/editor/${noteId}`);
  };

  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      const [key, order] = sortOption.split("-");

      const valA = a[key as keyof Note] || 0;
      const valB = b[key as keyof Note] || 0;

      if (key === "title") {
        return order === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      }

      return order === "asc"
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    });
  }, [notes, sortOption]);

  return (
    <div className="flex h-full bg-background">
      <Sidebar />
      <div className={cn("flex-1 lg:pl-72", fontClass)}>
        <div className="h-full space-y-8 p-4 sm:p-6 lg:p-8">
          <NotesHeader
            sortOption={sortOption}
            setSortOption={setSortOption}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          {sortedNotes.length > 0 ? (
            viewMode === "grid" ? (
              <NotesGrid notes={sortedNotes} />
            ) : (
              <NotesList notes={sortedNotes} />
            )
          ) : (
            <EmptyState onNewNote={handleNewNote} />
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onNewNote }: { onNewNote: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="flex h-full min-h-[50vh] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/50 p-8 text-center"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <PenSquare className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        আপনার ক্যানভাস অপেক্ষা করছে
      </h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        আপনার প্রথম মাস্টারপিস তৈরি করুন। প্রতিটি মহান গল্প একটি একক শব্দ দিয়ে
        শুরু হয়।
      </p>
      <Button onClick={onNewNote} className="mt-6">
        <Plus className="mr-2 h-4 w-4" /> লেখা শুরু করুন
      </Button>
    </motion.div>
  );
}
