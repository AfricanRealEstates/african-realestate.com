'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"


export async function getUserDiscount() {
    const session = await auth()
    if (!session || !session.user) {
        return { percentage: null, code: null }
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { discounts: true }
    })

    if (!user || user.discounts.length === 0) {
        return { percentage: null, code: null }
    }

    // Get the most recent active discount
    const now = new Date()
    const activeDiscount = user.discounts
        .filter(d => d.startDate <= now && d.expirationDate >= now)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]

    return activeDiscount
        ? { percentage: activeDiscount.percentage, code: activeDiscount.code }
        : { percentage: null, code: null }
}

export async function applyDiscountCode(code: string): Promise<{ success: boolean; message?: string; percentage: number | null }> {
    const session = await auth()
    if (!session || !session.user) {
        return { success: false, message: "User not authenticated", percentage: null }
    }

    const discount = await prisma.discount.findUnique({
        where: { code }
    })

    if (!discount) {
        return { success: false, message: "Invalid discount code", percentage: null }
    }

    const now = new Date()
    if (discount.startDate > now || discount.expirationDate < now) {
        return { success: false, message: "Discount code is not active", percentage: null }
    }

    // Add the discount to the user
    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            discounts: {
                connect: { id: discount.id }
            }
        }
    })

    return { success: true, percentage: discount.percentage }
}

