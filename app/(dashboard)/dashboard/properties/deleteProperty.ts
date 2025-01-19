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

    try {
        // Use a transaction to ensure all operations succeed or fail together
        await prisma.$transaction(async (tx) => {
            // Delete all associated PropertyView records
            await tx.propertyView.deleteMany({
                where: {
                    propertyId: propertyId,
                },
            });

            // Delete all associated Order records
            await tx.order.deleteMany({
                where: {
                    propertyId: propertyId,
                },
            });

            // Delete the property
            await tx.property.delete({
                where: { id: propertyId },
            });
        });

        return { success: true };
    } catch (error:any) {
        console.error("Error deleting property:", error);
        if (error.code === 'P2003') {
            throw new Error("Unable to delete property due to existing references. Please remove all associated data first.");
        }
        throw new Error("Failed to delete the property. Please try again later.");
    }
}

