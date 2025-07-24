import type { OutputData } from "@editorjs/editorjs";

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
}

export interface Collection {
  id: string;
  name: string;
  emoji: string;
  createdAt: number;
}
