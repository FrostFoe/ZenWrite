
import type { Note } from "./types";

const DRIVE_API_URL = "https://www.googleapis.com/drive/v3/files";
const DRIVE_UPLOAD_URL = "https://www.googleapis.com/upload/drive/v3/files";
const BACKUP_FILE_NAME = "amar-note-backup.json";

interface BackupData {
  notes: Note[];
  trashed: Note[];
}

async function getHeaders(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
}

async function findBackupFile(accessToken: string): Promise<string | null> {
  const headers = await getHeaders(accessToken);
  const query = `name='${BACKUP_FILE_NAME}' and 'appDataFolder' in parents and trashed=false`;
  
  try {
    const response = await fetch(`${DRIVE_API_URL}?q=${encodeURIComponent(query)}&spaces=appDataFolder&fields=files(id)`, { headers });
    if (!response.ok) {
      console.error("Drive API error:", await response.text());
      throw new Error("Failed to search for backup file in appDataFolder.");
    }
    const data = await response.json();
    return data.files.length > 0 ? data.files[0].id : null;
  } catch (error) {
    console.error("Error finding backup file:", error);
    return null;
  }
}

export async function uploadBackup(accessToken: string, data: BackupData): Promise<void> {
  const headers = await getHeaders(accessToken);
  const fileId = await findBackupFile(accessToken);
  
  const metadata = {
    name: BACKUP_FILE_NAME,
    mimeType: "application/json",
    ...(fileId ? {} : { parents: ["appDataFolder"] }),
  };
  
  const body = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });

  let url = `${DRIVE_UPLOAD_URL}?uploadType=multipart`;
  let method = 'POST';

  if (fileId) {
    url = `${DRIVE_UPLOAD_URL}/${fileId}?uploadType=multipart`;
    method = 'PATCH';
  }

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', body);

  const response = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${accessToken}` },
    body: form,
  });

  if (!response.ok) {
    const errorBody = await response.json();
    console.error("Failed to upload backup:", errorBody);
    throw new Error(`Failed to upload backup file. Status: ${response.status}`);
  }
}

export async function getBackup(accessToken: string): Promise<BackupData | null> {
  const headers = await getHeaders(accessToken);
  const fileId = await findBackupFile(accessToken);

  if (!fileId) {
    return null; // No backup found
  }

  const response = await fetch(`${DRIVE_API_URL}/${fileId}?alt=media&spaces=appDataFolder`, { headers });
  
  if (!response.ok) {
    throw new Error("Failed to download backup file.");
  }
  
  try {
    const data = await response.json();
    // Basic validation
    if (Array.isArray(data.notes) && Array.isArray(data.trashed)) {
      return data as BackupData;
    }
    return null;
  } catch (error) {
    console.error("Error parsing backup JSON:", error);
    return null;
  }
}
