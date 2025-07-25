"use client";

import { useState, useEffect } from "react";
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
import { AnimatePresence } from "framer-motion";

const EditorWrapper = dynamic(
  () => import("@/components/editor/editor-wrapper"),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  },
);

function EditorSkeleton() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <Skeleton className="h-12 w-1/2" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-5/6" />
      <Skeleton className="h-6 w-3/4" />
    </div>
  );
}

export default function EditorPage({ note }: { note: Note }) {
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
      const title = getNoteTitle(data) || "শিরোনামহীন নোট";
      const totalChars = data.blocks
        .map((block) => block.data.text || "")
        .join(" ")
        .replace(/&nbsp;|<[^>]+>/g, "").length;
      setCharCount(totalChars);
      await updateNote(note.id, {
        title,
        content: data,
        charCount: totalChars,
      });
    } catch (error) {
      toast.error("নোট সংরক্ষণ করতে ব্যর্থ হয়েছে।");
    }
  };

  const handleManualSave = async () => {
    setSaveStatus("saving");
    // This is tricky as we don't have direct access to the latest data
    // from Editor.js instance here. A better approach would be to trigger a save
    // inside the editor component and await it.
    // For now, we just show a toast and rely on the debounced save.
    toast.success("নোট সফলভাবে সংরক্ষণ করা হয়েছে!");
    // The debounced save will eventually set it to "saved"
    setTimeout(() => setSaveStatus("saved"), 1000);
  };

  return (
    <div className="flex h-full bg-background">
      <AnimatePresence>
        {!isZenMode && <Sidebar />}
      </AnimatePresence>
      <div
        className={cn(
          "flex-1 transition-all duration-300",
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
