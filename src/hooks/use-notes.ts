"use client";

import { create } from "zustand";
import {
  getNotes,
  createNote as createNoteInDB,
  trashNote as trashNoteInDB,
  updateNote as updateNoteInDB,
  getTrashedNotes,
  restoreNote as restoreNoteInDB,
  deleteNotePermanently as deleteNotePermanentlyInDB,
} from "@/lib/storage";
import type { Note } from "@/lib/types";

interface NotesState {
  notes: Note[];
  trashedNotes: Note[];
  isLoading: boolean;
  fetchNotes: () => Promise<void>;
  fetchTrashedNotes: () => Promise<void>;
  createNote: () => Promise<string>;
  trashNote: (id: string) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  restoreNote: (id: string) => Promise<void>;
  deleteNotePermanently: (id: string) => Promise<void>;
}

export const useNotes = create<NotesState>((set, get) => ({
  notes: [],
  trashedNotes: [],
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
  fetchTrashedNotes: async () => {
    set({ isLoading: true });
    try {
      const trashedNotes = await getTrashedNotes();
      set({ trashedNotes, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch trashed notes:", error);
      set({ isLoading: false });
    }
  },
  createNote: async () => {
    const newNoteId = await createNoteInDB();
    await get().fetchNotes(); // Re-fetch notes to include the new one
    return newNoteId;
  },
  trashNote: async (id: string) => {
    await trashNoteInDB(id);
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
    }));
  },
  updateNote: async (id: string, updates: Partial<Note>) => {
    await updateNoteInDB(id, updates);
    await get().fetchNotes(); // Re-fetch to get updated note
  },
  restoreNote: async (id: string) => {
    await restoreNoteInDB(id);
    await get().fetchNotes();
    await get().fetchTrashedNotes();
  },
  deleteNotePermanently: async (id: string) => {
    await deleteNotePermanentlyInDB(id);
    set((state) => ({
      trashedNotes: state.trashedNotes.filter((note) => note.id !== id),
    }));
  },
}));

// Initial fetch
if (typeof window !== "undefined") {
  useNotes.getState().fetchNotes();
}
