import React from "react";
import Logo from "./logo";
import NavLinks from "./nav-links";

export default function SideNav() {
  return (
    <aside className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="rounded-md border-t -ml-3 md:ml-0 bg-neutral-50 h-16 justify-evenly fixed z-50 flex-1 w-full md:relative md:h-full bottom-0 md:border-none flex flex-row md:justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2 p-2">
        <Logo />
        <NavLinks />
      </div>
    </aside>
  );
}
