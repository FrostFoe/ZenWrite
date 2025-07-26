
"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTextFromEditorJS } from "@/lib/utils";
import type { NoteHistory } from "@/lib/types";
import { Clock, RotateCcw } from "lucide-react";

interface NoteHistoryTimelineProps {
  history: NoteHistory[];
  onRestore: (versionIndex: number) => void;
}

export default function NoteHistoryTimeline({
  history,
  onRestore,
}: NoteHistoryTimelineProps) {
  const timelineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      variants={timelineVariants}
      initial="hidden"
      animate="visible"
      className="relative space-y-8"
    >
      <div
        className="absolute left-4 top-4 -z-10 h-full w-0.5 bg-border"
        aria-hidden="true"
      />
      {history.map((version, index) => {
        const contentPreview = getTextFromEditorJS(version.content).substring(
          0,
          200,
        );
        const title = version.content.blocks.find(b => b.type === 'header')?.data.text || 'শিরোনামহীন';

        return (
          <motion.div
            key={version.updatedAt}
            variants={itemVariants}
            className="relative flex items-start gap-4"
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                  সংরক্ষিত হয়েছে:{" "}
                  {format(new Date(version.updatedAt), "PPpp", { locale: bn })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {contentPreview}...
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => onRestore(index)}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  এই সংস্করণ পুনরুদ্ধার করুন
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
