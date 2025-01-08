import { Button } from "@/components/ui/button";

interface ViewModeSelectorProps {
  viewMode: "unpaid" | "paid" | "all";
  onChangeViewMode: (mode: "unpaid" | "paid" | "all") => void;
  unpaidCount: number;
  paidCount: number;
  totalCount: number;
}

export function ViewModeSelector({
  viewMode,
  onChangeViewMode,
  unpaidCount,
  paidCount,
  totalCount,
}: ViewModeSelectorProps) {
  return (
    <div className="flex justify-center space-x-2 mb-4">
      <Button
        variant={viewMode === "unpaid" ? "default" : "outline"}
        onClick={() => onChangeViewMode("unpaid")}
      >
        Unpaid ({unpaidCount})
      </Button>
      <Button
        variant={viewMode === "paid" ? "default" : "outline"}
        onClick={() => onChangeViewMode("paid")}
      >
        Paid ({paidCount})
      </Button>
      <Button
        variant={viewMode === "all" ? "default" : "outline"}
        onClick={() => onChangeViewMode("all")}
      >
        All ({totalCount})
      </Button>
    </div>
  );
}
