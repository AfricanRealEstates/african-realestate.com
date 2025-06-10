import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { Adapter } from "next-auth/adapters";
import authConfig from "@/auth.config";
import { NextResponse } from "next/server";

export const {
  handlers,
  signIn,
  signOut,
  auth,
  unstable_update: update,
} = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: "jwt", maxAge: 1 * 60 * 60 }, // Set to 1 hour
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      // if (existingUser.isTwoFactorEnabled) {
      //   const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({
      //     where: { userId: existingUser.id },
      //   })

      //   if (!twoFactorConfirmation) return false

      //   // Delete two factor confirmation for next sign in
      //   await prisma.twoFactorConfirmation.delete({
      //     where: { id: twoFactorConfirmation.id },
      //   })
      // }

      // For social logins (Google), check if the user is active
      if (account?.provider) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: { isActive: true, suspensionEndDate: true },
        });

        // If user exists and is not active, prevent sign in
        if (dbUser && !dbUser.isActive) {
          return false;
        }
      }
      return true;
    },

    authorized({ auth, request: { nextUrl } }) {
      const { pathname, search } = nextUrl;
      const isLoggedIn = !!auth?.user;
      const isOnAuthPage =
        pathname.startsWith("/login") || pathname.startsWith("/register");

      const unprotectedPages = [
        "/about",
        "/blog",
        "/buy",
        "/let",
        "/contact",
        "/faqs",
        "/properties",
      ];
      const isOnUnprotectedPage =
        pathname === "/" ||
        unprotectedPages.some((page) => pathname.startsWith(page));
      const isProtectedPage = !isOnUnprotectedPage;

      // Check if the user was created in the last 10 seconds
      const createdAt = auth?.user?.createdAt;
      const isNewUser =
        createdAt && new Date(createdAt).getTime() > Date.now() - 10000;

      if (isLoggedIn && isNewUser && pathname !== "/welcome") {
        // Redirect new users to welcome page
        return NextResponse.redirect(new URL("/welcome", nextUrl));
      }

      if (isOnAuthPage) {
        // Redirect to the previous page (or to /dashboard if no previous page) if the user is logged in
        const callbackUrl = nextUrl.searchParams.get("callbackUrl") || "/";
        if (isLoggedIn)
          return NextResponse.redirect(new URL(callbackUrl, nextUrl));
      } else if (isProtectedPage) {
        // Redirect to /login if not logged in but on a protected page
        if (!isLoggedIn) {
          const callbackUrl = encodeURIComponent(pathname + search);
          return NextResponse.redirect(
            new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl)
          );
        }
      }
      // Don't redirect if on an unprotected page or if logged in and on a protected page
      return true;
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        // Fetch fresh user data from database to ensure we have the latest profilePhoto
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            id: true,
            name: true,
            email: true,
            profilePhoto: true,
            role: true,
            createdAt: true,
            agentName: true,
            agentEmail: true,
            agentLocation: true,
            officeLine: true,
            whatsappNumber: true,
            phoneNumber: true,
            address: true,
            postalCode: true,
            bio: true,
            xLink: true,
            tiktokLink: true,
            instagramLink: true,
            facebookLink: true,
            linkedinLink: true,
            favoriteIds: true,
            isActive: true,
          },
        });

        if (dbUser) {
          return {
            ...session,
            user: {
              ...session.user,
              id: dbUser.id,
              name: dbUser.name,
              email: dbUser.email,
              image: dbUser.profilePhoto || session.user.image, // Use profilePhoto as primary image
              profilePhoto: dbUser.profilePhoto,
              role: dbUser.role,
              createdAt: dbUser.createdAt,
              agentName: dbUser.agentName || "",
              agentEmail: dbUser.agentEmail || "",
              agentLocation: dbUser.agentLocation || "",
              officeLine: dbUser.officeLine || "",
              whatsappNumber: dbUser.whatsappNumber || "",
              phoneNumber: dbUser.phoneNumber || "",
              address: dbUser.address || "",
              postalCode: dbUser.postalCode || "",
              bio: dbUser.bio || "",
              xLink: dbUser.xLink || "",
              tiktokLink: dbUser.tiktokLink || "",
              instagramLink: dbUser.instagramLink || "",
              facebookLink: dbUser.facebookLink || "",
              linkedinLink: dbUser.linkedinLink || "",
              favoriteIds: dbUser.favoriteIds || [],
              isActive: dbUser.isActive,
              randomKey: token.randomKey,
            },
          };
        }
      }

      // Fallback to token data if database query fails
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          name: token.name,
          image: token.profilePhoto || token.picture,
          profilePhoto: token.profilePhoto,
          role: token.role,
          createdAt: token.createdAt,
          agentName: token.agentName || "",
          agentEmail: token.agentEmail || "",
          agentLocation: token.agentLocation || "",
          officeLine: token.officeLine || "",
          whatsappNumber: token.whatsappNumber || "",
          phoneNumber: token.phoneNumber || "",
          address: token.address || "",
          postalCode: token.postalCode || "",
          bio: token.bio || "",
          xLink: token.xLink || "",
          tiktokLink: token.tiktokLink || "",
          instagramLink: token.instagramLink || "",
          facebookLink: token.facebookLink || "",
          linkedinLink: token.linkedinLink || "",
          favoriteIds: token.favoriteIds || [],
          randomKey: token.randomKey,
        },
      };
    },

    async jwt({ token, user, trigger, session }) {
      // Handle profile updates
      if (trigger === "update" && session) {
        // Fetch fresh user data when profile is updated
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            id: true,
            name: true,
            email: true,
            profilePhoto: true,
            role: true,
            createdAt: true,
            agentName: true,
            agentEmail: true,
            agentLocation: true,
            officeLine: true,
            whatsappNumber: true,
            phoneNumber: true,
            address: true,
            postalCode: true,
            bio: true,
            xLink: true,
            tiktokLink: true,
            instagramLink: true,
            facebookLink: true,
            linkedinLink: true,
            favoriteIds: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.profilePhoto = dbUser.profilePhoto;
          token.role = dbUser.role;
          token.createdAt = dbUser.createdAt;
          token.agentName = dbUser.agentName!;
          token.agentEmail = dbUser.agentEmail!;
          token.agentLocation = dbUser.agentLocation;
          token.officeLine = dbUser.officeLine!;
          token.whatsappNumber = dbUser.whatsappNumber!;
          token.phoneNumber = dbUser.phoneNumber;
          token.address = dbUser.address!;
          token.postalCode = dbUser.postalCode!;
          token.bio = dbUser.bio!;
          token.xLink = dbUser.xLink!;
          token.tiktokLink = dbUser.tiktokLink!;
          token.instagramLink = dbUser.instagramLink!;
          token.facebookLink = dbUser.facebookLink!;
          token.linkedinLink = dbUser.linkedinLink!;
          token.favoriteIds = dbUser.favoriteIds;
        }
      }

      // Initial sign in
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          createdAt: u.createdAt,
          agentName: u.agentName,
          agentEmail: u.agentEmail || "",
          agentLocation: u.agentLocation || "",
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
          favoriteIds: u.favoriteIds || [],
          randomKey: u.randomKey || "Hey auth",
        };
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Add error page to handle auth errors
  },
  ...authConfig,
});
