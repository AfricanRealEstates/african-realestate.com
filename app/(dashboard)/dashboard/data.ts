import prisma from '@/lib/prisma'

export async function getUserFavorites(userId: string | undefined) {
    const favorites = await prisma.like.findMany({
        where: { userId },
        include: {
            property: {
                select: {
                    id: true,
                    title: true,
                    locality: true,
                    county: true,
                    currency: true,
                    price: true,
                    coverPhotos: true,
                }
            }
        }
    })

    return favorites.map(favorite => ({
        ...favorite.property,
    }))
}

export async function getUserBookmarks(userId: string | undefined) {
    const bookmarks = await prisma.savedProperty.findMany({
        where: { userId },
        include: {
            property: {
                select: {
                    id: true,
                    title: true,
                    locality: true,
                    county: true,
                    currency: true,
                    price: true,
                    coverPhotos: true,
                }
            }
        }
    })

    return bookmarks.map(bookmark => ({
        ...bookmark.property,
    }))
}

export async function getUserRatings(userId: string | undefined) {
    return prisma.rating.findMany({
        where: { userId },
        include: {
            property: {
                select: {
                    id: true,
                    title: true,
                    locality: true,
                    county: true,
                    coverPhotos: true
                }
            }
        }
    })
}

export async function getUserProperties(userId: string | undefined) {
    return prisma.property.findMany({
        where: { userId },
        select: {
            id: true,
            title: true,
            locality: true,
            county: true,
            currency: true,
            price: true,
            coverPhotos: true,
        }
    })
}

export async function getUserStats(userId: string | undefined) {
    const favoritesCount = await prisma.like.count({ where: { userId } })
    const bookmarksCount = await prisma.savedProperty.count({ where: { userId } })
    const propertiesCount = await prisma.property.count({ where: { userId } })

    const ratings = await prisma.rating.findMany({
        where: { userId },
        select: { ratings: true }
    })

    const averageRating = ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + Number(rating.ratings), 0) / ratings.length
        : 0

    return {
        favoritesCount,
        bookmarksCount,
        propertiesCount,
        averageRating
    }
}

export async function getPropertySummary(userId: string | undefined) {
    const userProperties = await prisma.property.findMany({
        where: { userId },
        include: {
            likes: true,
            savedBy: true,
            ratings: true,
        },
    })

    const totalLikes = userProperties.reduce((sum, property) => sum + property.likes.length, 0)
    const totalBookmarks = userProperties.reduce((sum, property) => sum + property.savedBy.length, 0)
    const allRatings = userProperties.flatMap(property => property.ratings.map(rating => rating.ratings))
    const averageRating = allRatings.length > 0
        ? allRatings.reduce((sum, rating) => sum + Number(rating), 0) / allRatings.length
        : 0

    return {
        totalLikes,
        totalBookmarks,
        averageRating,
    }
}