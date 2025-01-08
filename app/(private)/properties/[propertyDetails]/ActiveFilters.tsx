"use client";

import { useRouter } from "next/navigation";
import { Badge } from "../../../../components/ui/badge";
import { X } from "lucide-react";
import React from "react";

const ActiveFilters = ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const router = useRouter();

  const removeFilter = (key: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    router.push(`?${newParams.toString()}`);
  };

  const filters = Object.entries(searchParams).filter(
    ([key, value]) => value && !["sort", "order"].includes(key)
  );

  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.map(([key, value]) => (
        <Badge key={key} variant="secondary" className="text-sm">
          {key}: {value}
          <X
            className="h-4 w-4 ml-2 cursor-pointer"
            onClick={() => removeFilter(key)}
          />
        </Badge>
      ))}
    </div>
  );
};

export default ActiveFilters;
