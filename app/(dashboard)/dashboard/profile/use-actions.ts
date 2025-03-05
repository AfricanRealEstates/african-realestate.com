"use server";

import { revalidatePath } from "next/cache";
import { hash, compare } from "bcrypt";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

export async function updateUserProfile(
  userId: string,
  data: {
    name?: string | null;
    username?: string | null;
    email?: string | null;
    bio?: string | null;
    phoneNumber?: string | null;
    address?: string | null;
    postalCode?: string | null;
    xLink?: string | null;
    tiktokLink?: string | null;
    facebookLink?: string | null;
    youtubeLink?: string | null;
    linkedinLink?: string | null;
    instagramLink?: string | null;
    agentName?: string | null;
    agentEmail?: string | null;
    agentLocation?: string | null;
    officeLine?: string | null;
    whatsappNumber?: string | null;
    showAgentContact?: boolean | null;
  }
) {
  try {
    console.log("Updating profile for user:", userId);
    console.log("Update data:", data);

    // Clean up empty strings to be null
    const cleanedData: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      // Skip undefined values
      if (value === undefined) continue;

      // Convert empty strings to null
      cleanedData[key] = value === "" ? null : value;
    }

    console.log("Cleaned data:", cleanedData);

    // Ensure bio is properly handled
    if ("bio" in data) {
      cleanedData.bio = data.bio === "" ? null : data.bio;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: cleanedData,
    });

    console.log("Profile updated successfully:", updatedUser.id);
    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: String(error) };
  }
}

export async function updatePassword({
  userId,
  currentPassword,
  newPassword,
}: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}) {
  try {
    // Get the user with the password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user || !user.password) {
      throw new Error("User not found or no password set");
    }

    // Verify the current password
    const isPasswordValid = await compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash the new password
    const hashedPassword = await hash(newPassword, 10);

    // Update the password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
}

export async function removeUserImage(
  userId: string,
  type: "profile" | "cover"
) {
  try {
    // Find the user and get the image URL
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        profilePhoto: type === "profile",
        coverPhoto: type === "cover",
      },
    });

    const imageUrl = type === "profile" ? user?.profilePhoto : user?.coverPhoto;

    if (!imageUrl) {
      return; // No image to remove
    }

    // Extract the file name from the URL
    const fileName = imageUrl.split("/").pop();

    if (!fileName) {
      throw new Error("Invalid image URL");
    }

    // Delete the image from S3
    const s3Client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: `users/${fileName}`,
    });
    await s3Client.send(command);

    // Update the user's profilePhoto or coverPhoto field in the database
    await prisma.user.update({
      where: { id: userId },
      data: {
        [type === "profile" ? "profilePhoto" : "coverPhoto"]: null,
      },
    });
  } catch (error) {
    console.error("Error removing user image:", error);
    throw error;
  }
}
