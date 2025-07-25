"use client";

import * as React from "react";
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
import { updateNote } from "@/lib/storage";

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const [formattedDate, setFormattedDate] = React.useState("");
  const { settings } = useSettings();
  const { deleteNote: deleteNoteFromStore } = useNotes();
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

  const handleDelete = () => {
    deleteNoteFromStore(note.id);
    toast.success("নোট ডিলিট করা হয়েছে।");
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("শিরোনাম খালি রাখা যাবে না।");
      return;
    }
    const newContent = { ...note.content };
    if (newContent.blocks[0]?.type === "header") {
      newContent.blocks[0].data.text = newTitle;
    } else {
      newContent.blocks.unshift({
        id: `block_${Date.now()}`,
        type: "header",
        data: { text: newTitle, level: 1 },
      });
    }

    await updateNote(note.id, { title: newTitle, content: newContent });
    setIsRenameOpen(false);
    toast.success("নোট রিনেম করা হয়েছে।");
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <motion.div
      layout
      variants={cardVariants}
      whileHover={{ translateY: -5, scale: 1.02 }}
    >
      <Card
        className={cn(
          "flex h-full flex-col border-2 border-transparent transition-all duration-300 ease-in-out hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10",
          fontClass,
        )}
      >
        <CardHeader className="flex flex-row items-start justify-between">
          <Link href={`/editor/${note.id}`} className="block w-full">
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
                    <span>ডিলিট করুন</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                    <AlertDialogDescription>
                      এই নোটটি ডিলিট করলে আর ফেরত পাওয়া যাবে না। আপনি কি সত্যিই
                      এটি ডিলিট করতে চান?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>বাতিল করুন</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      ডিলিট করুন
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
