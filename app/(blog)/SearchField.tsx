"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SearchField() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSearch = (searchTerm: string) => {
    const param = new URLSearchParams(searchParams);
    if (searchParams) {
      param.set("search", searchTerm);
    } else {
      param.delete("search");
    }

    router.replace(`${pathname}?${param.toString()}`);
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form>
      <div className="relative">
        <Input
          name="search"
          id="search"
          type="text"
          defaultValue={searchParams.get("search")?.toString()}
          placeholder="Search"
          onChange={(e) => handleSearch(e.target.value)}
          className="pe-10 border border-stone-300 placeholder:text-stone-400"
        />
        <SearchIcon className="text-gray-500 absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
}
