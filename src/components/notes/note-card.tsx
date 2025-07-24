"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { bn } from 'date-fns/locale';
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
        formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true, locale: bn }),
      );
    }
  }, [note.updatedAt]);

  const contentPreview = React.useMemo(() => {
    const text = getTextFromEditorJS(note.content);
    return text.substring(0, 100) + (text.length > 100 ? "..." : "");
  }, [note.content]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <motion.div layout variants={cardVariants} whileHover={{ translateY: -5, scale: 1.02 }}>
      <Link href={`/editor/${note.id}`} className="block h-full">
        <Card
          className={cn(
            "flex h-full cursor-pointer flex-col border-2 border-transparent transition-all duration-300 ease-in-out hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10",
            fontClass,
          )}
        >
          <CardHeader>
            <CardTitle className="line-clamp-2 text-xl font-semibold">
              {note.title || "শিরোনামহীন নোট"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {contentPreview || "কোনও অতিরিক্ত বিষয়বস্তু নেই।"}
            </p>
          </CardContent>
          <CardFooter className="flex justify-end text-xs text-muted-foreground">
            <span>{formattedDate}</span>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
