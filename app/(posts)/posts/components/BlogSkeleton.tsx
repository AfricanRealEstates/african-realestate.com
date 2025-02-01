import { Skeleton } from "@/components/ui/skeleton";

export function BlogPostSkeleton() {
  return (
    <div className="flex flex-col hover:scale-[1.01] transition-transform duration-300 ease-in-out">
      <Skeleton className="mb-4 rounded-lg aspect-[16/9] w-full" />
      <div className="px-1 flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex items-center gap-2 mt-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  );
}
