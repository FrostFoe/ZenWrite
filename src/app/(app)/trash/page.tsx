
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/nav/sidebar";
import { useNotes } from "@/hooks/use-notes";
import Loading from "@/app/loading";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/hooks/use-settings";
import { Trash2, RotateCcw } from "lucide-react";
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
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { bn } from "date-fns/locale";

export default function TrashPage() {
  const font = useSettingsStore((state) => state.font);
  const router = useRouter();

  const trashedNotes = useNotes((state) => state.trashedNotes);
  const isLoading = useNotes((state) => state.isLoading);
  const fetchTrashedNotes = useNotes((state) => state.fetchTrashedNotes);
  const restoreNote = useNotes((state) => state.restoreNote);
  const deleteNotePermanently = useNotes(
    (state) => state.deleteNotePermanently,
  );

  useEffect(() => {
    fetchTrashedNotes();
  }, [fetchTrashedNotes]);

  const handleRestore = async (id: string) => {
    await restoreNote(id);
    toast.success("নোটটি পুনরুদ্ধার করা হয়েছে!");
  };

  const handleDelete = async (id: string) => {
    await deleteNotePermanently(id);
    toast.success("নোটটি স্থায়ীভাবে ডিলিট করা হয়েছে।");
  };

  if (isLoading) {
    return <Loading />;
  }
  
  const containerVariants = {
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
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <div className="flex h-full bg-background">
      <Sidebar />
      <div className={cn("flex-1 lg:pl-72", font.split(" ")[0])}>
        <div className="h-full space-y-8 p-4 sm:p-6 lg:p-8">
          <header>
            <h1 className={cn("text-3xl font-bold tracking-tight text-foreground sm:text-4xl", font.split(" ")[0])}>
              ট্র্যাশ
            </h1>
             <p className="mt-2 text-muted-foreground">
                ডিলিট করা নোটগুলো এখানে ৩০ দিন পর্যন্ত থাকবে।
             </p>
          </header>

          {trashedNotes.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <AnimatePresence>
                {trashedNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    layout
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent"
                  >
                    <div className="flex-1 mb-4 sm:mb-0">
                      <h3 className="font-semibold text-foreground">
                        {note.title || "শিরোনামহীন নোট"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        ট্র্যাশে পাঠানো হয়েছে: {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true, locale: bn })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRestore(note.id)}
                        aria-label="Restore note"
                      >
                        <RotateCcw className="h-5 w-5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            aria-label="Delete permanently"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                            <AlertDialogDescription>
                              এই নোটটি স্থায়ীভাবে ডিলিট করা হবে। এই ক্রিয়াটি বাতিল করা যাবে না।
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>বাতিল করুন</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(note.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              স্থায়ীভাবে ডিলিট করুন
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <EmptyTrashState />
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyTrashState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="flex min-h-[50vh] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/50 p-8 text-center"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Trash2 className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        ট্র্যাশ খালি
      </h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        আপনি যখন কোনো নোট ডিলিট করবেন, তখন সেটি এখানে এসে জমা হবে।
      </p>
    </motion.div>
  );
}
