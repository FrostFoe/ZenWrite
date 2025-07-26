"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { useSettingsStore } from "@/stores/use-settings";
import { useNotes } from "@/stores/use-notes";
import { cn, getTextFromEditorJS } from "@/lib/utils";
import { importNotes } from "@/lib/storage";
import { toast } from "sonner";
import Loading from "@/app/loading";
import { NotesGrid } from "./_components/notes-grid";
import { NotesList } from "./_components/notes-list";
import NotesHeader, {
  SortOption,
  ViewMode,
} from "./_components/notes-header";
import EmptyState from "./_components/empty-state";
import { ExpandableFab } from "@/components/ui/expandable-fab";

export default function NotesPage() {
  const router = useRouter();
  const font = useSettingsStore((state) => state.font);

  const {
    notes: initialNotes,
    isLoading,
    hasFetched,
    fetchNotes,
    createNote,
    addImportedNotes,
  } = useNotes();

  const [sortOption, setSortOption] = useState<SortOption>("updatedAt-desc");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hasFetched) {
      fetchNotes();
    }
  }, [fetchNotes, hasFetched]);

  const handleNewNote = useCallback(async () => {
    try {
      const noteId = await createNote();
      if (noteId) {
        toast.success("নতুন নোট তৈরি হয়েছে!");
        router.push(`/editor/${noteId}`);
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
    const sorted = [...filteredNotes].sort((a, b) => {
      const [key, order] = sortOption.split("-");
      const valA = a[key as keyof typeof a] || 0;
      const valB = b[key as keyof typeof b] || 0;

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

    return sorted.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [filteredNotes, sortOption]);

  if (isLoading && !hasFetched) {
    return <Loading />;
  }

  const fabActions = [
    { label: "নতুন নোট", action: handleNewNote, icon: "FilePlus" },
    { label: "নোট ইম্পোর্ট করুন", action: handleImportClick, icon: "Upload" },
  ];

  return (
    <div
      className={cn(
        "relative h-full space-y-8 p-4 sm:p-6 lg:p-8",
        font.split(" ")[0],
      )}
    >
      <NotesHeader
        sortOption={sortOption}
        setSortOption={setSortOption}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      {sortedNotes.length > 0 ? (
        viewMode === "grid" ? (
          <NotesGrid notes={sortedNotes} />
        ) : (
          <NotesList notes={sortedNotes} />
        )
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
  );
}
