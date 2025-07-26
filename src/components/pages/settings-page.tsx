
"use client";

import { useRef } from "react";
import { useSettingsStore } from "@/hooks/use-settings";
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
import { clearAllNotes, exportNotes, importNotes } from "@/lib/storage";
import { useRouter } from "next/navigation";
import Sidebar from "../nav/sidebar";
import { cn } from "@/lib/utils";
import { useNotes } from "@/hooks/use-notes";
import { UploadCloud, DownloadCloud, Trash } from "lucide-react";
import { useTheme } from "next-themes";
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


const fonts = [
  { value: "font-tiro-bangla", label: "Tiro Bangla" },
  { value: "font-hind-siliguri", label: "Hind Siliguri" },
  { value: "font-baloo-da-2", label: "Baloo Da 2" },
];

export default function SettingsPage() {
  const { font, setSetting } = useSettingsStore();
  const { setTheme } = useTheme();

  const router = useRouter();
  const fontClass = font.split(" ")[0];
  const importInputRef = useRef<HTMLInputElement>(null);
  
  const { addImportedNotes } = useNotes();

  const handleExport = async () => {
    try {
      await exportNotes();
      toast.success("নোট সফলভাবে এক্সপোর্ট করা হয়েছে!");
    } catch (error) {
      toast.error("নোট এক্সপোর্ট করতে ব্যর্থ হয়েছে।");
    }
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleFileImport = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const imported = await importNotes(file);
        addImportedNotes(imported);
        toast.success(`${imported.length} টি নোট সফলভাবে ইমপোর্ট করা হয়েছে!`);
      } catch (error) {
        toast.error(
          "নোট ইম্পোর্ট করতে ব্যর্থ হয়েছে। ফাইল ফরম্যাট সঠিক কিনা তা পরীক্ষা করুন।",
        );
        console.error(error);
      } finally {
        if (importInputRef.current) {
          importInputRef.current.value = "";
        }
      }
    }
  };

  const handleClearData = async () => {
    await clearAllNotes();
    toast.success("সমস্ত নোট মুছে ফেলা হয়েছে।");
    router.push("/notes"); // Redirect to a clean slate
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

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>সাধারণ</CardTitle>
                <CardDescription>
                  অ্যাপের চেহারা এবং ফন্ট পরিবর্তন করুন।
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme-select">থিম</Label>
                   <Select onValueChange={setTheme} defaultValue="system">
                    <SelectTrigger id="theme-select">
                      <SelectValue placeholder="একটি থিম নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">লাইট</SelectItem>
                        <SelectItem value="dark">ডার্ক</SelectItem>
                        <SelectItem value="system">সিস্টেম</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="font-select">ফন্ট</Label>
                  <Select
                    value={font}
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
                <Button
                  onClick={handleImportClick}
                  variant="outline"
                  className="w-full"
                >
                  <DownloadCloud className="mr-2 h-4 w-4" />
                  ফাইল থেকে ইম্পোর্ট করুন
                </Button>
                <input
                  type="file"
                  ref={importInputRef}
                  onChange={handleFileImport}
                  className="hidden"
                  accept=".json"
                />
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="w-full"
                >
                   <UploadCloud className="mr-2 h-4 w-4" />
                  ফাইলে এক্সপোর্ট করুন
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                       <Trash className="mr-2 h-4 w-4" />
                       সমস্ত ডেটা সাফ করুন
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                      <AlertDialogDescription>
                        এই ক্রিয়াটি আপনার সমস্ত লোকাল নোট স্থায়ীভাবে মুছে ফেলবে। এটি বাতিল করা যাবে না।
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>বাতিল করুন</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleClearData}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        ডিলিট করুন
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
