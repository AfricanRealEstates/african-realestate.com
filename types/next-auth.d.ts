import NextAuth from "next-auth";
import { UserRole } from "@prisma/client";
// import type { User } from "next-auth";
import "next-auth/jwt";
import { DefaultSession } from "next-auth";
type UserId = string;

declare module "next-auth/jwt" {
    interface JWT {
        id: UserId;
        role: UserRole;
        agentName: string
        agentEmail: string
        officeLine: string
        whatsappNumber: string
        address: string
        postalCode: string
        bio: string
        permissions: string[];
    }
}

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    // interface Session {
    //     user: User & {
    //         id: UserId;
    //         role: UserRole;
    //         permissions: string[];
    //     };
    // }

    interface Session {
        user: User & DefaultSession['user']
    }
}

declare module "next-auth" {
    interface User {
        role: UserRole,
        agentName: string,
        agentEmail: string,
        officeLine: string,
        whatsappNumber: string
        address: string
        postalCode: string
        bio: string

    }
}