"use server"

import { auth } from "@/auth";
import { Roles } from "@/lib/agent-role"
import { redirect } from "next/navigation";
import { z } from "zod"
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { UpdateUserSchema } from "@/lib/validation";




export async function updateUserRole(role: UserRole) {
    const parseBody = UpdateUserSchema.safeParse({
        role,
    });

    if (!parseBody.success) {
        throw parseBody.error;
    }

    const session = await auth();
    const user = session?.user

    if (!user) {
        redirect("/login")
    }

    const userRole = await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            role,
        }
    })

    return userRole
}