import { PropertySkeleton } from "@/components/globals/PropertySkeleton";

interface PropertySkeletonGridProps {
  count?: number;
  columns?: string;
}

export function PropertySkeletonGrid({
  count = 6,
  columns = "grid-cols-[repeat(auto-fill,_minmax(335px,1fr))]",
}: PropertySkeletonGridProps) {
  return (
    <div className={`mx-auto mb-8 gap-8 grid w-full ${columns} justify-center`}>
      {Array.from({ length: count }).map((_, index) => (
        <PropertySkeleton key={index} />
      ))}
    </div>
  );
}
