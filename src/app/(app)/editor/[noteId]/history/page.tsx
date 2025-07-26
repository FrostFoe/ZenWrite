
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, History } from "lucide-react";
import { Note } from "@/lib/types";
import { getNote, updateNote } from "@/lib/storage";
import Loading from "@/app/loading";
import Sidebar from "@/components/nav/sidebar";
import { Button } from "@/components/ui/button";
import NoteHistoryTimeline from "@/components/ui/note-history-timeline";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/hooks/use-settings";

export default function NoteHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.noteId as string;
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const font = useSettingsStore((state) => state.font);

  useEffect(() => {
    const fetchNote = async () => {
      if (!noteId) return;
      try {
        const fetchedNote = await getNote(noteId);
        if (fetchedNote) {
          setNote(fetchedNote);
        } else {
          toast.error("নোট খুঁজে পাওয়া যায়নি।");
          router.replace("/notes");
        }
      } catch (error) {
        toast.error("নোট লোড করতে সমস্যা হয়েছে।");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [noteId, router]);

  const handleRestore = async (versionIndex: number) => {
    if (!note || !note.history) return;
    const versionToRestore = note.history[versionIndex];
    if (!versionToRestore) {
      toast.error("এই সংস্করণটি পুনরুদ্ধার করা সম্ভব নয়।");
      return;
    }

    try {
      await updateNote(note.id, {
        content: versionToRestore.content,
        title: " পুনরুদ্ধার করা সংস্করণ",
      });
      toast.success("সংস্করণটি সফলভাবে পুনরুদ্ধার করা হয়েছে!");
      router.push(`/editor/${note.id}`);
    } catch (error) {
      toast.error("সংস্করণটি পুনরুদ্ধার করতে সমস্যা হয়েছে।");
      console.error(error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!note) {
    return null;
  }

  const fontClass = font.split(" ")[0];

  return (
    <div className="flex h-full bg-background">
      <Sidebar />
      <div className={cn("flex-1 lg:pl-72", fontClass)}>
        <main className="h-full space-y-8 p-4 sm:p-6 lg:p-8">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  নোটের ইতিহাস
                </h1>
                <p className="line-clamp-1 text-sm text-muted-foreground">
                  "{note.title}" এর সংস্করণসমূহ
                </p>
              </div>
            </div>
          </header>

          {note.history && note.history.length > 0 ? (
            <NoteHistoryTimeline
              history={note.history}
              onRestore={handleRestore}
            />
          ) : (
            <EmptyHistoryState />
          )}
        </main>
      </div>
    </div>
  );
}

function EmptyHistoryState() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/50 p-8 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <History className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        কোনও ইতিহাস পাওয়া যায়নি
      </h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        এই নোটটির কোনও সংরক্ষিত সংস্করণ এখনো তৈরি হয়নি।
      </p>
    </div>
  );
}
