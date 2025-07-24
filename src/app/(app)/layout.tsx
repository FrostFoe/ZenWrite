import BottomNav from "@/components/nav/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 overflow-y-auto pb-24 lg:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
