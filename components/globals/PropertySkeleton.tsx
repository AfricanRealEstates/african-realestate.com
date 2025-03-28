export function PropertySkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <div className="relative flex-shrink-0 h-48 bg-neutral-200 animate-pulse"></div>
      <div className="flex flex-1 flex-col p-4 space-y-4">
        <div className="h-4 w-3/4 bg-neutral-200 rounded animate-pulse"></div>
        <div className="h-4 w-1/2 bg-neutral-200 rounded animate-pulse"></div>
        <div className="h-4 w-5/6 bg-neutral-200 rounded animate-pulse"></div>
        <div className="flex space-x-2">
          <div className="h-8 w-16 bg-neutral-200 rounded animate-pulse"></div>
          <div className="h-8 w-16 bg-neutral-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
