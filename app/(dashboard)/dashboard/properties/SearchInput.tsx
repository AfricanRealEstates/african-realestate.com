"use client";

import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchInput({
  search,
  searchType,
}: {
  search?: string;
  searchType: "properties"; // extend this if needed
}) {
  const [value, setValue] = useState(search || "");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setValue(search || "");
  }, [search]);

  const handleSearch = useDebouncedCallback((val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("search", val);
    } else {
      params.delete("search");
    }
    router.replace(`/dashboard/${searchType}?${params.toString()}`);
  }, 300);

  return (
    <Input
      placeholder="Search by property number, title, or owner"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        handleSearch(e.target.value);
      }}
    />
  );
}
