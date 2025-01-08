'use server'

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function deleteProperty(propertyId: string) {
    const user = await auth();

    if (!user) {
        throw new Error("You must be logged in to delete a property.");
    }

    const property = await prisma.property.findUnique({
        where: { id: propertyId },
    });

    if (!property) {
        throw new Error("Property not found.");
    }

    if (property.userId !== user.user.id) {
        throw new Error("You do not have permission to delete this property.");
    }

    await prisma.property.delete({
        where: { id: propertyId },
    });

    return { success: true };
}

