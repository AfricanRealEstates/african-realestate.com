import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";

interface PropertyPaymentCTAProps {
  unpaidPropertiesCount: number;
  totalPropertiesCount: number;
  showUnpaidProperties: boolean;
  onTogglePropertyView: () => void;
}

export function PropertyPaymentCTA({
  unpaidPropertiesCount,
  totalPropertiesCount,
  showUnpaidProperties,
  onTogglePropertyView,
}: PropertyPaymentCTAProps) {
  const paidPropertiesCount = totalPropertiesCount - unpaidPropertiesCount;

  if (unpaidPropertiesCount === 0) {
    return (
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircle
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              Congratulations! All your properties are paid and published.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle
              className="h-5 w-5 text-yellow-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3 space-y-2">
            <p className="text-sm text-yellow-700">
              You have {unpaidPropertiesCount} unpublished{" "}
              {unpaidPropertiesCount === 1 ? "property" : "properties"} due to
              pending payment.
            </p>
            <p className="text-sm text-yellow-700">
              Select properties to pay from below
            </p>
          </div>
        </div>
        <div className="ml-4">
          <Button
            onClick={onTogglePropertyView}
            variant="outline"
            size="sm"
            className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
          >
            {showUnpaidProperties
              ? `Show Paid (${paidPropertiesCount})`
              : `Show Unpaid (${unpaidPropertiesCount})`}
          </Button>
        </div>
      </div>
    </div>
  );
}
