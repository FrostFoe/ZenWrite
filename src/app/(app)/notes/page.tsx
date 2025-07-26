
"use client";

import { useState, useEffect } from "react";
import NotesPage from "@/components/pages/notes-page";
import { getNotes } from "@/lib/storage";
import { Note } from "@/lib/types";
import Loading from "@/app/loading";
import { useNotes } from "@/hooks/use-notes";

export default function Page() {
  // Use the Zustand store as the primary source of truth
  const notes = useNotes((state) => state.notes);
  const isLoading = useNotes((state) => state.isLoading);
  const fetchNotes = useNotes((state) => state.fetchNotes);
  const hasFetched = useNotes((state) => state.hasFetched);

  useEffect(() => {
    // Initial fetch if notes haven't been loaded into the store yet
    if (!hasFetched) {
      fetchNotes();
    }
  }, [fetchNotes, hasFetched]);

  // The Loading component will be shown based on the store's isLoading state
  if (isLoading && !hasFetched) {
    return <Loading />;
  }

  return <NotesPage initialNotes={notes} />;
}
