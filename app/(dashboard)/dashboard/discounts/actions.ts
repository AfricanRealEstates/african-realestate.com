'use server'

import { addDays } from 'date-fns'
import { generateDiscountCode } from './generateDiscount'
import { prisma } from '@/lib/prisma'

export interface User {
    id: string | null
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
    users: User[]
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
    userIds,
    percentage,
    expirationDate,
}: {
    userIds: (string | null)[]
    percentage: number
    expirationDate: Date
}) {
    const code = generateDiscountCode()

    try {
        const discount = await prisma.discount.create({
            data: {
                code,
                percentage,
                expirationDate,
                users: {
                    connect: userIds.filter((id): id is string => id !== null).map(id => ({ id }))
                }
            },
            include: {
                users: {
                    select: {
                        id: true,
                        email: true
                    }
                }
            }
        })

        return discount
    } catch (error) {
        console.error("Error creating discount:", error)
        throw new Error("Failed to create discount code")
    }
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
        case 'revoked':
            whereClause = { expirationDate: { lte: now } }
            break
    }

    const [discounts, totalCount] = await Promise.all([
        prisma.discount.findMany({
            where: whereClause,
            include: { users: { select: { id: true, email: true } } },
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

export async function deleteRevokedDiscount(discountId: string) {
    await prisma.discount.delete({
        where: { id: discountId, expirationDate: { lte: new Date() } },
    })
}

