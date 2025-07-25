"use client";

import { useState, useEffect } from "react";
import NotesPage from "@/components/pages/notes-page";
import { getNotes } from "@/lib/storage";
import { Note } from "@/lib/types";
import Loading from "@/app/loading";

export default function Page() {
  const [notes, setNotes] = useState<Note[] | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      const storedNotes = await getNotes();
      setNotes(storedNotes);
    };

    fetchNotes();
  }, []);

  if (notes === null) {
    return <Loading />;
  }

  return <NotesPage initialNotes={notes} />;
}
