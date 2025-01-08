'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleUserBlock(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error("User not found")

    await prisma.user.update({
        where: { id: userId },
        data: { isActive: !user.isActive }
    })
    revalidatePath('/dashboard/users')
}

export async function suspendUser(userId: string, suspensionEndDate: Date) {
    await prisma.user.update({
        where: { id: userId },
        data: {
            isActive: false,
            suspensionEndDate: suspensionEndDate
        }
    })
    revalidatePath('/dashboard/users')
}

export async function unsuspendUser(userId: string) {
    await prisma.user.update({
        where: { id: userId },
        data: {
            isActive: true,
            suspensionEndDate: null
        }
    })
    revalidatePath('/dashboard/users')
}

