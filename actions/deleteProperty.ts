'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function deleteProperty(formData: FormData) {
    const propertyId = formData.get('propertyId') as string

    if (!propertyId) {
        throw new Error('Property ID is required')
    }

    await prisma.property.delete({
        where: { id: propertyId },
    })

    revalidatePath('/dashboard')
}