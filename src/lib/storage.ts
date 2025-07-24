"use client";

import { Note } from "./types";
import { get, set, del, keys } from "idb-keyval";
import type { OutputData } from "@editorjs/editorjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const NOTES_KEY = "mnrnotes";

// Create a new note
export const createNote = async (): Promise<string> => {
  const router = useRouter();
  const id = `note_${Date.now()}`;
  const newNote: Note = {
    id,
    title: "Untitled Note",
    content: {
      time: Date.now(),
      blocks: [
        {
          id: `block_${Date.now()}`,
          type: "header",
          data: {
            text: "Untitled Note",
            level: 1,
          },
        },
      ],
      version: "2.29.1",
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    charCount: 0,
  };
  await set(id, newNote);
  toast.success("New note created!");
  router.push(`/editor/${id}`);
  router.refresh(); // Refresh server components
  return id;
};

// Get a single note by ID
export const getNote = async (id: string): Promise<Note | undefined> => {
  if (id === "new") {
    const newId = `note_${Date.now()}`;
    const newNote: Note = {
      id: newId,
      title: "Untitled Note",
      content: {
        time: Date.now(),
        blocks: [
          {
            id: `block_${Date.now()}`,
            type: "header",
            data: {
              text: "Untitled Note",
              level: 1,
            },
          },
        ],
        version: "2.29.1",
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      charCount: 0,
    };
    await set(newId, newNote);
    return { ...newNote, isNew: true } as Note & { isNew: boolean };
  }
  return get(id);
};

// Get all notes
export const getNotes = async (): Promise<Note[]> => {
  const allKeys = await keys();
  const noteKeys = allKeys.filter((key) =>
    String(key).startsWith("note_"),
  );
  const notes = await Promise.all(noteKeys.map((key) => get<Note>(key)));
  return notes.filter(Boolean) as Note[];
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

// Delete a note
export const deleteNote = async (id: string): Promise<void> => {
  await del(id);
};

// Clear all notes
export const clearAllNotes = async (): Promise<void> => {
    const allKeys = await keys();
    const noteKeys = allKeys.filter((key) => String(key).startsWith("note_"));
    await Promise.all(noteKeys.map(key => del(key)));
}

// Export all notes to a JSON file
export const exportNotes = async () => {
    const notes = await getNotes();
    const jsonString = JSON.stringify(notes, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `mnrnotes-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
}


// Utility to get title from Editor.js data
export const getNoteTitle = (data: OutputData): string => {
  const firstBlock = data.blocks[0];
  if (firstBlock && firstBlock.type === "header") {
    return firstBlock.data.text || "Untitled Note";
  }
  return "Untitled Note";
};
