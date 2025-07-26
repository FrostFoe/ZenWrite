"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Maximize,
  Loader2,
  History,
  Tag,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

type SaveStatus = "unsaved" | "saving" | "saved";

interface EditorHeaderProps {
  saveStatus: SaveStatus;
  onSave: () => void;
  isZenMode: boolean;
  setIsZenMode: (isZen: boolean) => void;
  charCount: number;
  noteId: string;
  initialTags?: string[];
  onTagsChange: (tags: string[]) => void;
}

export default function EditorHeader({
  saveStatus,
  onSave,
  isZenMode,
  setIsZenMode,
  charCount,
  noteId,
  initialTags = [],
  onTagsChange,
}: EditorHeaderProps) {
  const router = useRouter();
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tagInput, setTagInput] = useState("");
  const debouncedTags = useDebounce(tags, 500);

  useEffect(() => {
    onTagsChange(debouncedTags);
  }, [debouncedTags, onTagsChange]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!newTag) {
        toast.error("ট্যাগ খালি রাখা যাবে না।");
        return;
      }
      if (tags.includes(newTag)) {
        toast.error(`ট্যাগ "${newTag}" ইতিমধ্যে যোগ করা হয়েছে।`);
        return;
      }
      setTags([...tags, newTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: { opacity: 0, y: -40, transition: { duration: 0.2 } },
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case "saving":
        return "সংরক্ষণ করা হচ্ছে...";
      case "saved":
        return "সংরক্ষিত";
      default:
        return "পরিবর্তনগুলি সংরক্ষিত হয়নি";
    }
  };

  return (
    <AnimatePresence>
      {!isZenMode && (
        <motion.header
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed top-0 left-0 right-0 z-10 flex h-auto flex-col gap-2 border-b bg-background/80 px-4 py-2 backdrop-blur-sm lg:relative lg:h-auto lg:border-none lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none"
        >
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            <Button
              variant="ghost"
              onClick={() => router.push("/notes")}
              className="hidden lg:inline-flex"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              নোটে ফিরে যান
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/notes")}
              className="lg:hidden"
              aria-label="Back to notes"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-shrink-0 items-center gap-2">
              <p className="hidden text-sm text-muted-foreground sm:block">
                {charCount} অক্ষর
              </p>
              <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
                {saveStatus === "saving" && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {getSaveStatusText()}
              </div>
              <Button
                variant="outline"
                onClick={onSave}
                size="icon"
                aria-label="Save Note"
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push(`/editor/${noteId}/history`)}
                aria-label="View History"
              >
                <History className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsZenMode(true)}
                aria-label="Enter Zen Mode"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="ট্যাগ যোগ করুন (Enter চেপে)..."
                className="pl-9"
              />
            </div>
            <div className="flex min-h-[24px] flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="rounded-full hover:bg-muted-foreground/20"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
