
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import EditorPage from "@/components/pages/editor-page";
import { getNote } from "@/lib/storage";
import { Note } from "@/lib/types";
import Loading from "@/app/loading";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const noteId = params.noteId as string;
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!noteId) return;

    // This case should not be hit with the new flow, but as a fallback, redirect.
    if (noteId === "new") {
      router.replace("/notes");
      return;
    }

    const fetchNote = async () => {
      try {
        const fetchedNote = await getNote(noteId);
        if (fetchedNote) {
          setNote(fetchedNote);
        } else {
          // If no note is found, redirect to the main notes page.
          router.replace("/notes");
        }
      } catch (error) {
        console.error("Failed to fetch note:", error);
        router.replace("/notes");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId, router]);

  if (loading) {
    return <Loading />;
  }

  // This can be shown briefly before router.replace() kicks in or if note fetch fails.
  if (!note) {
    return <Loading />;
  }

  return <EditorPage note={note} />;
}
