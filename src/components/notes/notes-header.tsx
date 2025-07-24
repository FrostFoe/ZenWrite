"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { LayoutGrid, List, Plus } from "lucide-react";
import Link from "next/link";
import { useSettings } from "@/hooks/use-settings";
import { cn } from "@/lib/utils";

type SortOption =
  `${"updatedAt" | "createdAt" | "title" | "charCount"}-${"asc" | "desc"}`;

interface NotesHeaderProps {
  sortOption: SortOption;
  setSortOption: (sort: SortOption) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

export default function NotesHeader({
  sortOption,
  setSortOption,
  viewMode,
  setViewMode,
}: NotesHeaderProps) {
  const { settings } = useSettings();
  const [fontClass] = settings.font.split(" ");
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h1
        className={cn(
          "text-3xl font-bold tracking-tight text-foreground sm:text-4xl",
          fontClass,
        )}
      >
        আমার নোট
      </h1>
      <div className="flex items-center gap-2">
        <Select
          value={sortOption}
          onValueChange={(value) => setSortOption(value as SortOption)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="সাজান..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updatedAt-desc">সম্প্রতি আপডেট হয়েছে</SelectItem>
            <SelectItem value="createdAt-desc">নতুন প্রথমে</SelectItem>
            <SelectItem value="createdAt-asc">পুরানো প্রথমে</SelectItem>
            <SelectItem value="title-asc">শিরোনাম (A-Z)</SelectItem>
            <SelectItem value="title-desc">শিরোনাম (Z-A)</SelectItem>
            <SelectItem value="charCount-desc">দৈর্ঘ্য (দীর্ঘতম)</SelectItem>
            <SelectItem value="charCount-asc">দৈর্ঘ্য (সংক্ষিপ্ততম)</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md bg-muted p-0.5 flex">
          <Button
            variant={viewMode === "grid" ? "outline" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className={cn(
              "h-8 w-8",
              viewMode === "grid" && "bg-background shadow-sm",
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "outline" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
            className={cn(
              "h-8 w-8",
              viewMode === "list" && "bg-background shadow-sm",
            )}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        <Button asChild className="hidden">
          <Link href="/editor/new">
            <Plus className="mr-2 h-4 w-4" /> নতুন নোট
          </Link>
        </Button>
      </div>
    </header>
  );
}
