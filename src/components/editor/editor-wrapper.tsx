"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  memo,
} from "react";
import EditorJS, { type OutputData } from "@editorjs/editorjs";
import { useDebounce } from "use-debounce";
import { EDITOR_TOOLS } from "@/lib/editorjs/tools";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
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
  const [editorData, setEditorData] = useState<OutputData>(initialData);

  const [debouncedEditorData] = useDebounce(editorData, 1500);

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
        const content = await api.saver.save();
        setEditorData(content);
        setSaveStatus("unsaved");

        const text = content.blocks
          .map((block) => block.data.text || "")
          .join(" ");
        setCharCount(text.replace(/&nbsp;|<[^>]+>/g, "").length);
      },
      autofocus: true,
      placeholder: "Let's write an awesome story!",
      tools: EDITOR_TOOLS,
    });
  }, [initialData, setSaveStatus, setCharCount]);

  useEffect(() => {
    if (!ejInstance.current) {
      initEditor();
    }
    return () => {
      if (ejInstance.current?.destroy) {
        ejInstance.current.destroy();
        ejInstance.current = null;
      }
    };
  }, [initEditor]);

  useEffect(() => {
    const saveContent = async () => {
      if (
        !debouncedEditorData ||
        debouncedEditorData.blocks.length === 0
      ) {
        return;
      }
      setSaveStatus("saving");
      await onSave(debouncedEditorData);
      setSaveStatus("saved");
    };
    saveContent();
  }, [debouncedEditorData, onSave, setSaveStatus]);

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
        isZenMode && "prose-lg"
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
