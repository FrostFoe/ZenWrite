"use client";

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

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
export default EmptyTrashState;
