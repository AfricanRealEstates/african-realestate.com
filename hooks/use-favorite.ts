"use client"
import axios from "axios";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";

interface IUseFavorite {
    propertyId: string;
    currentUser?: User | null
}

const useFavorite = ({
    propertyId,
    currentUser
}: IUseFavorite) => {
    const router = useRouter();

    const hasFavorited = useMemo(() => {
        const property = currentUser!.favoriteIds || [];
        console.log("Current user favorite IDs: ", property);
        return property.includes(propertyId)
    }, [propertyId, currentUser])

    const toggleFavorite = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        if (!currentUser) {
            toast.error("Sign in to like property")
        }

        try {
            let request;
            if (hasFavorited) {
                request = () => axios.delete(`/api/favorites/${propertyId}`)
            } else {
                request = () => axios.post(`/api/favorites/${propertyId}`)
            }

            await request();
            router.refresh();
            toast.success("Success!")
        } catch (error) {
            toast.error("Failed to like property")
        }
    }, [
        currentUser,
        hasFavorited,
        propertyId,
        router
    ])

    console.log("Has favorited before request: ", hasFavorited);
    return {
        hasFavorited,
        toggleFavorite
    }

}

export default useFavorite;