import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfessionalCardSkeleton() {
  return (
    <Card className="border-0 shadow-md bg-white overflow-hidden">
      <CardContent className="p-0">
        {/* Header skeleton */}
        <div className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />

        {/* Profile section */}
        <div className="relative px-6 pb-6">
          {/* Profile image skeleton */}
          <div className="relative -mt-10 mb-4">
            <Skeleton className="w-20 h-20 mx-auto rounded-full" />
          </div>

          {/* Name and role skeleton */}
          <div className="text-center mb-4 space-y-2">
            <Skeleton className="h-6 w-32 mx-auto" />
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>

          {/* Bio skeleton */}
          <div className="mb-4">
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>

          {/* Stats grid skeleton */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>

          {/* Contact info skeleton */}
          <Skeleton className="h-20 w-full rounded-xl mb-4" />

          {/* Button skeleton */}
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
