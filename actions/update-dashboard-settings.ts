"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { updateUserSchema } from "@/lib/validation"
import { revalidatePath } from "next/cache"

export type FormData = {
    agentName: string
    agentEmail: string
    address: string
    bio: string
    postalCode: string
    whatsappNumber: string
    officeLine: string
}

export async function updateDashboardSettings(userId: string, data: FormData) {
    try {
        const session = await auth();

        if (!session?.user || session?.user.id !== userId) {
            throw new Error('Unauthorized')
        }

        const { agentName,
            agentEmail,
            address,
            bio,
            postalCode,
            whatsappNumber,
            officeLine, } = updateUserSchema.parse(data)

        // Update profile data
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                agentName,
                agentEmail,
                address,
                bio,
                postalCode,
                whatsappNumber,
                officeLine
            }
        })

        revalidatePath('/dashboard/account');
        return { status: "success" }
    } catch (error) {
        return { status: "error" }
    }
}