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

    if (noteId === 'new') {
        // This case should ideally not be hit with the new flow,
        // but as a fallback, we redirect to notes.
        router.replace('/notes');
        return;
    }

    const fetchNote = async () => {
      const fetchedNote = await getNote(noteId);
      if (!fetchedNote) {
        // If no note is found, redirect to the main notes page.
        router.replace("/notes");
      } else {
        setNote(fetchedNote);
      }
      setLoading(false);
    };

    fetchNote();
  }, [noteId, router]);

  if (loading) {
    return <Loading />;
  }

  if (!note) {
    // This state can be reached briefly before router.replace() kicks in
    // or if the note is not found.
    return <Loading />;
  }

  return <EditorPage note={note} />;
}
