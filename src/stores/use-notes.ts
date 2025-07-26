"use client";

import { create } from "zustand";
import * as localDB from "@/lib/storage";
import type { Note } from "@/lib/types";
import { toast } from "sonner";

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
  isLoading: true,
  hasFetched: false,

  resetState: () =>
    set({ notes: [], trashedNotes: [], hasFetched: false, isLoading: false }),

  fetchNotes: async () => {
    set({ isLoading: true });
    try {
      const notes = await localDB.getNotes();
      set({ notes, hasFetched: true, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      toast.error("নোট লোড করতে সমস্যা হয়েছে।");
      set({ isLoading: false });
    }
  },

  fetchTrashedNotes: async () => {
    set({ isLoading: true });
    try {
      const trashedNotes = await localDB.getTrashedNotes();
      set({ trashedNotes, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch trashed notes:", error);
      toast.error("ট্র্যাশের নোট লোড করতে সমস্যা হয়েছে।");
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
      toast.error("নতুন নোট তৈরি করতে সমস্যা হয়েছে।");
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
      toast.error("নোটটি ট্র্যাশে সরাতে সমস্যা হয়েছে।");
      get().fetchNotes();
      get().fetchTrashedNotes();
    }
  },

  updateNote: async (id: string, updates: Partial<Note>) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: Date.now() }
          : note,
      ),
    }));

    try {
      await localDB.updateNote(id, updates);
    } catch (error)
      {
      console.error("Failed to update note in DB:", error);
      toast.error("নোটটি আপডেট করতে সমস্যা হয়েছে।");
      get().fetchNotes();
    }
  },

  togglePin: async (id: string) => {
    const note = get().notes.find((n) => n.id === id);
    if (!note) return;

    const isPinned = !note.isPinned;
    const pinnedNotesCount = get().notes.filter((n) => n.isPinned).length;

    if (isPinned && pinnedNotesCount >= 3) {
      toast.error("আপনি সর্বোচ্চ ৩টি নোট পিন করতে পারবেন।");
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
      toast.error("নোটটি পুনরুদ্ধার করতে সমস্যা হয়েছে।");
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
      toast.error("নোটটি স্থায়ীভাবে মুছতে সমস্যা হয়েছে।");
      set({ trashedNotes: originalTrashed });
    }
  },
}));

export const useNotes = useNotesStore;
