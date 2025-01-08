"use server";
import { auth, signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export async function upgradeUserRole(newRole: "AGENT" | "AGENCY") {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            throw new Error("User not authenticated");
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: { role: newRole },
        });

        // Update the session with the new role
        await signIn("credentials", {
            redirect: false,
            email: updatedUser.email,
            password: "", // You might need to adjust this based on your auth setup
        });

        // Revalidate the path to ensure the latest data is shown
        revalidatePath("/agent/properties/create-property");

        return { success: true, user: updatedUser };
    } catch (error) {
        console.error("Error upgrading user role:", error);
        return { success: false, error: "Failed to upgrade user role" };
    }
}

