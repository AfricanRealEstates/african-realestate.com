// import CardSkeleton from "@/components/globals/card-skeleton";
// import React from "react";

// export default function Loading() {
//   return (
//     <div className="max-w-7xl mx-auto px-8 w-full">
//       <section className="grid gap-10">
//         <CardSkeleton />
//       </section>
//       <section className="divide-border-200 divide-y rounded-md border">
//         <CardSkeleton />
//         <CardSkeleton />
//         <CardSkeleton />
//         <CardSkeleton />
//       </section>
//     </div>
//   );
// }

import { Loader2 } from "lucide-react";
import React from "react";

export default function Loading() {
  return (
    <div className="flex h-full items-center justify-center bg-gray-50">
      <Loader2 className="w-8 animate-spin text-indigo-500" />
    </div>
  );
}
