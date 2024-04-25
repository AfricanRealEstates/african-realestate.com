import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import React, { Dispatch, SetStateAction } from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "../utils/Button";

interface HeaderProps {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  const session = useSession();
  const user = session.data?.user;
  return (
    <div className="xl:pl-72">
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-white xl:hidden hover:bg-gray-700 rounded-full"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="size-6" aria-hidden="true" />
        </button>

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <form className="flex flex-1" action="#" method="GET">
            <label htmlFor="search-field" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <MagnifyingGlassIcon
                className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-50"
                aria-hidden="true"
              />
              <input
                id="search-field"
                className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-white focus:ring-0 sm:text-sm"
                placeholder="Search..."
                type="search"
                name="search"
              />
            </div>
          </form>
        </div>
        <Button color="white" onClick={() => signOut()}>
          Logout
        </Button>
      </header>
    </div>
  );
}
