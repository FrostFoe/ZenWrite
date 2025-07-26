"use client";

import React, { useRef, useEffect, useCallback, memo } from "react";
import EditorJS, { type OutputData } from "@editorjs/editorjs";
import { EDITOR_TOOLS } from "@/lib/editor";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Minimize } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EDITOR_HOLDER_ID = "editorjs-container";

interface EditorWrapperProps {
  noteId: string;
  initialData: OutputData;
  onSave: (data: OutputData) => Promise<void>;
  isZenMode: boolean;
  setIsZenMode: (isZen: boolean) => void;
  setCharCount: (count: number) => void;
  setSaveStatus: (status: "unsaved" | "saving" | "saved") => void;
}

const EditorWrapper = ({
  noteId,
  initialData,
  onSave,
  isZenMode,
  setIsZenMode,
  setCharCount,
  setSaveStatus,
}: EditorWrapperProps) => {
  const ejInstance = useRef<EditorJS | null>(null);
  const isDirty = useRef(false);

  const saveContent = useCallback(async () => {
    if (ejInstance.current && isDirty.current) {
      setSaveStatus("saving");
      try {
        const content = await ejInstance.current.saver.save();
        await onSave(content);
        isDirty.current = false;
        setSaveStatus("saved");
      } catch (error) {
        console.error("Failed to save content", error);
        setSaveStatus("unsaved");
      }
    }
  }, [onSave, setSaveStatus]);

  const initEditor = useCallback(() => {
    if (ejInstance.current) {
      return;
    }

    const editor = new EditorJS({
      holder: EDITOR_HOLDER_ID,
      data: initialData,
      onReady: () => {
        ejInstance.current = editor;
      },
      onChange: async (api) => {
        isDirty.current = true;
        setSaveStatus("unsaved");

        const content = await api.saver.save();
        const text = content.blocks
          .map((block) => block.data.text || "")
          .join(" ");
        setCharCount(text.replace(/&nbsp;|<[^>]+>/g, "").length);
      },
      placeholder: "আসুন একটি অসাধারণ গল্প লিখি!",
      tools: EDITOR_TOOLS,
    });
  }, [initialData, setCharCount, setSaveStatus]);

  useEffect(() => {
    if (!ejInstance.current) {
      initEditor();
    }
    return () => {
      saveContent();

      if (ejInstance.current?.destroy) {
        ejInstance.current.destroy();
        ejInstance.current = null;
      }
    };
  }, [initEditor, saveContent]);

  useEffect(() => {
    const interval = setInterval(() => {
      saveContent();
    }, 30000);

    return () => clearInterval(interval);
  }, [saveContent]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isZenMode) {
        setIsZenMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZenMode, setIsZenMode]);

  return (
    <div
      className={cn(
        "prose prose-stone dark:prose-invert max-w-full lg:py-8",
        isZenMode && "prose-lg",
      )}
    >
      <AnimatePresence>
        {isZenMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-4 right-4 z-50"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsZenMode(false)}
            >
              <Minimize className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <div id={EDITOR_HOLDER_ID} />
    </div>
  );
};

export default memo(EditorWrapper);
