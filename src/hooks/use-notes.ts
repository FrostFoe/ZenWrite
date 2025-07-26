
"use client";

import { create } from "zustand";
import * as localDB from "@/lib/storage";
import type { Note } from "@/lib/types";

interface NotesState {
  notes: Note[];
  trashedNotes: Note[];
  isLoading: boolean;
  hasFetched: boolean;
  fetchNotes: () => Promise<void>;
  fetchTrashedNotes: () => Promise<void>;
  addImportedNotes: (importedNotes: Note[]) => void;
  trashNote: (id: string) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  restoreNote: (id: string) => Promise<void>;
  deleteNotePermanently: (id: string) => Promise<void>;
  createNote: () => Promise<string | undefined>;
  resetState: () => void;
}

const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  trashedNotes: [],
  isLoading: false,
  hasFetched: false,

  resetState: () =>
    set({ notes: [], trashedNotes: [], hasFetched: false, isLoading: false }),

  fetchNotes: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      const notes = await localDB.getNotes();
      set({ notes, hasFetched: true });
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTrashedNotes: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      const trashedNotes = await localDB.getTrashedNotes();
      set({ trashedNotes });
    } catch (error) {
      console.error("Failed to fetch trashed notes:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  createNote: async () => {
    try {
      const newNote = await localDB.createNote();
      set((state) => ({
        notes: [newNote, ...state.notes],
      }));
      return newNote.id;
    } catch (error) {
      console.error("Failed to create note:", error);
      return undefined;
    }
  },

  addImportedNotes: (importedNotes: Note[]) => {
    const existingIds = new Set(get().notes.map((n) => n.id));
    const newNotes = importedNotes.filter((n) => !existingIds.has(n.id));
    set((state) => ({
      notes: [...state.notes, ...newNotes],
    }));
  },

  trashNote: async (id: string) => {
    const noteToTrash = get().notes.find((note) => note.id === id);
    if (!noteToTrash) return;

    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
      trashedNotes: [
        { ...noteToTrash, isTrashed: true },
        ...state.trashedNotes,
      ],
    }));

    try {
      await localDB.trashNote(id);
    } catch (error) {
      console.error("Failed to trash note:", error);
      get().fetchNotes();
      get().fetchTrashedNotes();
    }
  },

  updateNote: async (id: string, updates: Partial<Note>) => {
    let noteToUpdate: Note | undefined;
    set((state) => {
      const newNotes = state.notes.map((note) => {
        if (note.id === id) {
          noteToUpdate = { ...note, ...updates, updatedAt: Date.now() };
          return noteToUpdate;
        }
        return note;
      });
      return { notes: newNotes };
    });

    if (noteToUpdate) {
      try {
        await localDB.updateNote(id, updates);
      } catch (error) {
        console.error("Failed to update note in DB:", error);
        get().fetchNotes();
      }
    }
  },

  togglePin: async (id: string) => {
    const note = get().notes.find((n) => n.id === id);
    if (!note) return;

    const isPinned = !note.isPinned;
    const pinnedNotesCount = get().notes.filter((n) => n.isPinned).length;

    if (isPinned && pinnedNotesCount >= 3) {
      console.warn("Pin limit reached");
      return;
    }

    await get().updateNote(id, { isPinned });
  },

  restoreNote: async (id: string) => {
    const noteToRestore = get().trashedNotes.find((note) => note.id === id);
    if (!noteToRestore) return;

    set((state) => ({
      trashedNotes: state.trashedNotes.filter((note) => note.id !== id),
      notes: [{ ...noteToRestore, isTrashed: false }, ...state.notes],
    }));

    try {
      await localDB.restoreNote(id);
    } catch (error) {
      console.error("Failed to restore note:", error);
      get().fetchNotes();
      get().fetchTrashedNotes();
    }
  },

  deleteNotePermanently: async (id: string) => {
    const originalTrashed = [...get().trashedNotes];
    set((state) => ({
      trashedNotes: state.trashedNotes.filter((note) => note.id !== id),
    }));

    try {
      await localDB.deleteNotePermanently(id);
    } catch (error) {
      console.error("Failed to permanently delete note:", error);
      set({ trashedNotes: originalTrashed });
    }
  },
}));

export const useNotes = useNotesStore;
