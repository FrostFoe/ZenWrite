
import { Note } from "@/lib/types";
import { NoteCard } from "./note-card";
import { motion, AnimatePresence } from "framer-motion";
import { memo } from 'react';

interface NotesGridProps {
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

function NotesGridComponent({ notes }: NotesGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <AnimatePresence>
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

export const NotesGrid = memo(NotesGridComponent);
