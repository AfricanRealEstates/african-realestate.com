
import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        await prisma.$connect()
        const result = await prisma.$queryRaw`SELECT 1 as connected`
        await prisma.$disconnect()
        res.status(200).json({ message: 'Database connection successful', result })
    } catch (error: any) {
        console.error('Database connection failed:', error)
        res.status(500).json({ message: 'Database connection failed', error: error.message })
    }
}