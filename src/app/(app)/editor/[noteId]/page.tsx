
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

  if (!note) {
    return <Loading />;
  }

  return <EditorPage note={note} />;
}
