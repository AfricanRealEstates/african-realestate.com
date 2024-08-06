import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { LikeInfo } from "@/lib/types";

export async function GET(req: Request, { params: { propertyId } }: { params: { propertyId: string } }) {
    try {
        const session = await auth();
        const user = session?.user;

        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            select: {
                likes: {
                    where: {
                        userId: user.id
                    },
                    select: {
                        userId: true
                    }
                },
                _count: {
                    select: {
                        likes: true
                    }
                }
            }
        });

        if (!property) {
            return Response.json({ error: "Property not found" }, { status: 404 });
        }

        const data: LikeInfo = {
            likes: property._count.likes,
            isLikedByUser: !!property.likes.length
        }
        return Response.json(data)
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params: { propertyId } }: { params: { propertyId: string } },
) {
    try {
        const session = await auth();
        const user = session?.user;

        if (!user || !user.id) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.like.upsert({
            where: {
                userId_propertyId: {
                    userId: user.id,
                    propertyId,
                },
            },
            create: {
                userId: user.id,
                propertyId,
            },
            update: {},
        });

        return new Response();
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params: { propertyId } }: { params: { propertyId: string } }
) {
    try {
        const session = await auth();
        const user = session?.user;

        if (!user || !user.id) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.like.deleteMany({
            where: {
                userId: user?.id,
                propertyId
            }
        })
        return new Response();
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}