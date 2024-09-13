import Google from 'next-auth/providers/google';
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import { Adapter } from "next-auth/adapters"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import authConfig from "@/auth.config"
import { NextResponse } from 'next/server';


export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    adapter: PrismaAdapter(prisma) as Adapter,
    session: { strategy: "jwt", maxAge: 1 * 60 * 60 },  // Set to 1 hours
    callbacks: {

        authorized({ auth, request: { nextUrl } }) {
            // const isLoggedIn = !!auth?.user
            // const paths = ['/dashboard', "/admin"];
            // const isProtected = paths.some((path) => nextUrl.pathname.startsWith(path))

            // if (isProtected && !isLoggedIn) {
            //     const redirectUrl = new URL('/api/auth/signin', nextUrl.origin);
            //     redirectUrl.searchParams.append('callbackUrl', nextUrl.href)
            //     return Response.redirect(redirectUrl)
            // }

            const { pathname, search } = nextUrl;
            const isLoggedIn = !!auth?.user
            const isOnAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')

            const unprotectedPages = ['/about', '/blog', '/buy', '/let', '/contact', "/faqs", "/properties"]
            const isOnUnprotectedPage = pathname === '/' || unprotectedPages.some((page) => pathname.startsWith(page));
            const isProtectedPage = !isOnUnprotectedPage

            // Check if the user was created in the last 10 seconds
            const createdAt = auth?.user?.createdAt;
            const isNewUser = createdAt && new Date(createdAt).getTime() > Date.now() - 10000;

            if (isLoggedIn && isNewUser && pathname !== "/welcome") {
                // Redirect new users to welcome page
                return NextResponse.redirect(new URL("/welcome", nextUrl));
            }

            if (isOnAuthPage) {
                // Redirect to the previous page (or to /dashboard if no previous page) if the user is logged in
                const redirectTo = nextUrl.searchParams.get("from") || "/";
                if (isLoggedIn) return NextResponse.redirect(new URL(redirectTo, nextUrl));
            } else if (isProtectedPage) {
                // Redirect to /login if not logged in but on a protected page
                if (!isLoggedIn) {
                    const from = encodeURIComponent(pathname + search); // Capture the current page URL
                    return NextResponse.redirect(new URL(`/login?from=${from}`, nextUrl));
                }
            }
            // Don't redirect if on an unprotected page or if logged in and on a protected page
            return true;

        },
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    name: token.name,
                    image: token.picture,
                    role: token.role,
                    createdAt: token.createdAt,
                    agentName: token.agentName || "",
                    agentEmail: token.agentEmail || "",
                    officeLine: token.officeLine || "",
                    whatsappNumber: token.whatsappNumber || "",
                    address: token.address || "",
                    postalCode: token.postalCode || "",
                    bio: token.bio || "",
                    xLink: token.xLink || "",
                    tiktokLink: token.tiktokLink || "",
                    instagramLink: token.instagramLink || "",
                    facebookLink: token.facebookLink || "",
                    favoriteIds: token.favoriteIds || [],

                    randomKey: token.randomKey


                }
            }
        },
        jwt: ({ token, user }) => {
            if (user) {
                const u = user as unknown as any;
                return {
                    ...token,
                    id: u.id,
                    name: u.name,
                    role: u.role,
                    createdAt: u.createdAt,
                    agentName: u.agentName,
                    agentEmail: u.agentEmail || "",
                    officeLine: u.officeLine || "",
                    whatsappNumber: u.whatsappNumber || "",
                    profilePhoto: u.profilePhoto || "",
                    phoneNumber: u.phoneNumber || "",
                    xLink: u.xLink || "",
                    tiktokLink: u.tiktokLink || "",
                    facebookLink: u.facebookLink || "",
                    linkedinLink: u.linkedinLink || "",
                    instagramLink: u.instagramLink || "",
                    address: u.address || "",
                    postalCode: u.postalCode || "",
                    bio: u.bio || "",
                    favoriteIds: token.favoriteIds || [],
                    randomKey: u.randomKey
                }
            }
            return token;
        }
    },
    pages: {
        signIn: '/login',
    },
    ...authConfig,
})

