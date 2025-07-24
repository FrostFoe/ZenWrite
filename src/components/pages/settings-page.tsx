"use client";

import { useSettings } from "@/hooks/use-settings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { clearAllNotes, exportNotes } from "@/lib/storage";
import { useRouter } from "next/navigation";
import Sidebar from "../nav/sidebar";
import { cn } from "@/lib/utils";

const themes = [
  { value: "theme-vanilla-fog", label: "Vanilla Fog" },
  { value: "theme-silk-noir", label: "Silk Noir" },
  { value: "theme-ocean-mist", label: "Ocean Mist" },
];

const fonts = [{ value: "font-tiro-bangla", label: "Tiro Bangla" }];

export default function SettingsPage() {
  const { settings, setSetting } = useSettings();
  const router = useRouter();
  const fontClass = settings.font.split(" ")[0];

  const handleExport = () => {
    try {
      exportNotes();
      toast.success("নোট সফলভাবে এক্সপোর্ট করা হয়েছে!");
    } catch (error) {
      toast.error("নোট এক্সপোর্ট করতে ব্যর্থ হয়েছে।");
    }
  };

  const handleClearData = () => {
    if (
      window.confirm(
        "আপনি কি নিশ্চিত যে আপনি আপনার সমস্ত নোট মুছে ফেলতে চান? এই ক্রিয়াটি বাতিল করা যাবে না।",
      )
    ) {
      clearAllNotes();
      toast.success("সমস্ত নোট মুছে ফেলা হয়েছে।");
      router.push("/notes");
    }
  };

  return (
    <div className="flex h-full bg-background">
      <Sidebar />
      <div className={cn("flex-1 lg:pl-72", fontClass)}>
        <div className="h-full space-y-8 p-4 sm:p-6 lg:p-8">
          <header>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              সেটিংস
            </h1>
            <p className="mt-2 text-muted-foreground">
              আপনার লেখার স্থান কাস্টমাইজ করুন।
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>সাধারণ</CardTitle>
                <CardDescription>
                  আপনার ওয়ার্কস্পেসের লুক এবং অনুভূতি পরিবর্তন করুন।
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme-select">থিম</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => setSetting("theme", value)}
                  >
                    <SelectTrigger id="theme-select">
                      <SelectValue placeholder="একটি থিম নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme.value} value={theme.value}>
                          {theme.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="font-select">ফন্ট</Label>
                  <Select
                    value={settings.font}
                    onValueChange={(value) => setSetting("font", value)}
                  >
                    <SelectTrigger id="font-select">
                      <SelectValue placeholder="একটি ফন্ট নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {fonts.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ডেটা ম্যানেজমেন্ট</CardTitle>
                <CardDescription>
                  আপনার নোট এবং অ্যাপ্লিকেশন ডেটা পরিচালনা করুন।
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleExport} variant="outline" className="w-full">
                  সমস্ত নোট এক্সপোর্ট করুন
                </Button>
                <Button
                  onClick={handleClearData}
                  variant="destructive"
                  className="w-full"
                >
                  সমস্ত ডেটা সাফ করুন
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
