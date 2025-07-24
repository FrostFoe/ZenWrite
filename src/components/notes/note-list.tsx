"use client";

import { useState, useMemo } from "react";
import type { Note } from "@/types/note";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  ListFilter,
  FileText,
  Loader2,
  Download,
  Upload,
  Sun,
  Moon,
} from "lucide-react";
import NoteCard from "./note-card";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import AiChatButton from "@/components/ai/ai-chat-button";

interface NoteListProps {
  notes: Note[];
  onNewNote: () => void;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isTransitioning: boolean;
}

type SortOption =
  `${"updatedAt" | "createdAt" | "title" | "charCount"}-${"asc" | "desc"}`;

export default function NoteList({
  notes,
  onNewNote,
  onSelectNote,
  onDeleteNote,
  onExport,
  onImport,
  isTransitioning,
}: NoteListProps) {
  const [sort, setSort] = useState<SortOption>("updatedAt-desc");
  const { theme, setTheme } = useTheme();

  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      const [key, order] = sort.split("-") as [keyof Note, "asc" | "desc"];

      let valA = a[key];
      let valB = b[key];

      if (key === "title") {
        return order === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      }

      if (key === "charCount") {
        valA = a.charCount || 0;
        valB = b.charCount || 0;
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return order === "asc" ? valA - valB : valB - valA;
      }

      return 0;
    });
  }, [notes, sort]);

  const handleImportClick = () => {
    const fileInput = document.getElementById("import-input");
    fileInput?.click();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  if (!notes.length && !isTransitioning) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-card/50 dark:bg-card/20 rounded-lg">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
          <FileText
            className="mx-auto h-16 w-16 text-muted-foreground/50"
            strokeWidth={1}
          />
        </motion.div>
        <h2 className="mt-6 text-2xl font-semibold text-foreground">
          No notes yet
        </h2>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Ready to capture your thoughts? Get started by creating a new note or
          importing existing ones.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button onClick={onNewNote} size="lg" disabled={isTransitioning}>
            {isTransitioning ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Plus className="mr-2 h-5 w-5" />
            )}
            {isTransitioning ? "Loading..." : "Create First Note"}
          </Button>
          <Button onClick={handleImportClick} size="lg" variant="outline">
            <Upload className="mr-2 h-5 w-5" />
            Import Notes
          </Button>
          <input
            type="file"
            id="import-input"
            className="hidden"
            accept=".json"
            onChange={onImport}
          />
        </div>
        <AiChatButton />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <header className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4 py-4 sticky top-0 bg-background/80 dark:bg-background/50 backdrop-blur-md z-10 -mx-4 px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight self-start sm:self-center">
          Notes
        </h1>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Select
            value={sort}
            onValueChange={(value: SortOption) => setSort(value)}
          >
            <SelectTrigger className="w-full sm:w-auto sm:min-w-[180px] h-11">
              <ListFilter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="updatedAt-desc">Recently Updated</SelectItem>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                <SelectItem value="charCount-desc">Length (Longest)</SelectItem>
                <SelectItem value="charCount-asc">Length (Shortest)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              className="flex-1 h-11"
              onClick={onExport}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-11"
              onClick={handleImportClick}
            >
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <input
              type="file"
              id="import-input"
              className="hidden"
              accept=".json"
              onChange={onImport}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={onNewNote}
              className="flex-grow whitespace-nowrap h-11"
              disabled={isTransitioning}
            >
              {isTransitioning ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              New Note
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 flex-shrink-0"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </div>
      </header>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence>
          {sortedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onSelect={onSelectNote}
              onDelete={onDeleteNote}
            />
          ))}
        </AnimatePresence>
      </motion.div>
      <AiChatButton />
    </div>
  );
}
