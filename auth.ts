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
    session: { strategy: "jwt" },
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

            if (isOnAuthPage) {
                // Redirect to /dashboard/settings, if logged in and is on an auth page
                if (isLoggedIn) return NextResponse.redirect(new URL("/dashboard", nextUrl));

            } else if (isProtectedPage) {
                // Redirect to /login,if not logged in but is on a protected page
                if (!isLoggedIn) {
                    const from = encodeURIComponent(pathname + search); // The /login page shall use this from param as a callbackUrl upon successful sign in
                    return NextResponse.redirect(new URL(`/login?from=${from}`, nextUrl))
                }
            }
            // Don't redirect if on an unprotected page, or if logged in and is on a proteected page
            return true
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
                    agentName: token.agentName || "",
                    agentEmail: token.agentEmail || "",
                    officeLine: token.officeLine || "",
                    whatsappNumber: token.whatsappNumber || "",
                    address: token.address || "",
                    postalCode: token.postalCode || "",
                    profilePhoto: token.profilePhoto || "",
                    phoneNumber: token.phoneNumber || "",
                    xLink: token.xLink || "",
                    tiktokLink: token.tiktokLink || "",
                    facebookLink: token.facebookLink || "",
                    linkedinLink: token.linkedinLink || "",
                    instagramLink: token.instagramLink || "",
                    bio: token.bio || "",
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

