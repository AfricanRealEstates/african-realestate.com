import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";

interface PropertyPaymentCTAProps {
  unpaidPropertiesCount: number;
  paidPropertiesCount: number;
  totalPropertiesCount: number;
  viewMode: "unpaid" | "paid" | "all";
  onChangeViewMode: (mode: "unpaid" | "paid" | "all") => void;
}

export function PropertyPaymentCTA({
  unpaidPropertiesCount,
  paidPropertiesCount,
  totalPropertiesCount,
  viewMode,
  onChangeViewMode,
}: PropertyPaymentCTAProps) {
  if (totalPropertiesCount === 0) {
    return null;
  }

  const allPropertiesPaid =
    unpaidPropertiesCount === 0 && totalPropertiesCount > 0;

  return (
    <div
      className={`border-l-4 p-4 mb-6 rounded-r-lg ${
        allPropertiesPaid
          ? "bg-green-50 border-green-400"
          : "bg-yellow-50 border-yellow-400"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {allPropertiesPaid ? (
              <CheckCircle
                className="h-5 w-5 text-green-400"
                aria-hidden="true"
              />
            ) : (
              <AlertCircle
                className="h-5 w-5 text-yellow-400"
                aria-hidden="true"
              />
            )}
          </div>
          <div className="ml-3 space-y-2">
            {allPropertiesPaid ? (
              <p className="text-sm text-green-700">
                Congratulations! All your properties are paid and published.
              </p>
            ) : (
              <>
                <p className="text-sm text-yellow-700">
                  You have {unpaidPropertiesCount} unpublished{" "}
                  {unpaidPropertiesCount === 1 ? "property" : "properties"}.
                </p>
                <p className="text-sm text-yellow-700">
                  Pay NOW for{" "}
                  {unpaidPropertiesCount === 1 ? "property" : "properties"} to
                  go live
                </p>
              </>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-3 gap-2">
          <Button
            onClick={() => onChangeViewMode("unpaid")}
            variant={viewMode === "unpaid" ? "default" : "outline"}
            size="sm"
            className={`${
              viewMode === "unpaid"
                ? "bg-blue-500 text-white border-2 border-blue-600 w-full"
                : allPropertiesPaid
                ? "bg-green-50 text-green-700 hover:bg-green-100 w-full"
                : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 w-full"
            }`}
          >
            Unpublished ({unpaidPropertiesCount})
          </Button>
          <Button
            onClick={() => onChangeViewMode("paid")}
            variant={viewMode === "paid" ? "default" : "outline"}
            size="sm"
            className={`${
              viewMode === "paid"
                ? "bg-blue-500 text-white border-2 border-blue-600 w-full"
                : allPropertiesPaid
                ? "bg-green-50 text-green-700 hover:bg-green-100 w-full"
                : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 w-full"
            }`}
          >
            Published ({paidPropertiesCount})
          </Button>
          <Button
            onClick={() => onChangeViewMode("all")}
            variant={viewMode === "all" ? "default" : "outline"}
            size="sm"
            className={`${
              viewMode === "all"
                ? "bg-blue-500 text-white border-2 border-blue-600 w-full"
                : allPropertiesPaid
                ? "bg-green-50 text-green-700 hover:bg-green-100 w-full"
                : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 w-full"
            }`}
          >
            All ({totalPropertiesCount})
          </Button>
        </div>
      </div>
    </div>
  );
}
