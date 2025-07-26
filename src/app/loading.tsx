import Sidebar from "@/components/layout/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-full bg-background">
      <Sidebar />
      <div className="flex-1 lg:pl-72">
        <div className="h-full space-y-8 p-4 sm:p-6 lg:p-8">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Skeleton className="h-10 w-48" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-44" />
              <Skeleton className="h-10 w-20" />
            </div>
          </header>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
