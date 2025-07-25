"use client";

import { create } from "zustand";
import { getNotes, createNote as createNoteInDB, deleteNote as deleteNoteInDB, updateNote as updateNoteInDB } from "@/lib/storage";
import type { Note } from "@/lib/types";

interface NotesState {
  notes: Note[];
  isLoading: boolean;
  fetchNotes: () => Promise<void>;
  createNote: () => Promise<string>;
  deleteNote: (id: string) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
}

export const useNotes = create<NotesState>((set, get) => ({
  notes: [],
  isLoading: true,
  fetchNotes: async () => {
    set({ isLoading: true });
    try {
      const notes = await getNotes();
      set({ notes, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      set({ isLoading: false });
    }
  },
  createNote: async () => {
    const newNoteId = await createNoteInDB();
    await get().fetchNotes(); // Re-fetch notes to include the new one
    return newNoteId;
  },
  deleteNote: async (id: string) => {
    await deleteNoteInDB(id);
    set(state => ({
        notes: state.notes.filter(note => note.id !== id)
    }));
  },
  updateNote: async (id: string, updates: Partial<Note>) => {
    await updateNoteInDB(id, updates);
    await get().fetchNotes(); // Re-fetch to get updated note
  }
}));

// Initial fetch
if (typeof window !== "undefined") {
    useNotes.getState().fetchNotes();
}
