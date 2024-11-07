"use server";

import { prisma } from "@/lib/prisma";

export async function saveRating(ratingInfo: any) {
    try {
        // Check if the user is the author of the property
        const property = await prisma.property.findUnique({
            where: {
                id: ratingInfo.propertyId
            },
            select: {
                userId: true // Assuming property model has userId field (the author's ID)
            }
        });

        if (!property) {
            return {
                message: "Property not found"
            };
        }

        if (property.userId === ratingInfo.userId) {
            return {
                message: "You cannot rate your own property"
            };
        }

        // Check if the user has already rated this property
        const existingRating = await prisma.rating.findFirst({
            where: {
                propertyId: ratingInfo.propertyId,
                userId: ratingInfo.userId
            }
        });

        if (existingRating) {
            return {
                message: "You have already rated this property"
            };
        }

        // Save the rating
        const data = await prisma.rating.create({
            data: ratingInfo
        });

        return {
            message: "Rating saved successfully",
            data
        };
    } catch (error) {
        return {
            message: "Failed to save rating",
            error
        };
    }
}


export async function getRatings(propertyId: string) {
    try {
        const ratings = await prisma.rating.findMany({
            where: {
                propertyId: propertyId,
            },
            select: {
                ratings: true,
                user: {
                    select: {
                        name: true, // Include the user's name
                    },
                },
            },
        });

        // If there are no ratings, return 0 for the average
        if (ratings.length === 0) {
            return {
                averageRating: 0,
                ratingsCount: 0,
                ratingsList: [],
            };
        }

        // Calculate the average rating using native JavaScript
        const sumOfRatings = ratings.reduce((sum, rating) => sum + Number(rating.ratings), 0);
        const averageRating = sumOfRatings / ratings.length;

        return {
            averageRating: parseFloat(averageRating.toFixed(1)), // Round to 1 decimal place if needed
            ratingsCount: ratings.length,
            ratingsList: ratings, // List of individual ratings
        };
    } catch (error) {
        console.error("Failed to fetch ratings:", error);
        return {
            averageRating: 0,
            ratingsCount: 0,
            ratingsList: [],
        };
    }
}



export async function getUserRating(userId: string, propertyId: string) {
    const userRating = await prisma.rating.findFirst({
        where: {
            userId,
            propertyId,
        },
    });

    // Convert Decimal to Number
    return userRating
        ? {
            ...userRating,
            ratings: Number(userRating.ratings), // Convert Decimal to Number
        }
        : null;
}
