import React, { useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeatureListProps {
  features: string[];
  initialVisibleCount?: number;
}

export function FeatureList({
  features,
  initialVisibleCount = 4,
}: FeatureListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleFeatures = isExpanded
    ? features
    : features.slice(0, initialVisibleCount);

  return (
    <div>
      <ul className="space-y-2">
        {visibleFeatures.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      {features.length > initialVisibleCount && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full text-primary"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              See less
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              See more
            </>
          )}
        </Button>
      )}
    </div>
  );
}
