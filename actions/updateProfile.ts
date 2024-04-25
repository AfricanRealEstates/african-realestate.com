"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { updateUserSchema, UpdateUserInput } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function updateProfile(values: UpdateUserInput) {
    const session = await auth();

    const userId = session?.user.id

    if (!userId) {
        throw Error('Unauthorized')
    }
    const { agentName, agentEmail, officeLine, whatsappNumber, address, postalCode, bio } = updateUserSchema.parse(values)

    await prisma.user.update({
        where: { id: userId },
        data: {
            agentName,
            agentEmail,
            officeLine,
            whatsappNumber,
            address,
            postalCode,
            bio,
        }
    })

    revalidatePath("/dashboard/account")
}