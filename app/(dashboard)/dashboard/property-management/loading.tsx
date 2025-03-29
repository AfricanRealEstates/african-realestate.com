import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-full items-center justify-center bg-gray-50">
      <Loader2 className="w-8 animate-spin text-indigo-500" />
    </div>
  );
}
