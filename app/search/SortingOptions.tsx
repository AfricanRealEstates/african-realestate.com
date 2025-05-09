"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sortOptions = [
  { label: "Price (Low to High)", value: "price", order: "asc" },
  { label: "Price (High to Low)", value: "price", order: "desc" },
  { label: "Plinth Area (Low to High)", value: "plinthArea", order: "asc" },
  { label: "Plinth Area (High to Low)", value: "plinthArea", order: "desc" },
  { label: "Date Added (Newest)", value: "createdAt", order: "desc" },
  { label: "Date Added (Oldest)", value: "createdAt", order: "asc" },
  { label: "Land Size (Low to High)", value: "landSize", order: "asc" },
  { label: "Land Size (High to Low)", value: "landSize", order: "desc" },
  { label: "Bedrooms (Low to High)", value: "bedrooms", order: "asc" },
  { label: "Bedrooms (High to Low)", value: "bedrooms", order: "desc" },
  { label: "Bathrooms (Low to High)", value: "bathrooms", order: "asc" },
  { label: "Bathrooms (High to Low)", value: "bathrooms", order: "desc" },
];

const statusOptions = [
  { label: "For Sale", value: "sale" },
  { label: "To Let", value: "let" },
];

interface SortingOptionsProps {
  currentSort: string;
  currentOrder: string;
  currentStatus: string;
  isActive: boolean;
  showStatusFilter?: boolean;
}

export default function SortingOptions({
  currentSort,
  currentOrder,
  currentStatus,
  isActive,
  showStatusFilter = false,
}: SortingOptionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [selectedSort, setSelectedSort] = useState(
    `${currentSort}-${currentOrder}`
  );
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setSelectedSort(`${currentSort}-${currentOrder}`);
    setSelectedStatus(currentStatus);
  }, [currentSort, currentOrder, currentStatus]);

  const handleSortChange = (value: string) => {
    const [sort, order] = value.split("-");
    setSelectedSort(value);

    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("sort", sort);
      params.set("order", order);
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);

    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("status", value);
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  if (!isActive) return null;

  return (
    <div className="mb-4 flex items-center space-x-4 relative z-10">
      <Select value={selectedSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem
              key={`${option.value}-${option.order}`}
              value={`${option.value}-${option.order}`}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showStatusFilter && (
        <Select value={selectedStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {isPending && <Loader2 className="animate-spin h-5 w-5 text-rose-500" />}
    </div>
  );
}

// "use client";

// import { useRouter, useSearchParams, usePathname } from "next/navigation";
// import { useState, useTransition, useEffect } from "react";
// import { Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { convertToKES, detectCurrency, sortPrices } from "@/lib/currency";

// const sortOptions = [
//   { label: "Price (Low to High)", value: "price", order: "asc" },
//   { label: "Price (High to Low)", value: "price", order: "desc" },
//   { label: "Plinth Area (Low to High)", value: "plinthArea", order: "asc" },
//   { label: "Plinth Area (High to Low)", value: "plinthArea", order: "desc" },
//   { label: "Date Added (Newest)", value: "createdAt", order: "desc" },
//   { label: "Date Added (Oldest)", value: "createdAt", order: "asc" },
//   { label: "Land Size (Low to High)", value: "landSize", order: "asc" },
//   { label: "Land Size (High to Low)", value: "landSize", order: "desc" },
//   { label: "Bedrooms (Low to High)", value: "bedrooms", order: "asc" },
//   { label: "Bedrooms (High to Low)", value: "bedrooms", order: "desc" },
//   { label: "Bathrooms (Low to High)", value: "bathrooms", order: "asc" },
//   { label: "Bathrooms (High to Low)", value: "bathrooms", order: "desc" },
// ];

// const statusOptions = [
//   { label: "For Sale", value: "sale" },
//   { label: "To Let", value: "let" },
// ];

// interface SortingOptionsProps {
//   currentSort: string;
//   currentOrder: string;
//   currentStatus: string;
//   isActive: boolean;
//   showStatusFilter?: boolean;
//   properties: Array<{ id: string; price: number; currency: "USD" | "KES" }>;
// }

// export default function SortingOptions({
//   currentSort,
//   currentOrder,
//   currentStatus,
//   isActive,
//   showStatusFilter = false,
//   properties,
// }: SortingOptionsProps) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const pathname = usePathname();
//   const [selectedSort, setSelectedSort] = useState(
//     `${currentSort}-${currentOrder}`
//   );
//   const [selectedStatus, setSelectedStatus] = useState(currentStatus);
//   const [isPending, startTransition] = useTransition();

//   useEffect(() => {
//     setSelectedSort(`${currentSort}-${currentOrder}`);
//     setSelectedStatus(currentStatus);
//   }, [currentSort, currentOrder, currentStatus]);

//   const handleSortChange = async (value: string) => {
//     const [sort, order] = value.split("-");
//     setSelectedSort(value);

//     startTransition(async () => {
//       const params = new URLSearchParams(searchParams);
//       params.set("sort", sort);
//       params.set("order", order);

//       if (sort === "price") {
//         // Convert all prices to KES and sort
//         const prices = properties.map((p) => p.price);
//         const currencies = properties.map((p) => p.currency);
//         const sortedPrices = await sortPrices(
//           prices,
//           currencies[0],
//           order as "asc" | "desc"
//         );

//         // Map sorted prices back to property IDs
//         const sortedPropertyIds = sortedPrices
//           .map((price) => properties.find((p) => p.price === price)?.id)
//           .filter(Boolean);

//         // Add sorted property IDs to URL params
//         params.set("sortedIds", sortedPropertyIds.join(","));
//       } else {
//         params.delete("sortedIds");
//       }

//       router.push(`${pathname}?${params.toString()}`);
//     });
//   };

//   const handleStatusChange = (value: string) => {
//     setSelectedStatus(value);

//     startTransition(() => {
//       const params = new URLSearchParams(searchParams);
//       params.set("status", value);
//       router.push(`${pathname}?${params.toString()}`);
//     });
//   };

//   if (!isActive) return null;

//   return (
//     <div className="mb-4 flex items-center space-x-4 relative z-10">
//       <Select value={selectedSort} onValueChange={handleSortChange}>
//         <SelectTrigger className="w-[200px]">
//           <SelectValue placeholder="Sort by" />
//         </SelectTrigger>
//         <SelectContent>
//           {sortOptions.map((option) => (
//             <SelectItem
//               key={`${option.value}-${option.order}`}
//               value={`${option.value}-${option.order}`}
//             >
//               {option.label}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//       {showStatusFilter && (
//         <Select value={selectedStatus} onValueChange={handleStatusChange}>
//           <SelectTrigger className="w-[150px]">
//             <SelectValue placeholder="Status" />
//           </SelectTrigger>
//           <SelectContent>
//             {statusOptions.map((option) => (
//               <SelectItem key={option.value} value={option.value}>
//                 {option.label}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       )}

//       {isPending && <Loader2 className="animate-spin h-5 w-5 text-rose-500" />}
//     </div>
//   );
// }
