import { Icons } from "@/components/globals/icons";
import { UserRole } from "@prisma/client";

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