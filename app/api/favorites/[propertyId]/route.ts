import { auth } from "@/auth"
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

interface IParams {
    propertyId?: string
}

export async function POST(request: Request, { params }: { params: IParams }) {
    const session = await auth();
    const currentUser = await getCurrentUser()
    if (!currentUser) {
        return NextResponse.error();
    }

    const { propertyId } = params;

    if (!propertyId || typeof propertyId !== "string") {
        throw new Error("Invalid ID")
    }

    let favoriteIds = [...(currentUser.favoriteIds || [])]

    favoriteIds.push(propertyId)

    const user = await prisma.user.update({
        where: {
            id: currentUser.id
        },
        data: {
            favoriteIds
        }
    });

    return NextResponse.json(user)
}

export async function DELETE(request: Request, { params }: { params: IParams }) {
    const session = await auth();
    const currentUser = await getCurrentUser()

    if (!currentUser) {
        return NextResponse.error();
    }

    const { propertyId } = params;

    if (!propertyId || typeof propertyId !== "string") {
        throw new Error("Invalid ID")
    }

    let favoriteIds = [...(currentUser.favoriteIds || [])]

    favoriteIds = favoriteIds.filter((id) => id !== propertyId);

    const user = await prisma.user.update({
        where: {
            id: currentUser.id
        },
        data: {
            favoriteIds
        }
    });

    return NextResponse.json(user)
}