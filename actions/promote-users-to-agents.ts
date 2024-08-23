"use server"
import prisma from '@/lib/prisma';

export async function promoteUsersToAgents() {
    try {
        // Find users with at least one property
        const usersWithProperties = await prisma.user.findMany({
            where: {
                properties: {
                    some: {} // Find users with at least one property
                }
            },
            select: {
                id: true,
                role: true,
                _count: {
                    select: {
                        properties: true // Count the number of properties each user has
                    }
                }
            }
        });

        // Loop through the users and update their role based on the number of properties
        for (const user of usersWithProperties) {
            if (user._count.properties > 3 && user.role !== 'AGENCY') {
                // Promote to AGENCY if they have more than 3 properties
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        role: 'AGENCY'
                    }
                });
            } else if (user._count.properties > 0 && user._count.properties <= 3 && user.role !== 'AGENT') {
                // Promote to AGENT if they have 1 to 3 properties
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        role: 'AGENT'
                    }
                });
            }
        }

        return { message: 'Users promoted to agents or agencies successfully.' };
    } catch (error) {
        console.error('Failed to promote users:', error);
        return { error: 'Failed to promote users.' };
    }
}
