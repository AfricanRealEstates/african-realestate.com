import { Icons } from "@/components/globals/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { MainNavItem } from "@/types/types";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface MainNavProps {
  items?: MainNavItem[];
}

export default function MainNav({ items }: MainNavProps) {
  return (
    <section className="hidden gap-6 lg:flex">
      <NavigationMenu>
        <NavigationMenuList>
          {items?.[0]?.items ? (
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-auto">
                {items[0].title}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr,1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        href="/"
                        className="flex size-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          African Real Estate
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                            
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : null}
        </NavigationMenuList>
      </NavigationMenu>
    </section>
  );
}
