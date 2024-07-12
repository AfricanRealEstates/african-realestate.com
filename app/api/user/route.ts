import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"

export const userSchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    profilePhoto: z.string().optional(),
    bio: z.string().optional(),
    xLink: z.string().optional(),
    titkokLink: z.string().optional(),
    facebookLink: z.string().optional(),
    youtubeLink: z.string().optional(),
    linkedinLink: z.string().optional(),
    role: z.string().min(3, "Role is required").max(10)
})

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = userSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json(validation.error.format(), { status: 400 })
    }

    const duplicate = await prisma.user.findUnique({
        where: {
            email: body.email
        }
    })

    if (duplicate) {
        return NextResponse.json({
            message: "Duplicate Email"
        }, { status: 409 })
    }

    const newUser = await prisma.user.create({ data: { ...body } })

    return NextResponse.json(newUser, { status: 201 })
}