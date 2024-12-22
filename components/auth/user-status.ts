'use server'


import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function getUserStatus() {
    const session = await auth()

    if (!session || !session.user?.email) {
        throw new Error("Not authenticated")
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { isActive: true, suspensionEndDate: true }
    })

    if (!user) {
        throw new Error("User not found")
    }

    return user
}

