import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const result = await prisma.$queryRaw`SELECT 1 as connected`
        return NextResponse.json({ message: 'Database connection successful', result })
    } catch (error: any) {
        console.error('Database connection failed:', error)
        return NextResponse.json(
            { message: 'Database connection failed', error: error.message },
            { status: 500 }
        )
    }
}

