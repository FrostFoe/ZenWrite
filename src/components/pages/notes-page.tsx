
"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Note } from "@/lib/types";
import Sidebar from "@/components/nav/sidebar";
import { NotesGrid } from "@/components/notes/notes-grid";
import NotesHeader from "@/components/notes/notes-header";
import { useSettingsStore } from "@/hooks/use-settings";
import { useNotes } from "@/hooks/use-notes";
import { cn } from "@/lib/utils";
import { importNotes } from "@/lib/storage";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { ExpandableFab } from "../ui/expandable-fab";
import { useDebounce } from "@/hooks/use-debounce";
import { getTextFromEditorJS } from "@/lib/utils";

type SortOption =
  `${"updatedAt" | "createdAt" | "title" | "charCount"}-${"asc" | "desc"}`;

export default function NotesPage({
  initialNotes,
}: {
  initialNotes: Note[];
}) {
  const router = useRouter();
  const font = useSettingsStore((state) => state.font);

  const createNote = useNotes((state) => state.createNote);
  const addImportedNotes = useNotes((state) => state.addImportedNotes);

  const [sortOption, setSortOption] = useState<SortOption>("updatedAt-desc");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fontClass = font.split(" ")[0];
  const importInputRef = useRef<HTMLInputElement>(null);

  const handleNewNote = useCallback(async () => {
    try {
      const noteId = await createNote();
      if (noteId) {
        toast.success("নতুন নোট তৈরি হয়েছে!");
        router.push(`/editor/${noteId}`);
      } else {
        toast.error("নোট তৈরি করতে ব্যর্থ হয়েছে।");
      }
    } catch (error) {
      toast.error("নোট তৈরি করতে ব্যর্থ হয়েছে।");
      console.error(error);
    }
  }, [createNote, router]);

  const handleImportClick = useCallback(() => {
    importInputRef.current?.click();
  }, []);

  const handleFileImport = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        try {
          const imported = await importNotes(file);
          addImportedNotes(imported);
          toast.success(
            `${imported.length} টি নোট সফলভাবে ইমপোর্ট করা হয়েছে!`,
          );
        } catch (error) {
          toast.error(
            "নোট ইম্পোর্ট করতে ব্যর্থ হয়েছে। ফাইল ফরম্যাট সঠিক কিনা তা পরীক্ষা করুন।",
          );
          console.error(error);
        } finally {
          if (importInputRef.current) {
            importInputRef.current.value = "";
          }
        }
      }
    },
    [addImportedNotes],
  );

  const filteredNotes = useMemo(() => {
    if (!debouncedSearchQuery) {
      return initialNotes;
    }
    const lowercasedQuery = debouncedSearchQuery.toLowerCase();
    return initialNotes.filter((note) => {
      const titleMatch = note.title.toLowerCase().includes(lowercasedQuery);
      const contentMatch = getTextFromEditorJS(note.content)
        .toLowerCase()
        .includes(lowercasedQuery);
      const tagMatch = note.tags?.some((tag) =>
        tag.toLowerCase().includes(lowercasedQuery),
      );
      return titleMatch || contentMatch || tagMatch;
    });
  }, [initialNotes, debouncedSearchQuery]);

  const sortedNotes = useMemo(() => {
    const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
    const unpinnedNotes = filteredNotes.filter((n) => !n.isPinned);

    unpinnedNotes.sort((a, b) => {
      const [key, order] = sortOption.split("-");

      const valA = a[key as keyof Note] || 0;
      const valB = b[key as keyof Note] || 0;

      if (key === "title") {
        return order === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      }

      if (key === "createdAt" || key === "updatedAt") {
        const dateA = new Date(valA).getTime();
        const dateB = new Date(valB).getTime();
        return order === "asc" ? dateA - dateB : dateB - dateA;
      }

      const numA = typeof valA === "number" ? valA : 0;
      const numB = typeof valB === "number" ? valB : 0;

      return order === "asc" ? numA - numB : numB - numA;
    });

    return [...pinnedNotes, ...unpinnedNotes];
  }, [filteredNotes, sortOption]);

  const fabActions = [
    { label: "নতুন নোট", action: handleNewNote, icon: "FilePlus" },
    { label: "নোট ইম্পোর্ট করুন", action: handleImportClick, icon: "Upload" },
  ];

  return (
    <div className="flex h-full bg-background">
      <Sidebar />
      <div className={cn("flex-1 lg:pl-72", fontClass)}>
        <div className="relative h-full space-y-8 p-4 sm:p-6 lg:p-8">
          <NotesHeader
            sortOption={sortOption}
            setSortOption={setSortOption}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          {sortedNotes.length > 0 ? (
            <NotesGrid notes={sortedNotes} />
          ) : (
            <EmptyState
              onNewNote={handleNewNote}
              onImportClick={handleImportClick}
              isSearching={!!debouncedSearchQuery}
            />
          )}
          <input
            type="file"
            ref={importInputRef}
            onChange={handleFileImport}
            className="hidden"
            accept=".json"
          />
          <ExpandableFab actions={fabActions} />
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  onNewNote,
  onImportClick,
  isSearching,
}: {
  onNewNote: () => void;
  onImportClick: () => void;
  isSearching: boolean;
}) {
  const iconVariants = {
    hidden: { scale: 0.5, rotate: -15 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="flex h-full min-h-[50vh] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/50 p-8 text-center"
    >
      <motion.div
        variants={iconVariants}
        initial="hidden"
        animate="visible"
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          className="h-8 w-8 text-primary"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <path d="M14 2v6h6" />
          <path d="M10 12h4" />
          <path d="M8 16h8" />
        </svg>
      </motion.div>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        {isSearching ? "কোনও ফলাফল পাওয়া যায়নি" : "আপনার ক্যানভাস অপেক্ষা করছে"}
      </h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        {isSearching
          ? "আপনার সার্চ কোয়েরির সাথে মেলে এমন কোনো নোট পাওয়া যায়নি।"
          : "আপনার প্রথম নোট তৈরি করে লেখা শুরু করুন অথবা আপনার আগের নোটগুলো ইম্পোর্ট করুন।"}
      </p>
      {!isSearching && (
        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <Button onClick={onNewNote} size="lg">
            <Plus className="mr-2 h-4 w-4" /> লেখা শুরু করুন
          </Button>
          <Button onClick={onImportClick} size="lg" variant="outline">
            নোট ইম্পোর্ট করুন
          </Button>
        </div>
      )}
    </motion.div>
  );
}
