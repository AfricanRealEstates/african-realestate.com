"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { s3Client } from "@/lib/utils/s3-client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import * as z from "zod";

const blogSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  topics: z
    .array(z.string())
    .min(1, { message: "At least one topic is required" }),
  coverPhoto: z.string().url(),
  published: z.boolean().optional(),
  imageUrls: z.array(z.string().url()).optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
});

export async function createBlog(data: z.infer<typeof blogSchema>) {
  const result = blogSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.flatten() };
  }

  const {
    title,
    content,
    topics,
    coverPhoto,
    published,
    imageUrls,
    metaDescription,
    metaKeywords,
  } = result.data;
  const slug = slugify(title, { lower: true, strict: true });

  try {
    const session = await auth();

    if (!session || !session.user) {
      return { error: "User not authenticated" };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return { error: "User not found" };
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        topics,
        coverPhoto,
        published,
        imageUrls: imageUrls || [],
        metaDescription: metaDescription || "",
        metaKeywords: metaKeywords || "",
        authorId: user.id,
        viewCount: 0,
        shareCount: 0,
      },
    });

    revalidatePath("/posts");
    return { success: true, post };
  } catch (error) {
    console.error("Failed to create blog:", error);
    return { error: "Failed to create blog. Please try again." };
  }
}

export async function updateBlog(id: string, data: z.infer<typeof blogSchema>) {
  const result = blogSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.flatten() };
  }

  const {
    title,
    content,
    topics,
    coverPhoto,
    published,
    imageUrls,
    metaDescription,
    metaKeywords,
  } = result.data;
  const slug = slugify(title, { lower: true, strict: true });

  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        topics,
        coverPhoto,
        published,
        imageUrls: imageUrls || [],
        metaDescription: metaDescription || "",
        metaKeywords: metaKeywords || "",
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    return { success: true, post };
  } catch (error) {
    console.error("Failed to update blog:", error);
    return { error: "Failed to update blog. Please try again." };
  }
}

export async function deleteBlog(id: string) {
  try {
    await prisma.post.delete({
      where: { id },
    });

    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete blog:", error);
    return { error: "Failed to delete blog. Please try again." };
  }
}

export async function getPresignedUrl(fileName: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `blog/${fileName}`,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return { success: true, url: signedUrl };
  } catch (error) {
    console.error("Failed to generate pre-signed URL:", error);
    return { error: "Failed to generate upload URL. Please try again." };
  }
}

export async function togglePublishStatus(id: string) {
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return { error: "Blog post not found" };
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { published: !post.published },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    return { success: true, post: updatedPost };
  } catch (error) {
    console.error("Failed to toggle publish status:", error);
    return { error: "Failed to update publish status. Please try again." };
  }
}
