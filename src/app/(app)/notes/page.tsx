
"use client";

import { useState, useEffect } from "react";
import NotesPage from "@/components/pages/notes-page";
import { getNotes } from "@/lib/storage";
import { Note } from "@/lib/types";
import Loading from "@/app/loading";
import { useNotes } from "@/hooks/use-notes";

export default function Page() {
  const notes = useNotes((state) => state.notes);
  const isLoading = useNotes((state) => state.isLoading);
  const fetchNotes = useNotes((state) => state.fetchNotes);
  const hasFetched = useNotes((state) => state.hasFetched);

  useEffect(() => {
    if (!hasFetched) {
      fetchNotes();
    }
  }, [fetchNotes, hasFetched]);

  if (isLoading && !hasFetched) {
    return <Loading />;
  }

  return <NotesPage initialNotes={notes} />;
}
