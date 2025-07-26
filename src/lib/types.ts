
import type { OutputData } from "@editorjs/editorjs";

export interface NoteHistory {
  content: OutputData;
  updatedAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: OutputData;
  createdAt: number;
  updatedAt: number;
  charCount?: number;
  tags?: string[];
  collectionId?: string;
  coverImage?: string; // base64 or a local URL
  isTrashed: boolean;
  history?: NoteHistory[];
}

export interface Collection {
  id: string;
  name: string;
  emoji: string;
  createdAt: number;
}

export interface UserProfile {
  name: string;
  email: string;
  picture: string;
  accessToken: string;
}
