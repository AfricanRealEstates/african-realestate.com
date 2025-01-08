'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Discount } from "@prisma/client"


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

export async function getUserDiscounts(): Promise<{ success: boolean; discounts?: Discount[]; message?: string }> {
    const session = await auth()
    if (!session || !session.user) {
        return { success: false, message: "User not authenticated" }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                discounts: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!user) {
            return { success: false, message: "User not found" }
        }

        return { success: true, discounts: user.discounts }
    } catch (error) {
        console.error('Error fetching user discounts:', error);
        return { success: false, message: "Failed to fetch discounts" }
    }
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

function getFilterCondition(filter: string) {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    switch (filter) {
        case 'active':
            return { expirationDate: { gt: now } };
        case 'expiring':
            return { expirationDate: { gt: now, lte: sevenDaysFromNow } };
        case 'expired':
            return { expirationDate: { lte: now } };
        default:
            return {};
    }
}