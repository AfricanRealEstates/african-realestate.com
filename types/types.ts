import { Icons } from "@/components/globals/icons";
import { UserRole } from "@prisma/client";
import type { Route as NextRoute } from "next";
import { ComponentType } from "react";

export type RegisterInputProps = {
    fullName: string;
    role: UserRole;
    email: string;
    password: string;
}

export type LoginInputProps = {
    email: string;
    password: string
}
export type NavItem = {
    title: string
    href?: string
    disabled?: boolean
    external?: boolean
    icon?: keyof typeof Icons
    label?: string
    description?: string
}

export interface NavItemWithChildren extends NavItem {
    items: NavItemWithChildren[]
}

export interface NavItemWithOptionalChildren extends NavItem {
    items?: NavItemWithChildren[]
}

export type MainNavItem = NavItemWithOptionalChildren

export type SidebarNavItem = NavItemWithChildren

export interface SearchParams {
    [key: string]: string | string[] | undefined
}

// Get ready to update to nextjs version 13.2 with X typedRoutes
export type Route<T = string> = NextRoute;
export type PathName = Route;

export interface Page {
    path: PathName;
    exact?: boolean;
    component: ComponentType<Object>;
}

export type TwMainColor =
    | "pink"
    | "green"
    | "yellow"
    | "red"
    | "indigo"
    | "blue"
    | "purple"
    | "gray";