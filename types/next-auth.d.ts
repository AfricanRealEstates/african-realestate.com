// import NextAuth from "next-auth";
// import { UserRole } from "@prisma/client";
// // import type { User } from "next-auth";
// import "next-auth/jwt";
// import { DefaultSession } from "next-auth";
// type UserId = string;

// declare module "next-auth/jwt" {
//     interface JWT {
//         id: UserId;
//         role: UserRole;
//         createdAt: Date,
//         agentName: string
//         agentEmail: string
//         officeLine: string
//         whatsappNumber: string
//         address: string
//         postalCode: string
//         bio: string
//         xLink: string
//         tiktokLink: string,
//         instagramLink: string
//         facebookLink: string
//         permissions: string[];
//         favoriteIds: string[]
//     }
// }

// declare module "next-auth" {
//     /**
//      * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
//      */
//     // interface Session {
//     //     user: User & {
//     //         id: UserId;
//     //         role: UserRole;
//     //         permissions: string[];
//     //     };
//     // }

//     interface Session {
//         user: User & DefaultSession['user']
//     }
// }

// declare module "next-auth" {
//     interface User {
//         role: UserRole,
//         createdAt: Date,
//         agentName: string,
//         agentEmail: string,
//         agentLocation: string,
//         officeLine: string,
//         whatsappNumber: string
//         profilePhoto: string,
//         phoneNumber: string,
//         xLink: string,
//         tiktokLink: string,
//         facebookLink: string,
//         linkedinLink: string,
//         instagramLink: string,
//         address: string
//         postalCode: string
//         bio: string
//         favoriteIds: string[]

//     }
// }

import type { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import type { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      profilePhoto?: string | null;
      role?: UserRole;
      createdAt?: Date;
      agentName?: string | null;
      agentEmail?: string | null;
      agentLocation?: string | null;
      officeLine?: string | null;
      whatsappNumber?: string | null;
      phoneNumber?: string | null;
      address?: string | null;
      postalCode?: string | null;
      bio?: string | null;
      xLink?: string | null;
      tiktokLink?: string | null;
      instagramLink?: string | null;
      facebookLink?: string | null;
      linkedinLink?: string | null;
      favoriteIds?: string[];
      isActive?: boolean;
      randomKey?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    profilePhoto?: string | null;
    role?: UserRole;
    createdAt?: Date;
    agentName?: string | null;
    agentEmail?: string | null;
    agentLocation?: string | null;
    officeLine?: string | null;
    whatsappNumber?: string | null;
    phoneNumber?: string | null;
    address?: string | null;
    postalCode?: string | null;
    bio?: string | null;
    xLink?: string | null;
    tiktokLink?: string | null;
    instagramLink?: string | null;
    facebookLink?: string | null;
    linkedinLink?: string | null;
    favoriteIds?: string[];
    isActive?: boolean;
    randomKey?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    profilePhoto?: string | null;
    role?: UserRole;
    createdAt?: Date;
    agentName?: string | null;
    agentEmail?: string | null;
    agentLocation?: string | null;
    officeLine?: string | null;
    whatsappNumber?: string | null;
    phoneNumber?: string | null;
    address?: string | null;
    postalCode?: string | null;
    bio?: string | null;
    xLink?: string | null;
    tiktokLink?: string | null;
    instagramLink?: string | null;
    facebookLink?: string | null;
    linkedinLink?: string | null;
    favoriteIds?: string[];
    randomKey?: string;
  }
}
