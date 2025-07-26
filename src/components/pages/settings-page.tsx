
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { clearAllNotes, exportNotes, importNotes } from "@/lib/storage";
import { useRouter } from "next/navigation";
import Sidebar from "../nav/sidebar";
import { cn } from "@/lib/utils";
import { useNotes } from "@/hooks/use-notes";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { Switch } from "../ui/switch";
import { User, LogOut, AlertTriangle } from "lucide-react";

const themes = [
  { value: "theme-vanilla-fog", label: "Vanilla Fog" },
  { value: "theme-silk-noir", label: "Silk Noir" },
  { value: "theme-ocean-mist", label: "Ocean Mist" },
  { value: "theme-minty-fresh", label: "Minty Fresh" },
  { value: "theme-midnight-dusk", label: "Midnight Dusk" },
];

const fonts = [
  { value: "font-tiro-bangla", label: "Tiro Bangla" },
  { value: "font-hind-siliguri", label: "Hind Siliguri" },
  { value: "font-baloo-da-2", label: "Baloo Da 2" },
];

const isGoogleAuthAvailable = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function SettingsPage() {
  const {
    theme,
    font,
    isDriveSyncEnabled,
    userProfile,
    setSetting,
    setUserProfile,
    clearUserProfile,
    toggleDriveSync,
  } = useSettingsStore();

  const router = useRouter();
  const fontClass = font.split(" ")[0];
  const importInputRef = useRef<HTMLInputElement>(null);
  const addImportedNotes = useNotes((state) => state.addImportedNotes);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoRes = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        );
        const userInfo = await userInfoRes.json();
        setUserProfile({
          ...userInfo,
          accessToken: tokenResponse.access_token,
        });
        toast.success(`স্বাগতম, ${userInfo.name}!`);
      } catch (error) {
        toast.error("ব্যবহারকারীর তথ্য আনতে ব্যর্থ হয়েছে।");
        console.error(error);
      }
    },
    onError: () => {
      toast.error("Google সাইন-ইন ব্যর্থ হয়েছে।");
    },
    scope: "https://www.googleapis.com/auth/drive.file",
  });

  const handleLogout = () => {
    googleLogout();
    clearUserProfile();
    toast.info("সফলভাবে সাইন আউট হয়েছেন।");
  };

  const handleExport = () => {
    try {
      exportNotes();
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
          "নোট ইমপোর্ট করতে ব্যর্থ হয়েছে। ফাইল ফরম্যাট সঠিক কিনা তা পরীক্ষা করুন।",
        );
        console.error(error);
      } finally {
        if (importInputRef.current) {
          importInputRef.current.value = "";
        }
      }
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
      router.push("/notes"); // Redirect to a clean slate
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

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                    value={theme}
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
                <CardTitle>Google Drive সিঙ্ক</CardTitle>
                <CardDescription>
                  আপনার নোট ক্লাউডে ব্যাকআপ এবং সিঙ্ক করুন।
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-4 h-full">
                {!isGoogleAuthAvailable ? (
                  <div className="text-center text-muted-foreground">
                    <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
                    <p className="font-semibold">ফিচারটি কনফিগার করা হয়নি</p>
                    <p className="text-sm">
                      এই ফিচারটি চালু করতে অ্যাপ অ্যাডমিনিস্ট্রেটরের সাথে যোগাযোগ করুন।
                    </p>
                  </div>
                ) : userProfile ? (
                  <>
                    <Avatar>
                      <AvatarImage
                        src={userProfile.picture}
                        alt={userProfile.name}
                      />
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p className="font-semibold">{userProfile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {userProfile.email}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 w-full pt-4">
                      <Label htmlFor="drive-sync-switch" className="flex-grow">
                        Drive সিঙ্ক চালু করুন
                      </Label>
                      <Switch
                        id="drive-sync-switch"
                        checked={isDriveSyncEnabled}
                        onCheckedChange={(checked) => toggleDriveSync(checked)}
                      />
                    </div>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      সাইন আউট
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => login()} className="w-full">
                    Google দিয়ে সাইন ইন করুন
                  </Button>
                )}
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
                  disabled={isDriveSyncEnabled}
                >
                  নোট ইমপোর্ট করুন
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
