
import { prisma } from './prisma'

export async function getNextPropertyNumber(): Promise<number> {
    const sequence = await prisma.propertyNumberSequence.findUnique({
        where: { id: 1 },
    })

    if (!sequence) {
        // Initialize the sequence if it doesn't exist
        await prisma.propertyNumberSequence.create({
            data: { id: 1, seq: 7000 },
        })
        return 7000
    }

    const nextNumber = sequence.seq + 1

    await prisma.propertyNumberSequence.update({
        where: { id: 1 },
        data: { seq: nextNumber },
    })

    return nextNumber
}

