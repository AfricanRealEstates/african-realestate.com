import { ThumbsUp } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getLikes(propertyId: string) {
  try {
    const likes = await prisma.like.count({
      where: { propertyId: propertyId },
    });
    return likes;
  } catch (error) {
    console.error("Error fetching likes:", error);
    return 0;
  }
}

export default async function LikeCounter({
  propertyId,
}: {
  propertyId: string;
}) {
  const likes = await getLikes(propertyId);

  if (likes === 0) {
    return null;
  }

  return (
    <div className="bg-[rgba(11,33,50,.4)] p-1 rounded flex items-center justify-center">
      <div className="flex items-center space-x-1 font-bold">
        <ThumbsUp className="h-4 w-4 text-white" />
        <span className="text-sm text-white">{likes}</span>
      </div>
    </div>
  );
}
