
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useSettingsStore } from "@/hooks/use-settings";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

type SortOption =
  `${"updatedAt" | "createdAt" | "title" | "charCount"}-${"asc" | "desc"}`;

interface NotesHeaderProps {
  sortOption: SortOption;
  setSortOption: (sort: SortOption) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function NotesHeader({
  sortOption,
  setSortOption,
  searchQuery,
  setSearchQuery,
}: NotesHeaderProps) {
  const font = useSettingsStore((state) => state.font);
  const [fontClass] = font.split(" ");
  return (
    <header className="flex flex-col gap-4">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="নোট খুঁজুন (ট্যাগ দিয়েও)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="সাজান..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updatedAt-desc">
                সম্প্রতি আপডেট হয়েছে
              </SelectItem>
              <SelectItem value="createdAt-desc">নতুন প্রথমে</SelectItem>
              <SelectItem value="createdAt-asc">পুরানো প্রথমে</SelectItem>
              <SelectItem value="title-asc">শিরোনাম (A-Z)</SelectItem>
              <SelectItem value="title-desc">শিরোনাম (Z-A)</SelectItem>
              <SelectItem value="charCount-desc">দৈর্ঘ্য (দীর্ঘতম)</SelectItem>
              <SelectItem value="charCount-asc">দৈর্ঘ্য (সংক্ষিপ্ততম)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
