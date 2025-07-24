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

const fonts = [
  { value: "font-inter", label: "Inter" },
  { value: "font-sora", label: "Sora" },
  { value: "font-outfit", label: "Outfit" },
];

export default function SettingsPage() {
  const { settings, setSetting } = useSettings();
  const router = useRouter();
  const fontClass = settings.font.split(" ")[0];

  const handleExport = () => {
    try {
      exportNotes();
      toast.success("Notes exported successfully!");
    } catch (error) {
      toast.error("Failed to export notes.");
    }
  };

  const handleClearData = () => {
    if (
      window.confirm(
        "Are you sure you want to delete all your notes? This action cannot be undone.",
      )
    ) {
      clearAllNotes();
      toast.success("All notes have been cleared.");
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
              Settings
            </h1>
            <p className="mt-2 text-muted-foreground">
              Customize your writing sanctuary.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Tailor the look and feel of your workspace.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme-select">Theme</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => setSetting("theme", value)}
                  >
                    <SelectTrigger id="theme-select">
                      <SelectValue placeholder="Select a theme" />
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
                  <Label htmlFor="font-select">Font</Label>
                  <Select
                    value={settings.font}
                    onValueChange={(value) => setSetting("font", value)}
                  >
                    <SelectTrigger id="font-select">
                      <SelectValue placeholder="Select a font" />
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
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Manage your notes and application data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleExport} variant="outline" className="w-full">
                  Export All Notes
                </Button>
                <Button
                  onClick={handleClearData}
                  variant="destructive"
                  className="w-full"
                >
                  Clear All Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
