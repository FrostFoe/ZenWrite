"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
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

type SortOption =
  `${"updatedAt" | "createdAt" | "title" | "charCount"}-${"asc" | "desc"}`;
type ViewMode = "grid" | "list";

export default function NotesPage({ initialNotes }: { initialNotes: Note[] }) {
  const [notes] = useState<Note[]>(initialNotes);
  const [sortOption, setSortOption] = useState<SortOption>("updatedAt-desc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const { settings } = useSettings();
  const fontClass = settings.font.split(" ")[0];

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
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex h-full min-h-[50vh] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/50 p-8 text-center"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <PenSquare className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        Your canvas awaits
      </h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Create your first masterpiece. Every great story begins with a single
        word.
      </p>
      <Button asChild className="mt-6">
        <Link href="/editor/new">
          <Plus className="mr-2 h-4 w-4" /> Start Writing
        </Link>
      </Button>
    </motion.div>
  );
}
