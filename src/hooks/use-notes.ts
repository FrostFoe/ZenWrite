
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
}

const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  trashedNotes: [],
  isLoading: false,
  hasFetched: false,
  resetState: () => set({ notes: [], trashedNotes: [], hasFetched: false, isLoading: false }),
  fetchNotes: async () => {
    if (get().hasFetched) return;
    set({ isLoading: true });
    const { isDriveSyncEnabled, userProfile } = useSettingsStore.getState();
    try {
      let notes: Note[];
      if (isDriveSyncEnabled && userProfile?.accessToken) {
        notes = await driveDB.getNotes(userProfile.accessToken);
      } else {
        notes = await localDB.getNotes();
      }
      set({ notes, isLoading: false, hasFetched: true });
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      set({ isLoading: false });
    }
  },
  fetchTrashedNotes: async () => {
    set({ isLoading: true });
    const { isDriveSyncEnabled, userProfile } = useSettingsStore.getState();
    try {
      let trashedNotes: Note[];
       if (isDriveSyncEnabled && userProfile?.accessToken) {
        trashedNotes = await driveDB.getTrashedNotes(userProfile.accessToken);
      } else {
        trashedNotes = await localDB.getTrashedNotes();
      }
      set({ trashedNotes, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch trashed notes:", error);
      set({ isLoading: false });
    }
  },
  createNote: async () => {
    set({ isLoading: true });
    const { isDriveSyncEnabled, userProfile } = useSettingsStore.getState();
    try {
      let noteId;
      if (isDriveSyncEnabled && userProfile?.accessToken) {
        noteId = await driveDB.createNote(userProfile.accessToken);
      } else {
        noteId = await localDB.createNote();
      }
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
    // This will only support local import for now.
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

    const { isDriveSyncEnabled, userProfile } = useSettingsStore.getState();
    try {
      if (isDriveSyncEnabled && userProfile?.accessToken) {
        await driveDB.trashNote(userProfile.accessToken, id);
      } else {
        await localDB.trashNote(id);
      }
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
    
    const { isDriveSyncEnabled, userProfile } = useSettingsStore.getState();
    const noteToUpdate = get().notes.find(n => n.id === id);
    if (!noteToUpdate) return;
    
    try {
      if (isDriveSyncEnabled && userProfile?.accessToken) {
        await driveDB.updateNote(userProfile.accessToken, id, noteToUpdate);
      } else {
        await localDB.updateNote(id, updates);
      }
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

    const { isDriveSyncEnabled, userProfile } = useSettingsStore.getState();
    try {
      if (isDriveSyncEnabled && userProfile?.accessToken) {
        await driveDB.restoreNote(userProfile.accessToken, id);
      } else {
        await localDB.restoreNote(id);
      }
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

    const { isDriveSyncEnabled, userProfile } = useSettingsStore.getState();
    try {
      if (isDriveSyncEnabled && userProfile?.accessToken) {
        await driveDB.deleteNotePermanently(userProfile.accessToken, id);
      } else {
        await localDB.deleteNotePermanently(id);
      }
    } catch (error) {
      console.error("Failed to permanently delete note:", error);
      set({ trashedNotes: originalTrashed });
    }
  },
}));

// Re-fetch notes when sync settings change
useSettingsStore.subscribe((state, prevState) => {
  if (state.isDriveSyncEnabled !== prevState.isDriveSyncEnabled || state.userProfile?.email !== prevState.userProfile?.email) {
    useNotesStore.getState().resetState();
    useNotesStore.getState().fetchNotes();
  }
});

// Initial fetch on client side, if not already fetched.
if (typeof window !== "undefined") {
  useNotesStore.getState().fetchNotes();
}

export const useNotes = useNotesStore;
