'use server'

import { prisma } from '@/lib/prisma'
import { addDays } from 'date-fns'
import { generateDiscountCode } from './generateDiscount'

export interface User {
    id?: string
    email: string | null
}

export interface DiscountSummary {
    totalCreated: number
    aboutToExpire: number
    expired: number
}

export interface Discount {
    id: string
    code: string
    percentage: number
    expirationDate: Date
    user: User
}

export async function searchUsers(query: string): Promise<User[]> {
    return await prisma.user.findMany({
        where: {
            email: {
                contains: query,
                mode: 'insensitive',
            },
        },
        select: {
            id: true,
            email: true,
        },
    })
}

export async function createDiscount({
    userId,
    percentage,
    expirationDate,
}: {
    userId: string
    percentage: number
    expirationDate: Date
}) {
    const code = generateDiscountCode()

    return await prisma.discount.create({
        data: {
            code,
            percentage,
            expirationDate,
            userId,
        },
    })
}

export async function getDiscountSummary(): Promise<DiscountSummary> {
    const now = new Date()
    const sevenDaysFromNow = addDays(now, 7)

    const [totalCreated, aboutToExpire, expired] = await Promise.all([
        prisma.discount.count(),
        prisma.discount.count({
            where: {
                expirationDate: {
                    gt: now,
                    lte: sevenDaysFromNow,
                },
            },
        }),
        prisma.discount.count({
            where: {
                expirationDate: {
                    lte: now,
                },
            },
        }),
    ])

    return {
        totalCreated,
        aboutToExpire,
        expired,
    }
}

export async function getDiscounts(page: number, pageSize: number, filter: string) {
    const now = new Date()
    const sevenDaysFromNow = addDays(now, 7)

    let whereClause = {}

    switch (filter) {
        case 'active':
            whereClause = { expirationDate: { gt: now } }
            break
        case 'expiring':
            whereClause = { expirationDate: { gt: now, lte: sevenDaysFromNow } }
            break
        case 'expired':
            whereClause = { expirationDate: { lte: now } }
            break
    }

    const [discounts, totalCount] = await Promise.all([
        prisma.discount.findMany({
            where: whereClause,
            include: { user: { select: { email: true } } },
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.discount.count({ where: whereClause }),
    ])

    return {
        discounts,
        totalPages: Math.ceil(totalCount / pageSize),
    }
}

export async function revokeDiscount(discountId: string) {
    await prisma.discount.update({
        where: { id: discountId },
        data: { expirationDate: new Date() },
    })
}

