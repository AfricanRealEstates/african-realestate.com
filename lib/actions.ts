"use server";

import { revalidatePath } from "next/cache";
import prisma from "./prisma";
import { getUserId } from "./utils";
import { BookmarkSchema, LikeSchema } from "./validation";

export async function likeProperty(value: FormDataEntryValue | null) {
    const userId = await getUserId();

    const validatedFields = LikeSchema.safeParse({ propertyId: value });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Like Property.",
        };
    }

    const { propertyId } = validatedFields.data;

    const property = await prisma.property.findUnique({
        where: {
            id: propertyId,
        },
    });

    if (!property) {
        throw new Error("Property not found");
    }

    const like = await prisma.like.findUnique({
        where: {
            propertyId_userId: {
                propertyId,
                userId,
            },
        },
    });

    if (like) {
        try {
            await prisma.like.delete({
                where: {
                    propertyId_userId: {
                        propertyId,
                        userId,
                    },
                },
            });
            // Revalidate the correct path
            const path = `/properties/${property.propertyDetails}/${propertyId}`;
            revalidatePath(path);
            return { message: "Unliked Property." };
        } catch (error) {
            return { message: "Database Error: Failed to Unlike Property" };
        }
    }

    try {
        await prisma.like.create({
            data: {
                propertyId,
                userId,
            },
        });
        // Revalidate the correct path
        const path = `/properties/${property.propertyDetails}/${propertyId}`;
        revalidatePath(path);
        return { message: "Liked Property." };
    } catch (error) {
        return { message: "Database Error: Failed to Like Property." };
    }
}


export async function bookmarkProperty(value: FormDataEntryValue | null) {
    const userId = await getUserId();

    const validatedFields = BookmarkSchema.safeParse({ propertyId: value });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Bookmark Property.",
        };
    }

    const { propertyId } = validatedFields.data;

    const property = await prisma.property.findUnique({
        where: {
            id: propertyId,
        },
    });

    if (!property) {
        throw new Error("Property not found.");
    }

    const bookmark = await prisma.savedProperty.findUnique({
        where: {
            propertyId_userId: {
                propertyId,
                userId,
            },
        },
    });

    if (bookmark) {
        try {
            await prisma.savedProperty.delete({
                where: {
                    propertyId_userId: {
                        propertyId,
                        userId,
                    },
                },
            });
            // Construct dynamic path
            const propertyDetails = property.propertyDetails; // Adjust as needed
            const path = `/properties/${propertyDetails}/${propertyId}`;
            revalidatePath(path);
            return { message: "Unbookmarked Property." };
        } catch (error) {
            return {
                message: "Database Error: Failed to Unbookmark Property.",
            };
        }
    }

    try {
        await prisma.savedProperty.create({
            data: {
                propertyId,
                userId,
            },
        });
        // Construct dynamic path
        const propertyDetails = property.propertyDetails; // Adjust as needed
        const path = `/properties/${propertyDetails}/${propertyId}`;
        revalidatePath(path);
        return { message: "Bookmarked Property." };
    } catch (error) {
        return {
            message: "Database Error: Failed to Bookmark Property.",
        };
    }
}