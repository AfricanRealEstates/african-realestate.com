"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { s3Client } from "@/lib/utils/s3-client";

export async function createPost(formData: FormData) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const topics = (formData.get("topics") as string)
    .split(",")
    .map((topic) => topic.trim());
  const published = formData.get("published") === "on";
  const imageFile = formData.get("image") as File;

  const slug = title.toLowerCase().replace(/[^\w-]+/g, "-");

  let imageUrl = "";
  if (imageFile.size > 0) {
    const fileBuffer = await imageFile.arrayBuffer();
    const fileName = `${Date.now()}-${imageFile.name}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: Buffer.from(fileBuffer),
        ContentType: imageFile.type,
      })
    );

    imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
  }

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      topics,
      imageUrls: imageUrl ? [imageUrl] : [],
      published,
      author: { connect: { id: session.user.id } },
    },
  });

  revalidatePath("/dashboard/blogs");
  redirect("/dashboard/blogs");
}

export async function editPost(postId: string, formData: FormData) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const topics = (formData.get("topics") as string)
    .split(",")
    .map((topic) => topic.trim());
  const published = formData.get("published") === "on";
  const imageFile = formData.get("image") as File;

  const slug = title.toLowerCase().replace(/[^\w-]+/g, "-");

  const existingPost = await prisma.post.findUnique({
    where: { id: postId },
    select: { imageUrls: true },
  });

  let imageUrls = existingPost?.imageUrls || [];

  if (imageFile.size > 0) {
    const fileBuffer = await imageFile.arrayBuffer();
    const fileName = `${Date.now()}-${imageFile.name}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: Buffer.from(fileBuffer),
        ContentType: imageFile.type,
      })
    );

    const newImageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    imageUrls = [...imageUrls, newImageUrl];
  }

  const post = await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      slug,
      content,
      topics,
      imageUrls,
      published,
    },
  });

  revalidatePath("/dashboard/blogs");
  redirect("/dashboard/blogs");
}

export async function deletePost(postId: string) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { imageUrls: true },
  });

  if (post?.imageUrls) {
    for (const imageUrl of post.imageUrls) {
      const fileName = imageUrl.split("/").pop();
      if (fileName) {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName,
          })
        );
      }
    }
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  revalidatePath("/dashboard/blogs");
}

export async function likePost(postId: string) {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.update({
    where: { id: postId },
    data: {
      likes: {
        connect: { id: session.user.id },
      },
    },
    include: { likes: true },
  });

  revalidatePath(`/blog/${post.slug}`);
  return post.likes.length;
}

export async function unlikePost(postId: string) {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.update({
    where: { id: postId },
    data: {
      likes: {
        disconnect: { id: session.user.id },
      },
    },
    include: { likes: true },
  });

  revalidatePath(`/blog/${post.slug}`);
  return post.likes.length;
}

export const incrementViewCount = cache(async (postId: string) => {
  const headersList = headers();
  const referer = headersList.get("referer");

  // Only increment if the referer is not from the same post
  if (!referer || !referer.includes(`/blog/${postId}`)) {
    await prisma.post.update({
      where: { id: postId },
      data: { viewCount: { increment: 1 } },
    });
  }
});

export async function incrementShareCount(postId: string) {
  try {
    // Update the share count
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { shareCount: { increment: 1 } },
      select: {
        shareCount: true,
        slug: true,
        topics: true,
      },
    });

    // Revalidate the specific blog path
    if (updatedPost.topics && updatedPost.topics.length > 0) {
      revalidatePath(`/blog/${updatedPost.topics[0]}/${updatedPost.slug}`);
    }

    return updatedPost.shareCount;
  } catch (error) {
    console.error("Error incrementing share count:", error);
    // Return null to indicate failure
    return null;
  }
}
