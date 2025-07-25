"use client";

import { create } from "zustand";
import {
  getNotes as getNotesFromDB,
  createNote as createNoteInDB,
  trashNote as trashNoteInDB,
  updateNote as updateNoteInDB,
  getTrashedNotes as getTrashedNotesFromDB,
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
      const notes = await getNotesFromDB();
      set({ notes, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      set({ isLoading: false });
    }
  },
  fetchTrashedNotes: async () => {
    set({ isLoading: true });
    try {
      const trashedNotes = await getTrashedNotesFromDB();
      set({ trashedNotes, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch trashed notes:", error);
      set({ isLoading: false });
    }
  },
  createNote: async () => {
    const newNoteId = await createNoteInDB();
    // No need to fetch, router will redirect to a new page.
    // The list will be re-fetched when the user navigates back to the notes page.
    return newNoteId;
  },
  trashNote: async (id: string) => {
    const noteToTrash = get().notes.find((note) => note.id === id);
    if (!noteToTrash) return;

    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
      trashedNotes: [noteToTrash, ...state.trashedNotes],
    }));

    try {
      await trashNoteInDB(id);
    } catch (error) {
      // Revert state on failure
      set((state) => ({
        notes: [noteToTrash, ...state.notes],
        trashedNotes: state.trashedNotes.filter((note) => note.id !== id),
      }));
      console.error("Failed to trash note:", error);
    }
  },
  updateNote: async (id: string, updates: Partial<Note>) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
      ),
    }));
    // The database update is now optimistic
    try {
       await updateNoteInDB(id, updates);
    } catch (error) {
        console.error("Failed to update note in DB:", error);
        // Optionally revert state here if needed
    }
  },
  restoreNote: async (id: string) => {
    const noteToRestore = get().trashedNotes.find((note) => note.id === id);
    if (!noteToRestore) return;

    set((state) => ({
      trashedNotes: state.trashedNotes.filter((note) => note.id !== id),
      notes: [{ ...noteToRestore, isTrashed: false }, ...state.notes],
    }));

    try {
      await restoreNoteInDB(id);
    } catch (error) {
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
        trashedNotes: [noteToRestore, ...state.trashedNotes],
      }));
      console.error("Failed to restore note:", error);
    }
  },
  deleteNotePermanently: async (id: string) => {
    set((state) => ({
      trashedNotes: state.trashedNotes.filter((note) => note.id !== id),
    }));
    try {
      await deleteNotePermanentlyInDB(id);
    } catch (error) {
       console.error("Failed to permanently delete note:", error);
       // Optionally revert state here
    }
  },
}));

// Initial fetch on client side
if (typeof window !== "undefined") {
  useNotes.getState().fetchNotes();
}
