import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { NextAuthConfig } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma";;
export default {
    secret: process.env.AUTH_SECRET || "randomkey",
    providers: [GoogleProvider({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
        allowDangerousEmailAccountLinking: true,
    }), CredentialsProvider({
        name: "Sign in",
        id: 'credentials',
        credentials: {
            email: {
                label: "Email",
                type: "email",
                placeholder: "john.doe@example.com"
            },
            password: { label: "Password", type: 'password' }
        },
        async authorize(credentials) {
            if (!credentials.email || !credentials.password) {
                throw new Error("Please enter email and password")

            }

            const user = await prisma.user.findUnique({
                where: {
                    email: credentials.email as string
                }
            });

            if (!user || !(await bcrypt.compare(String(credentials.password), user.password!))) {
                return null
            }

            return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                createdAt: user.createdAt,
                agentName: user.agentName || "",
                agentEmail: user.agentEmail || "",
                agentLocation: user.agentLocation || "",
                officeLine: user.officeLine || "",
                whatsappNumber: user.whatsappNumber || "",
                profilePhoto: user?.profilePhoto || "",
                phoneNumber: user?.phoneNumber || "",
                xLink: user?.xLink || "",
                tiktokLink: user?.tiktokLink || "",
                facebookLink: user?.facebookLink || "",
                linkedinLink: user?.linkedinLink || "",
                instagramLink: user?.instagramLink || "",
                address: user.address || "",
                postalCode: user.postalCode || "",
                bio: user.bio || "",
                favoriteIds: user.favoriteIds || [],
                randomKey: "Hey auth"
            }
        }
    })],
} satisfies NextAuthConfig