"use server";
import { getCurrentUser } from '../lib/session';
import { prisma } from "@/lib/prisma";
import { headers } from 'next/headers'
import { UAParser } from 'ua-parser-js'

export async function recordPropertyView(propertyId: string) {
    const user = await getCurrentUser();
    const headersList = headers()
    const userAgent = headersList.get('user-agent');

    const parser = new UAParser(userAgent || '')
    const deviceType = parser.getDevice().type || 'unknown'
    const browser = parser.getBrowser().name || 'unknown'
    const os = parser.getOS().name || 'unknown'

    // You might want to use a geolocation service here
    // For this example, we'll just use a placeholder
    const country = 'Unknown'
    const city = 'Unknown'

    await prisma.propertyView.create({
        data: {
            propertyId,
            userId: user?.id,
            deviceType,
            browser,
            os,
            country,
            city,
        },
    })
}