"use server";

import { revalidatePath } from "next/cache";
import { hash, compare } from "bcrypt";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";
import { auth, update } from "@/auth";

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
    const session = await auth();

    if (!session?.user || session.user.id !== userId) {
      throw new Error("Unauthorized");
    }

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
      data: {
        ...cleanedData,
        updatedAt: new Date(),
      },
    });

    // Update the session with new user data
    await update({
      user: {
        ...session.user,
        name: updatedUser.name,
        agentName: updatedUser.agentName!,
        agentEmail: updatedUser.agentEmail!,
        agentLocation: updatedUser.agentLocation!,
        officeLine: updatedUser.officeLine!,
        whatsappNumber: updatedUser.whatsappNumber!,
        phoneNumber: updatedUser.phoneNumber!,
        address: updatedUser.address!,
        postalCode: updatedUser.postalCode!,
        bio: updatedUser.bio!,
        xLink: updatedUser.xLink!,
        tiktokLink: updatedUser.tiktokLink!,
        facebookLink: updatedUser.facebookLink!,
        // youtubeLink: updatedUser.youtubeLink!,
        linkedinLink: updatedUser.linkedinLink!,
        instagramLink: updatedUser.instagramLink!,
        // showAgentContact: updatedUser.showAgentContact,
      },
    });

    console.log("Profile updated successfully:", updatedUser.id);

    // Revalidate paths that might show user data
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    revalidatePath("/");

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: String(error) };
  }
}

export async function updateProfilePhoto(
  userId: string,
  profilePhotoUrl: string
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.id !== userId) {
      throw new Error("Unauthorized");
    }

    console.log("Updating profile photo for user:", userId);
    console.log("New photo URL:", profilePhotoUrl);

    // Update profile photo in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        profilePhoto: profilePhotoUrl || null,
        updatedAt: new Date(),
      },
    });

    // Update the session with new profile photo
    await update({
      user: {
        ...session.user,
        image: profilePhotoUrl || null,
      },
    });

    console.log("Profile photo updated successfully");

    // Revalidate paths that might show user data
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    revalidatePath("/");

    // Return the updated user data
    return { success: true, profilePhoto: profilePhotoUrl, user: updatedUser };
  } catch (error) {
    console.error("Error updating profile photo:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update profile photo",
    };
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
    const session = await auth();

    if (!session?.user || session.user.id !== userId) {
      throw new Error("Unauthorized");
    }

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
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
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
    const session = await auth();

    if (!session?.user || session.user.id !== userId) {
      throw new Error("Unauthorized");
    }

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
      // No image to remove, but still update session if it's profile photo
      if (type === "profile") {
        await update({
          user: {
            ...session.user,
            image: null,
          },
        });
      }
      return { success: true };
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
        updatedAt: new Date(),
      },
    });

    // Update session if it's profile photo
    if (type === "profile") {
      await update({
        user: {
          ...session.user,
          image: null,
        },
      });
    }

    // Revalidate paths
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error removing user image:", error);
    throw error;
  }
}

// New function to handle S3 profile photo uploads
export async function uploadProfilePhotoToS3(userId: string, file: File) {
  try {
    const session = await auth();

    if (!session?.user || session.user.id !== userId) {
      throw new Error("Unauthorized");
    }

    // Validate file
    if (!file.type.startsWith("image/")) {
      throw new Error("Invalid file type. Please upload an image.");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File too large. Maximum size is 5MB.");
    }

    // Create FormData for the upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("type", "profile");

    // Upload to your S3 upload endpoint
    const response = await fetch("/api/upload/s3", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to upload image");
    }

    const { url } = await response.json();

    // Update profile photo in database and session
    const result = await updateProfilePhoto(userId, url);

    if (!result.success) {
      throw new Error(result.error || "Failed to update profile photo");
    }

    return { success: true, url };
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload image",
    };
  }
}
