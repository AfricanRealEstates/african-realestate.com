import { Loader2 } from "lucide-react";
// import CardSkeleton from "@/components/globals/card-skeleton";
// import React from "react";

// export default function DashboardBillingLoading() {
//   return (
//     <section className="max-w-7xl mx-auto w-full px-8 mt-9">
//       <div className="grid gap-10">
//         <CardSkeleton />
//       </div>
//     </section>
//   );
// }

export default function Loading() {
  return (
    <div className="flex h-full items-center justify-center bg-gray-50">
      <Loader2 className="w-8 animate-spin" />
    </div>
  );
}
