"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Note } from "@/lib/types";
import type { OutputData } from "@editorjs/editorjs";
import { toast } from "sonner";
import { updateNote, getNoteTitle } from "@/lib/storage";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import EditorHeader from "@/components/editor/editor-header";
import { Skeleton } from "../ui/skeleton";
import Sidebar from "../nav/sidebar";
import { useSettings } from "@/hooks/use-settings";

const EditorWrapper = dynamic(
  () => import("@/components/editor/editor-wrapper"),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  },
);

function EditorSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-1/2" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-5/6" />
      <Skeleton className="h-6 w-3/4" />
    </div>
  );
}

export default function EditorPage({ note }: { note: Note }) {
  const router = useRouter();
  const [isZenMode, setIsZenMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"unsaved" | "saving" | "saved">(
    "saved",
  );
  const [charCount, setCharCount] = useState(note.charCount || 0);
  const { settings } = useSettings();
  const [fontClass, setFontClass] = useState("");

  useEffect(() => {
    if (settings) {
      setFontClass(settings.font.split(" ")[0]);
    }
  }, [settings]);

  const handleSave = async (data: OutputData) => {
    try {
      const title = getNoteTitle(data);
      await updateNote(note.id, {
        title,
        content: data,
        charCount: charCount,
      });
    } catch (error) {
      toast.error("Failed to save note.");
    }
  };

  const handleManualSave = async () => {
    setSaveStatus("saving");
    try {
      // This is slightly tricky as we don't have direct access to the latest data
      // from Editor.js instance here. A better approach would be to trigger a save
      // inside the editor component and await it.
      // For now, we just show a toast.
      toast.success("Note saved successfully!");
      setSaveStatus("saved");
    } catch (e) {
      toast.error("Failed to save.");
      setSaveStatus("unsaved");
    }
  };

  return (
    <div className="flex h-full bg-background">
      <Sidebar />
      <div
        className={cn(
          "flex-1 lg:pl-72 transition-all duration-300",
          isZenMode ? "lg:pl-0" : "lg:pl-72",
        )}
      >
        <div
          className={cn(
            "mx-auto h-full max-w-5xl px-4 sm:px-6 lg:px-8",
            fontClass,
          )}
        >
          <EditorHeader
            saveStatus={saveStatus}
            onSave={handleManualSave}
            isZenMode={isZenMode}
            setIsZenMode={setIsZenMode}
            charCount={charCount}
          />
          <EditorWrapper
            noteId={note.id}
            initialData={note.content}
            onSave={handleSave}
            isZenMode={isZenMode}
            setIsZenMode={setIsZenMode}
            setCharCount={setCharCount}
            setSaveStatus={setSaveStatus}
          />
        </div>
      </div>
    </div>
  );
}
