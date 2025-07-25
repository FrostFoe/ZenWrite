import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <WifiOff className="h-16 w-16 mb-4 text-muted-foreground" />
      <h1 className="text-3xl font-bold mb-2">আপনি অফলাইনে আছেন</h1>
      <p className="text-muted-foreground">
        আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন এবং আবার চেষ্টা করুন।
      </p>
    </div>
  );
}
