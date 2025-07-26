"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, Trash2, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores/use-settings";

const navItems = [
  { href: "/notes", label: "নোট সমূহ", icon: Home },
  { href: "/dashboard", label: "ড্যাশবোর্ড", icon: BarChart },
  { href: "/trash", label: "ট্র্যাশ", icon: Trash2 },
  { href: "/settings", label: "সেটিংস", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const font = useSettingsStore((state) => state.font);
  const fontClass = font.split(" ")[0];

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-background px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <h1 className={cn("text-2xl font-bold tracking-tight", fontClass)}>
            আমার নোট
          </h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navItems.map((item) => {
                  const isActive =
                    item.href === "/notes"
                      ? pathname === item.href || pathname.startsWith("/editor")
                      : pathname.startsWith(item.href);
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        )}
                      >
                        <item.icon className="h-6 w-6 shrink-0" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
