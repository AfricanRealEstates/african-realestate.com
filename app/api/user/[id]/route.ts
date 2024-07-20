import { profileFormSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
interface Props {
    params: { id: string }
}

export async function PATCH(request: NextRequest, { params }: Props) {
    const body = await request.json();
    const validation = profileFormSchema.safeParse(body);
    const session = await auth()
    const userId = session?.user.id


    if (!validation.success) {
        return NextResponse.json(validation.error.format(), { status: 400 })
    }

    const user = await prisma.user.findUnique({
        where: { id: userId }
    })

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            ...body
        }
    })

    return NextResponse.json(updatedUser)
}