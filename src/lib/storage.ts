
"use client";

import { Note } from "./types";
import { get, set, del, keys, setMany } from "idb-keyval";
import type { OutputData } from "@editorjs/editorjs";

const MAX_HISTORY_LENGTH = 20;

// Create a new note
export const createNote = async (): Promise<string> => {
  const id = `note_${Date.now()}`;
  const newNote: Note = {
    id,
    title: "শিরোনামহীন নোট",
    content: {
      time: Date.now(),
      blocks: [],
      version: "2.29.1",
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    charCount: 0,
    isTrashed: false,
    history: [],
  };
  await set(id, newNote);
  return id;
};

// Get a single note by ID
export const getNote = async (id: string): Promise<Note | undefined> => {
  return get(id);
};

// Get all active notes
export const getNotes = async (): Promise<Note[]> => {
  const allKeys = await keys();
  const noteKeys = allKeys.filter((key) => String(key).startsWith("note_"));
  const notes = await Promise.all(noteKeys.map((key) => get<Note>(key)));
  return notes
    .filter((note): note is Note => !!note && !note.isTrashed)
    .sort((a, b) => b.updatedAt - a.updatedAt);
};

// Get all trashed notes
export const getTrashedNotes = async (): Promise<Note[]> => {
  const allKeys = await keys();
  const noteKeys = allKeys.filter((key) => String(key).startsWith("note_"));
  const notes = await Promise.all(noteKeys.map((key) => get<Note>(key)));
  return notes
    .filter((note): note is Note => !!note && note.isTrashed)
    .sort((a, b) => b.updatedAt - a.updatedAt);
};

// Update a note
export const updateNote = async (
  id: string,
  updates: Partial<Omit<Note, 'history'>>,
): Promise<void> => {
  const note = await get<Note>(id);
  if (note) {
    const newHistoryEntry = {
      content: note.content,
      updatedAt: note.updatedAt,
    };

    // Add to history and keep it trimmed
    const newHistory = [newHistoryEntry, ...(note.history || [])].slice(
      0,
      MAX_HISTORY_LENGTH
    );

    const updatedNote: Note = {
      ...note,
      ...updates,
      updatedAt: Date.now(),
      history: newHistory,
    };
    await set(id, updatedNote);
  }
};

// Move a note to trash
export const trashNote = async (id: string): Promise<void> => {
  const note = await get<Note>(id);
   if (note) {
    const updatedNote = { ...note, isTrashed: true, updatedAt: Date.now() };
    await set(id, updatedNote);
  }
};

// Restore a note from trash
export const restoreNote = async (id: string): Promise<void> => {
   const note = await get<Note>(id);
   if (note) {
    const updatedNote = { ...note, isTrashed: false, updatedAt: Date.now() };
    await set(id, updatedNote);
  }
};

// Delete a note permanently
export const deleteNotePermanently = async (id: string): Promise<void> => {
  await del(id);
};

// Clear all notes
export const clearAllNotes = async (): Promise<void> => {
  const allKeys = await keys();
  const noteKeys = allKeys.filter((key) => String(key).startsWith("note_"));
  await Promise.all(noteKeys.map((key) => del(key)));
};

// Export all notes to a JSON file
export const exportNotes = async () => {
  const allNotes = await getNotes();
  const trashedNotes = await getTrashedNotes();
  const dataToExport = {
    notes: allNotes,
    trashed: trashedNotes,
  };
  const jsonString = JSON.stringify(dataToExport, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = `amar-note-backup-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};

// Import notes from a JSON file
export const importNotes = (file: File): Promise<Note[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonString = event.target?.result as string;
        const data = JSON.parse(jsonString);
        
        // Handle both old and new export formats
        const notesToImport = Array.isArray(data) ? data : (data.notes || []);

        if (!Array.isArray(notesToImport)) {
          throw new Error("Invalid file format: 'notes' array not found.");
        }

        const validatedNotes: Note[] = [];
        for (const noteData of notesToImport) {
          // Basic validation
          if (noteData.id && noteData.title && noteData.content) {
            const newNote: Note = {
              id: noteData.id,
              title: noteData.title,
              content: noteData.content,
              createdAt: noteData.createdAt || Date.now(),
              updatedAt: noteData.updatedAt || Date.now(),
              charCount: noteData.charCount || 0,
              isTrashed: noteData.isTrashed || false,
              history: noteData.history || [],
            };
            validatedNotes.push(newNote);
          }
        }

        if (validatedNotes.length > 0) {
          const entries: [IDBValidKey, Note][] = validatedNotes.map(note => [note.id, note]);
          await setMany(entries);
        }
        
        resolve(validatedNotes);
      } catch (error) {
        console.error("Error parsing or importing notes:", error);
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};


// Utility to get title from Editor.js data
export const getNoteTitle = (data: OutputData): string => {
  const firstBlock = data.blocks[0];
  if (firstBlock && firstBlock.type === "header") {
    return firstBlock.data.text.replace(/<[^>]+>/g, "") || "শিরোনামহীন নোট";
  }
  return "শিরোনামহীন নোট";
};
