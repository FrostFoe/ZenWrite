
"use client";

import { Note } from "@/lib/types";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSettingsStore } from "@/hooks/use-settings";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { getTextFromEditorJS } from "@/lib/utils";
import { Badge } from "../ui/badge";

interface NotesListProps {
  notes: Note[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function NotesListComponent({ notes }: NotesListProps) {
  const font = useSettingsStore((state) => state.font);
  const fontClass = font.split(" ")[0];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {notes.map((note) => (
        <motion.div key={note.id} variants={itemVariants}>
          <Link
            href={`/editor/${note.id}`}
            className={cn(
              "block rounded-lg border p-4 transition-colors hover:bg-accent",
              note.isPinned ? "border-primary/30 bg-primary/5" : "border",
              fontClass,
            )}
          >
            <div className="mb-2 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <h3 className="line-clamp-1 flex-1 font-semibold text-foreground">
                {note.title || "শিরোনামহীন নোট"}
              </h3>
              <p className="flex-shrink-0 text-xs text-muted-foreground">
                {format(new Date(note.updatedAt), "PP", { locale: bn })}
              </p>
            </div>
            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
              {getTextFromEditorJS(note.content).substring(0, 150)}...
            </p>
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {note.tags.slice(0, 5).map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}

export const NotesList = memo(NotesListComponent);
