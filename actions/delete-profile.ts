import { auth, signOut } from "@/auth"
import { prisma } from "@/lib/prisma";

export const deleteProfile = async () => {
    const currentUser = await auth();

    if (!currentUser) {
        console.error('Not authenticated');
        return null
    }

    // Delete user
    await prisma.user.delete({
        where: { id: currentUser.user.id }
    })

    await signOut();

    return true;
}