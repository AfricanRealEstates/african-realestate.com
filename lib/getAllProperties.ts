import { propertyDetail } from './../node_modules/.prisma/client/index.d';
'use server'

import { prisma } from '@/lib/prisma'
import { cache } from 'react'

export type PropertyForSitemap = {
    id: string
    propertyDetails: string
    updatedAt: Date
}

export type PropertySearchResult = {
    id: string
    title: string
    price: number
    bedrooms: number
    bathrooms: number
    nearbyTown: string
}

export const getAllProperties = cache(async (): Promise<PropertyForSitemap[]> => {
    try {
        const properties = await prisma.property.findMany({
            select: {
                id: true,
                propertyDetails: true,
                updatedAt: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
            take: 100, // Limit to 10,000 most recently updated properties
        })

        return properties
    } catch (error) {
        console.error('Failed to fetch properties:', error)
        throw new Error('Failed to fetch properties')
    }
})

export const getAllNearbyTowns = cache(async (): Promise<string[]> => {
    try {
        const towns = await prisma.property.findMany({
            select: {
                nearbyTown: true,
            },
            distinct: ['nearbyTown'],
        })

        return towns.map(t => t.nearbyTown).filter((t): t is string => t !== null)
    } catch (error) {
        console.error('Failed to fetch nearby towns:', error)
        throw new Error('Failed to fetch nearby towns')
    }
})