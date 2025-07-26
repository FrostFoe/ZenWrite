
"use client";

import { create } from "zustand";
import * as localDB from "@/lib/storage";
import * as driveDB from "@/lib/drive-storage";
import type { Note } from "@/lib/types";
import { useSettingsStore } from "./use-settings";

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
  restoreNote: (id: string) => Promise<void>;
  deleteNotePermanently: (id: string) => Promise<void>;
  createNote: () => Promise<string | undefined>;
  resetState: () => void;
  syncToDrive: () => Promise<void>;
  importFromDrive: () => Promise<number>;
}

const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  trashedNotes: [],
  isLoading: false,
  hasFetched: false,
  resetState: () => set({ notes: [], trashedNotes: [], hasFetched: false, isLoading: false }),

  // Fetch notes from local DB
  fetchNotes: async () => {
    if (get().hasFetched) return;
    set({ isLoading: true });
    try {
      const notes = await localDB.getNotes();
      set({ notes, isLoading: false, hasFetched: true });
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      set({ isLoading: false });
    }
  },

  // Fetch trashed notes from local DB
  fetchTrashedNotes: async () => {
    set({ isLoading: true });
    try {
      const trashedNotes = await localDB.getTrashedNotes();
      set({ trashedNotes, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch trashed notes:", error);
      set({ isLoading: false });
    }
  },

  createNote: async () => {
    set({ isLoading: true });
    try {
      const noteId = await localDB.createNote();
      await get().fetchNotes(); // Re-fetch to get the new note
      get().resetState();
      await get().fetchNotes();
      set({isLoading: false});
      return noteId;
    } catch (error) {
      console.error("Failed to create note:", error);
      set({ isLoading: false });
      return undefined;
    }
  },

  addImportedNotes: (importedNotes: Note[]) => {
    localDB.importNotesWithData(importedNotes);
    const existingIds = new Set(get().notes.map(n => n.id));
    const newNotes = importedNotes.filter(n => !existingIds.has(n.id));
    set((state) => ({
      notes: [...newNotes, ...state.notes],
    }));
  },

  trashNote: async (id: string) => {
    const noteToTrash = get().notes.find((note) => note.id === id);
    if (!noteToTrash) return;

    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
      trashedNotes: [noteToTrash, ...state.trashedNotes],
    }));

    try {
      await localDB.trashNote(id);
    } catch (error) {
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
        note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note,
      ),
    }));
    
    try {
      await localDB.updateNote(id, updates);
    } catch (error) {
      console.error("Failed to update note in DB:", error);
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
      await localDB.restoreNote(id);
    } catch (error) {
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
        trashedNotes: [noteToRestore, ...state.trashedNotes],
      }));
      console.error("Failed to restore note:", error);
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

  syncToDrive: async () => {
    const { userProfile } = useSettingsStore.getState();
    if (!userProfile?.accessToken) throw new Error("Not logged in");

    const notes = await localDB.getNotes();
    const trashedNotes = await localDB.getTrashedNotes();
    const backupData = { notes, trashed: trashedNotes };

    await driveDB.uploadBackup(userProfile.accessToken, backupData);
  },

  importFromDrive: async (): Promise<number> => {
    const { userProfile } = useSettingsStore.getState();
    if (!userProfile?.accessToken) throw new Error("Not logged in");

    const backupData = await driveDB.getBackup(userProfile.accessToken);
    if (!backupData) throw new Error("No backup file found in Drive.");
    
    const allNotes = [...(backupData.notes || []), ...(backupData.trashed || [])];
    if (allNotes.length > 0) {
      await localDB.importNotesWithData(allNotes);
      get().resetState();
      await get().fetchNotes();
    }
    return allNotes.length;
  }
}));


// Initial fetch on client side, if not already fetched.
if (typeof window !== "undefined") {
  useNotesStore.getState().fetchNotes();
}

export const useNotes = useNotesStore;
