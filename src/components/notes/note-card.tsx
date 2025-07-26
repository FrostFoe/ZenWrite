
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { bn } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Note } from "@/lib/types";
import { getTextFromEditorJS, cn } from "@/lib/utils";
import { useSettings } from "@/hooks/use-settings";
import { useNotes } from "@/hooks/use-notes";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface NoteCardProps {
  note: Note;
}

function NoteCardComponent({ note }: NoteCardProps) {
  const [formattedDate, setFormattedDate] = React.useState("");
  const { settings } = useSettings();
  const { trashNote, updateNote } = useNotes();
  const fontClass = settings.font.split(" ")[0];

  const [isRenameOpen, setIsRenameOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState(note.title);

  React.useEffect(() => {
    if (note.updatedAt) {
      setFormattedDate(
        formatDistanceToNow(new Date(note.updatedAt), {
          addSuffix: true,
          locale: bn,
        }),
      );
    }
  }, [note.updatedAt]);

  const contentPreview = React.useMemo(() => {
    const text = getTextFromEditorJS(note.content);
    return text.substring(0, 100) + (text.length > 100 ? "..." : "");
  }, [note.content]);

  const handleTrash = () => {
    trashNote(note.id);
    toast.success("নোটটি ট্র্যাশে পাঠানো হয়েছে।");
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("শিরোনাম খালি রাখা যাবে না।");
      return;
    }
    const newContent = { ...note.content };
    if (newContent.blocks.length > 0 && newContent.blocks[0]?.type === "header") {
      newContent.blocks[0].data.text = newTitle;
    } else {
      newContent.blocks.unshift({
        id: `block_${Date.now()}`,
        type: "header",
        data: { text: newTitle, level: 1 },
      });
    }

    const updates = { title: newTitle, content: newContent };
    await updateNote(note.id, updates);
    setIsRenameOpen(false);
    toast.success("নোট রিনেম করা হয়েছে।");
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 }
  };

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
      whileHover={{ translateY: -5, scale: 1.02 }}
    >
      <Card
        className={cn(
          "flex h-full flex-col border-2 border-transparent transition-all duration-300 ease-in-out hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10",
          fontClass,
        )}
      >
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <Link href={`/editor/${note.id}`} className="block w-full overflow-hidden">
            <CardTitle className="line-clamp-2 text-xl font-semibold">
              {note.title || "শিরোনামহীন নোট"}
            </CardTitle>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>রিনেম করুন</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>নোট রিনেম করুন</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleRename}>
                    <div className="grid gap-4 py-4">
                      <Input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="নতুন শিরোনাম"
                        autoFocus
                      />
                    </div>
                    <Button type="submit">সেভ করুন</Button>
                  </form>
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-destructive"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>ট্র্যাশে পাঠান</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                    <AlertDialogDescription>
                      এই নোটটি ট্র্যাশে পাঠানো হবে। আপনি ট্র্যাশ থেকে এটি পুনরুদ্ধার করতে পারবেন।
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>বাতিল করুন</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleTrash}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      ট্র্যাশে পাঠান
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <Link href={`/editor/${note.id}`} className="block h-full">
          <CardContent className="flex-grow">
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {contentPreview || "কোনও অতিরিক্ত বিষয়বস্তু নেই।"}
            </p>
          </CardContent>
          <CardFooter className="flex justify-end text-xs text-muted-foreground">
            <span>{formattedDate}</span>
          </CardFooter>
        </Link>
      </Card>
    </motion.div>
  );
}

export const NoteCard = React.memo(NoteCardComponent, (prevProps, nextProps) => {
  // This custom comparison function prevents re-rendering if the note's core data hasn't changed.
  return (
    prevProps.note.id === nextProps.note.id &&
    prevProps.note.title === nextProps.note.title &&
    prevProps.note.updatedAt === nextProps.note.updatedAt &&
    prevProps.note.content === nextProps.note.content
  );
});
