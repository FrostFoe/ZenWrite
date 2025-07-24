"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Note } from "@/lib/types";
import { getTextFromEditorJS } from "@/lib/utils";
import { useSettings } from "@/hooks/use-settings";
import { cn } from "@/lib/utils";

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const [formattedDate, setFormattedDate] = React.useState("");
  const { settings } = useSettings();
  const fontClass = settings.font.split(" ")[0];

  React.useEffect(() => {
    if (note.updatedAt) {
      setFormattedDate(
        formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true }),
      );
    }
  }, [note.updatedAt]);

  const contentPreview = React.useMemo(() => {
    const text = getTextFromEditorJS(note.content);
    return text.substring(0, 100) + (text.length > 100 ? "..." : "");
  }, [note.content]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div layout variants={cardVariants}>
      <Link href={`/editor/${note.id}`} className="block h-full">
        <Card
          className={cn(
            "flex h-full cursor-pointer flex-col border-2 border-transparent transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10",
            fontClass,
          )}
        >
          <CardHeader>
            <CardTitle className="line-clamp-2 text-lg font-semibold">
              {note.title || "Untitled Note"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {contentPreview || "No additional content."}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between text-xs text-muted-foreground">
            <span>{note.charCount || 0} characters</span>
            <span>{formattedDate}</span>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
