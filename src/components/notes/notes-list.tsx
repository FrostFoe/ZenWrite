
"use client";

import { Note } from "@/lib/types";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSettings } from "@/hooks/use-settings";
import { cn } from "@/lib/utils";
import { memo } from "react";

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
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

function NotesListComponent({ notes }: NotesListProps) {
  const { settings } = useSettings();
  const fontClass = settings.font.split(" ")[0];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2"
    >
      {notes.map((note) => (
        <motion.div key={note.id} variants={itemVariants}>
          <Link
            href={`/editor/${note.id}`}
            className={cn(
              "block rounded-lg p-4 transition-colors hover:bg-accent",
              fontClass,
            )}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">
                {note.title || "Untitled Note"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {format(new Date(note.updatedAt), "MMM d, yyyy")}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {note.charCount || 0} characters
            </p>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}

export const NotesList = memo(NotesListComponent);
