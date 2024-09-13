"use server";

import { revalidatePath } from "next/cache";
import prisma from "./prisma";
import { getUserId } from "./utils";
import { BookmarkSchema, LikeSchema } from "./validation";
import { auth } from "@/auth";
import { Like, SavedProperty } from "@prisma/client";

export async function getPropertyLikes(propertyId: string): Promise<Like[]> {
    // Fetch the likes for the property from the database
    return prisma.like.findMany({
        where: { propertyId },
    });
}


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

export const getLikedProperties = async () => {
    try {
        const authenticatedUser = await auth();

        if (
            !authenticatedUser ||
            !authenticatedUser.user ||
            !authenticatedUser.user.id
        ) {
            throw new Error("User ID is missing or invalid");
        }

        const userId = authenticatedUser.user.id;
        const likedProperties = await prisma.like.findMany({
            where: {
                userId
            },
            include: {
                property: true
            }
        });
        return likedProperties.map((upvote) => upvote.property);

    } catch (error) {
        console.error("Error getting upvoted properties:", error);
        return [];
    }
}


export async function bookmarkProperty(value: FormDataEntryValue | null) {
    const userId = await getUserId();

    if (!userId) {
        throw new Error("Sign in first to continue.");
    }

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

export async function getPropertyBookmarks(propertyId: string): Promise<SavedProperty[]> {
    // Fetch the likes for the property from the database
    return prisma.savedProperty.findMany({
        where: { propertyId },
    });
}



export const upvoteProperty = async (propertyId: string) => {
    try {
        const authenticatedUser = await auth();

        if (
            !authenticatedUser ||
            !authenticatedUser.user ||
            !authenticatedUser.user.id
        ) {
            throw new Error("User ID is missing or invalid");
        }

        const userId = authenticatedUser.user.id;
        const upvote = await prisma.upvote.findFirst({
            where: {
                propertyId,
                userId
            }
        });

        const profilePicture = authenticatedUser.user.image || "";

        if (upvote) {
            await prisma.upvote.delete({
                where: {
                    id: upvote.id
                }
            })
        } else {
            await prisma.upvote.create({
                data: {
                    propertyId,
                    userId
                }
            });

            const propertyOwner = await prisma.property.findUnique({
                where: {
                    id: propertyId
                },
                select: {
                    userId: true
                }
            });

            // Notify the property owner about the upvote

            if (propertyOwner && propertyOwner.userId !== userId) {
                await prisma.notification.create({
                    data: {
                        userId: propertyOwner.userId,
                        body: `Upvoted your property`,
                        profilePicture: profilePicture,
                        propertyId: propertyId,
                        type: "UPVOTE",
                        status: "UNREAD"
                    }
                })
            }
        }
        return true;
    } catch (error) {
        console.error("Error upvoting property", error);
        throw error;
    }
}

export const getUpvotedProperties = async () => {
    try {
        const authenticatedUser = await auth();

        if (
            !authenticatedUser ||
            !authenticatedUser.user ||
            !authenticatedUser.user.id
        ) {
            throw new Error("User ID is missing or invalid");
        }

        const userId = authenticatedUser.user.id;
        const upvotedProperties = await prisma.upvote.findMany({
            where: {
                userId
            },
            include: {
                property: true
            }
        });
        return upvotedProperties.map((upvote) => upvote.property);

    } catch (error) {
        console.error("Error getting upvoted properties:", error);
        return [];
    }
}
export const getActiveProperties = async () => {
    const properties = await prisma.property.findMany({
        where: {
            isActive: true
        },
        include: {
            comments: {
                include: {
                    user: true
                }
            },
            upvotes: {
                include: {
                    user: true
                }
            }
        },
        orderBy: {
            upvotes: {
                _count: 'desc'
            }
        }
    })
    return properties
}

export const getPendingProperties = async () => {
    const properties = await prisma.property.findMany({
        where: {
            status: "PENDING",
        },
        // include: {
        //     categories: true,
        //     images: true,
        // },
    });

    return properties;
};


export const getRejectedProperties = async () => {
    const properties = await prisma.property.findMany({
        where: {
            status: "REJECTED",
        },
        // include: {
        //     categories: true,
        //     images: true,
        // },
    });

    return properties;
}

export const getUsers = async () => {
    const users = await prisma.user.findMany();
    return users;
}

export const getTotalUpvotes = async () => {
    const totalUpvotes = await prisma.upvote.count({
        where: {
            property: {
                isActive: true
            },
        },
    });
    return totalUpvotes;
};

export const markAllNotificationsAsRead = async () => {
    try {
        const authenticatedUser = await auth();

        if (
            !authenticatedUser ||
            !authenticatedUser.user ||
            !authenticatedUser.user.id
        ) {
            throw new Error("User ID is missing or invalid");
        }

        const userId = authenticatedUser?.user.id;

        await prisma.notification.updateMany({
            where: {
                userId,
            },
            data: {
                status: "READ",
            },
        });
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        throw error;
    }
};

export const getAdminData = async () => {
    const totalProperties = await prisma.property.count();
    const totalUsers = await prisma.user.count();
    const totalUpvotes = await prisma.upvote.count();
    const totalComments = await prisma.comment.count();

    return {
        totalProperties,
        totalUsers,
        totalUpvotes,
        totalComments,
    };
}
