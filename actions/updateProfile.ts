"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { profileFormValues, profileFormSchema } from "@/lib/validation";

export async function updateProfile(values: profileFormValues) {
    const session = await auth();

    const user = session?.user

    if (!user || !user.id) {
        throw new Error('Unauthorized')
    }

    const validatedValues = profileFormSchema.parse(values);

    const updatedProfile = await prisma.user.update({
        where: { id: user.id },
        data: validatedValues,
        select: getUserDataSelect(user.id)
    });

    return updatedProfile;
}