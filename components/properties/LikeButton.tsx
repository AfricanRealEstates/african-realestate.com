"use client";
import kyInstance from "@/lib/ky";
import { LikeInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Heart } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { FaHeart } from "react-icons/fa";
interface LikeButtonProps {
  propertyId: string;
  initialState: LikeInfo;
}

export default function LikeButton({
  propertyId,
  initialState,
}: LikeButtonProps) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["like-info", propertyId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/properties/${propertyId}/likes`).json<LikeInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? kyInstance.delete(`/api/properties/${propertyId}/likes`)
        : kyInstance.post(`/api/properties/${propertyId}/likes`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<LikeInfo>(queryKey);

      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes:
          (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !previousState?.isLikedByUser,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    },
  });
  return (
    <button className="flex items-center gap-2" onClick={() => mutate()}>
      {/* <CiHeart /> */}
      <FaHeart
        className={cn(
          "size-5 text-gray-400 outline-none",
          data.isLikedByUser && "fill-red-500 text-rose-500"
        )}
      />
      <span className="text-sm font-medium tabular-nums">
        {data.likes} <span className="hidden sm:inline"></span>
      </span>
    </button>
  );
}
