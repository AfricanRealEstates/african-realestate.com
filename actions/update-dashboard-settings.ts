"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { profileFormSchema, updateUserSchema } from "@/lib/validation"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import firebaseApp from "@/lib/firebase"

export type FormData = {
    agentName: string
    agentEmail: string
    address: string
    bio: string
    postalCode: string
    whatsappNumber: string
    officeLine: string
}

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export async function updateDashboardSettings(userId: string, data: FormData) {
    try {
        const session = await auth();

        if (!session?.user || session?.user.id !== userId) {
            throw new Error('Unauthorized')
        }

        const { agentName,
            agentEmail,
            address,
            bio,
            postalCode,
            whatsappNumber,
            officeLine, } = updateUserSchema.parse(data)

        // Update profile data
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                agentName,
                agentEmail,
                address,
                bio,
                postalCode,
                whatsappNumber,
                officeLine
            }
        })

        revalidatePath('/dashboard/account');
        return { status: "success" }
    } catch (error) {
        return { status: "error" }
    }
}


async function uploadImage(file: File): Promise<string> {
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, `profilePhotos/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
}

export type ProfileFormData = {
    profilePhoto: string
    name: string
    email: string
    whatsappNumber: string
    phoneNumber: string
    xLink: string
    tiktokLink: string
    facebookLink: string
    linkedinLink: string
    instagramLink: string
}

export async function updateIndividualAccount(userId: string, data: ProfileFormValues) {
    try {
        const session = await auth();
        const userId = session?.user.id

        if (!userId) {
            throw new Error('Unauthorized')
        }

        const {

            name,
            email,
            whatsappNumber,
            phoneNumber,
            xLink,
            tiktokLink,
            facebookLink,
            linkedinLink,
            instagramLink,
        } = profileFormSchema.parse(data);

        // Update profile data
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {

                name,
                email,
                whatsappNumber,
                phoneNumber,
                xLink,
                tiktokLink,
                facebookLink,
                linkedinLink,
                instagramLink,
            }
        })

        revalidatePath('/dashboard/account');
        return { status: "success" }
    } catch (error) {

    }
}