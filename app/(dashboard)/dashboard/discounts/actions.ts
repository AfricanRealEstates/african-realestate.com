'use server'

import { addDays, startOfMonth, endOfMonth } from 'date-fns'
import { generateDiscountCode } from './generateDiscount'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

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
    startDate: Date
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
    startDate,
    expirationDate,
    customCode,
}: {
    userIds: (string | null)[]
    percentage: number
    startDate: Date
    expirationDate: Date
    customCode?: string
}) {
    const code = customCode || generateDiscountCode()

    try {
        const discount = await prisma.discount.create({
            data: {
                code,
                percentage,
                startDate,
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

export async function editDiscount(discountId: string, data: {
    userIds: string[];
    percentage: number;
    startDate: Date;
    expirationDate: Date;
    customCode?: string;
}) {
    try {
        // Find the existing discount
        const existingDiscount = await prisma.discount.findUnique({
            where: { id: discountId },
            include: { users: true }
        });

        if (!existingDiscount) {
            throw new Error('Discount not found');
        }

        // Update the discount
        const updatedDiscount = await prisma.discount.update({
            where: { id: discountId },
            data: {
                code: data.customCode || existingDiscount.code, // Use existing code if no new code provided
                percentage: data.percentage,
                startDate: data.startDate,
                expirationDate: data.expirationDate,
                users: {
                    disconnect: existingDiscount.users.map(user => ({ id: user.id })),
                    connect: data.userIds.map(id => ({ id }))
                }
            },
            include: { users: true }
        });

        // Revalidate the discounts page to reflect the changes
        revalidatePath('/discounts');

        return {
            success: true,
            message: 'Discount updated successfully',
            discount: updatedDiscount
        };
    } catch (error) {
        console.error('Error updating discount:', error);
        return {
            success: false,
            message: 'Failed to update discount',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
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

export async function getAllAgencyAndAgentUsers(): Promise<User[]> {
    return await prisma.user.findMany({
        where: {
            OR: [
                { role: 'AGENCY' },
                { role: 'AGENT' }
            ]
        },
        select: {
            id: true,
            email: true,
        },
    })
}

export async function getNewSignups(startDate: Date, endDate: Date): Promise<User[]> {
    return await prisma.user.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate,
            }
        },
        select: {
            id: true,
            email: true,
        },
    })
}

