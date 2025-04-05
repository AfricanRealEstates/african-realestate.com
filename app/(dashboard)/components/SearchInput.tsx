"use client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
export default function SearchInput({
  search,
  searchType,
}: {
  search?: string;
  searchType: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
  const isSearching = timeoutId || isPending;
  return (
    <div className="relative rounded-md shadow-sm">
      {/* <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon
          className="size-5 text-gray-500"
          aria-hidden="true"
        />
      </div> */}
      <input
        type="text"
        placeholder={`Search ${searchType}`}
        name="search"
        id="search"
        defaultValue={search}
        onChange={(event) => {
          clearTimeout(timeoutId);
          const id = setTimeout(() => {
            startTransition(() => {
              if (event.target.value) {
                router.push(
                  `/dashboard/${searchType}/?search=${event.target.value}`
                );
              } else {
                router.push(`/dashboard/${searchType}/`);
              }
              setTimeoutId(undefined);
            });
          }, 500);
          setTimeoutId(id);
        }}
        className="placeholder:text-xs bg-gray-50 ring-1 ring-gray-300 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
      />
      {isSearching && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <Loader2
            className="size-5 animate-spin text-gray-400"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
