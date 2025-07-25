"use client";

import { Note } from "./types";
import { get, set, del, keys } from "idb-keyval";
import type { OutputData } from "@editorjs/editorjs";

// Create a new note
export const createNote = async (): Promise<string> => {
  const id = `note_${Date.now()}`;
  const newNote: Note = {
    id,
    title: "শিরোনামহীন নোট", // Default title to prevent empty block creation
    content: {
      time: Date.now(),
      blocks: [], // Start with no blocks
      version: "2.29.1",
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    charCount: 0,
    isTrashed: false,
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
  updates: Partial<Note>,
): Promise<void> => {
  const note = await get<Note>(id);
  if (note) {
    const updatedNote = { ...note, ...updates, updatedAt: Date.now() };
    await set(id, updatedNote);
  }
};

// Move a note to trash
export const trashNote = async (id: string): Promise<void> => {
  await updateNote(id, { isTrashed: true });
};

// Restore a note from trash
export const restoreNote = async (id: string): Promise<void> => {
  await updateNote(id, { isTrashed: false });
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
  const notes = await getNotes();
  const jsonString = JSON.stringify(notes, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = `mnrnotes-backup-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};

// Utility to get title from Editor.js data
export const getNoteTitle = (data: OutputData): string => {
  const firstBlock = data.blocks[0];
  if (firstBlock && firstBlock.type === "header") {
    // Return the text content, stripping any HTML tags
    return firstBlock.data.text.replace(/<[^>]+>/g, "") || "";
  }
  return "";
};
