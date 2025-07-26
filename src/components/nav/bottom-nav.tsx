
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/hooks/use-settings";

const navItems = [
  { href: "/notes", label: "নোট", icon: Home },
  { href: "/trash", label: "ট্র্যাশ", icon: Trash2 },
  { href: "/settings", label: "সেটিংস", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();
  const font = useSettingsStore((state) => state.font);
  const fontClass = font.split(" ")[0];

  if (pathname.startsWith("/editor/")) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/80 backdrop-blur-sm lg:hidden"
      >
        <nav className="flex h-20 items-center justify-around pb-[env(safe-area-inset-bottom)]">
          {navItems.map((item) => {
            const isActive =
              item.href === "/notes"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                href={item.href}
                key={item.label}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 rounded-lg p-2 text-sm transition-colors",
                  isActive
                    ? `text-primary ${fontClass}`
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-nav-item"
                    className="absolute -bottom-1 h-1 w-8 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </motion.div>
    </AnimatePresence>
  );
}
