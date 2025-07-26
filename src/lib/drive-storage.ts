
import type { Note } from "./types";
import type { OutputData } from "@editorjs/editorjs";

const DRIVE_API_URL = "https://www.googleapis.com/drive/v3/files";
const DRIVE_UPLOAD_URL = "https://www.googleapis.com/upload/drive/v3/files";
const APP_FOLDER_NAME = "Amar Note App Data";
const MAX_HISTORY_LENGTH = 20;

let appFolderIdCache: string | null = null;

async function getHeaders(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
}

async function getAppFolderId(accessToken: string): Promise<string> {
  if (appFolderIdCache) {
    return appFolderIdCache;
  }

  const headers = await getHeaders(accessToken);
  const query = `mimeType='application/vnd.google-apps.folder' and name='${APP_FOLDER_NAME}' and trashed=false`;
  const response = await fetch(`${DRIVE_API_URL}?q=${encodeURIComponent(query)}&spaces=drive`, { headers });

  if (!response.ok) {
    throw new Error("Failed to search for app folder.");
  }

  const data = await response.json();

  if (data.files.length > 0) {
    appFolderIdCache = data.files[0].id;
    return data.files[0].id;
  } else {
    const folderMetadata = {
      name: APP_FOLDER_NAME,
      mimeType: "application/vnd.google-apps.folder",
    };
    const createResponse = await fetch(DRIVE_API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(folderMetadata),
    });
    if (!createResponse.ok) {
      throw new Error("Failed to create app folder.");
    }
    const folder = await createResponse.json();
    appFolderIdCache = folder.id;
    return folder.id;
  }
}

export async function createNote(accessToken: string): Promise<string> {
  const folderId = await getAppFolderId(accessToken);
  const id = `note_${Date.now()}`;
  const newNote: Note = {
    id,
    title: "শিরোনামহীন নোট",
    content: { time: Date.now(), blocks: [], version: "2.29.1" },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    charCount: 0,
    isTrashed: false,
    history: [],
  };

  const fileMetadata = {
    name: `${id}.json`,
    parents: [folderId],
    mimeType: "application/json",
  };

  const headers = await getHeaders(accessToken);
  const createResponse = await fetch(DRIVE_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(fileMetadata),
  });

  if (!createResponse.ok) throw new Error("Could not create file metadata in Drive.");
  const file = await createResponse.json();

  await updateNote(accessToken, file.id, newNote);
  return file.id; // Return the Drive file ID
}

export async function getNotes(accessToken: string): Promise<Note[]> {
  return getNotesByTrashedStatus(accessToken, false);
}

export async function getTrashedNotes(accessToken: string): Promise<Note[]> {
  return getNotesByTrashedStatus(accessToken, true);
}

async function getNotesByTrashedStatus(accessToken: string, isTrashed: boolean): Promise<Note[]> {
  const folderId = await getAppFolderId(accessToken);
  const headers = await getHeaders(accessToken);
  const query = `'${folderId}' in parents and mimeType='application/json' and name starts with 'note_' and trashed=${isTrashed}`;

  const response = await fetch(
    `${DRIVE_API_URL}?q=${encodeURIComponent(query)}&fields=files(id,name,createdTime,modifiedTime)&spaces=drive`,
    { headers }
  );

  if (!response.ok) throw new Error("Failed to list notes from Drive.");
  const data = await response.json();

  const notes: Note[] = await Promise.all(
    data.files.map(async (file: any) => {
      const fileContentRes = await fetch(`${DRIVE_API_URL}/${file.id}?alt=media`, { headers });
      if (!fileContentRes.ok) return null;
      const noteData = await fileContentRes.json();
      return { ...noteData, id: file.id }; // Use Drive ID as the note ID
    })
  );

  return notes.filter((n): n is Note => n !== null).sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function updateNote(accessToken: string, id: string, note: Note): Promise<void> {
  const headers = await getHeaders(accessToken);
  
  const updatedNoteData = { ...note, updatedAt: Date.now() };

  // Add current state to history
  const newHistoryEntry = {
    content: note.content,
    updatedAt: note.updatedAt,
  };
  updatedNoteData.history = [newHistoryEntry, ...(note.history || [])].slice(0, MAX_HISTORY_LENGTH);
  
  const body = new Blob([JSON.stringify(updatedNoteData)], { type: "application/json" });

  const response = await fetch(`${DRIVE_UPLOAD_URL}/${id}?uploadType=media`, {
    method: "PATCH",
    headers: { ...headers, "Content-Type": "application/json" },
    body,
  });

  if (!response.ok) {
    throw new Error("Failed to update note in Drive.");
  }
}

export async function trashNote(accessToken: string, id: string): Promise<void> {
  await updateFileMetadata(accessToken, id, { trashed: true });
}

export async function restoreNote(accessToken: string, id: string): Promise<void> {
  await updateFileMetadata(accessToken, id, { trashed: false });
}

export async function deleteNotePermanently(accessToken: string, id: string): Promise<void> {
  const headers = await getHeaders(accessToken);
  const response = await fetch(`${DRIVE_API_URL}/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Drive delete error:", errorBody);
    throw new Error("Failed to permanently delete note from Drive.");
  }
}

async function updateFileMetadata(accessToken: string, id: string, metadata: object): Promise<void> {
    const headers = await getHeaders(accessToken);
    const response = await fetch(`${DRIVE_API_URL}/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(metadata),
    });

    if (!response.ok) {
        throw new Error(`Failed to update file metadata in Drive.`);
    }
}
