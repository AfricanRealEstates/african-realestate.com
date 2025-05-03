"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { deleteFromS3 } from "@/lib/utils/s3-operations";
import { z } from "zod";
import slugify from "slugify";

// Update the guideSchema to ensure content is never undefined
const guideSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.any().transform((val) => {
    // Ensure content is a plain object by serializing and parsing
    // And make sure it's never undefined
    if (val) {
      try {
        return typeof val === "string" ? JSON.parse(val) : val;
      } catch (e) {
        return val;
      }
    }
    return {}; // Return empty object instead of undefined
  }),
  propertyType: z.string(),
  guideType: z.string(),
  published: z.boolean().default(false),
  coverImage: z.string().nullable().optional(),
  images: z.array(z.string()).default([]),
});

export type GuideFormData = z.infer<typeof guideSchema>;

// Get all guides
export async function getGuides() {
  try {
    const guides = await prisma.guide.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
    return guides;
  } catch (error) {
    console.error("Failed to fetch guides:", error);
    throw new Error("Failed to fetch guides");
  }
}

// Get a single guide by ID
export async function getGuideById(id: string) {
  try {
    const guide = await prisma.guide.findUnique({
      where: { id },
    });
    return guide;
  } catch (error) {
    console.error(`Failed to fetch guide with ID ${id}:`, error);
    throw new Error("Failed to fetch guide");
  }
}

// Get a single guide by slug
export async function getGuideBySlug(slug: string) {
  try {
    const guide = await prisma.guide.findUnique({
      where: { slug },
    });
    return guide;
  } catch (error) {
    console.error(`Failed to fetch guide with slug ${slug}:`, error);
    throw new Error("Failed to fetch guide");
  }
}

// In the createGuide function, ensure content is always provided
export async function createGuide(data: GuideFormData) {
  try {
    const validatedData = guideSchema.parse(data);

    // Generate a slug from the title
    const slug = slugify(validatedData.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });

    // Check if slug already exists
    const existingGuide = await prisma.guide.findUnique({
      where: { slug },
    });

    // If slug exists, append a random string
    const finalSlug = existingGuide
      ? `${slug}-${Math.random().toString(36).substring(2, 7)}`
      : slug;

    // Set publishedAt date if published is true
    const publishedAt = validatedData.published ? new Date() : null;

    // Ensure content is never undefined
    const content = validatedData.content || {};

    const guide = await prisma.guide.create({
      data: {
        title: validatedData.title,
        content, // Explicitly provide content
        propertyType: validatedData.propertyType,
        guideType: validatedData.guideType,
        published: validatedData.published,
        images: validatedData.images,
        coverImage: validatedData.coverImage,
        slug: finalSlug,
        publishedAt,
      },
    });

    revalidatePath("/dashboard/guides");
    revalidatePath("/guides");

    return { success: true, guide };
  } catch (error) {
    console.error("Failed to create guide:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    return { success: false, error: "Failed to create guide" };
  }
}

// Similarly update the updateGuide function
export async function updateGuide(id: string, data: GuideFormData) {
  try {
    const validatedData = guideSchema.parse(data);

    // Get the existing guide
    const existingGuide = await prisma.guide.findUnique({
      where: { id },
    });

    if (!existingGuide) {
      return { success: false, error: "Guide not found" };
    }

    // Check if title has changed, if so, update the slug
    let slug = existingGuide.slug;
    if (existingGuide.title !== validatedData.title) {
      slug = slugify(validatedData.title, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      });

      // Check if new slug already exists
      const slugExists = await prisma.guide.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      // If slug exists, append a random string
      if (slugExists) {
        slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
      }
    }

    // Set publishedAt date if published is true and wasn't published before
    let publishedAt = existingGuide.publishedAt;
    if (validatedData.published && !existingGuide.published) {
      publishedAt = new Date();
    }

    // Ensure content is never undefined
    const content = validatedData.content || {};

    const guide = await prisma.guide.update({
      where: { id },
      data: {
        title: validatedData.title,
        content, // Explicitly provide content
        propertyType: validatedData.propertyType,
        guideType: validatedData.guideType,
        published: validatedData.published,
        images: validatedData.images,
        coverImage: validatedData.coverImage,
        slug,
        publishedAt,
      },
    });

    revalidatePath("/dashboard/guides");
    revalidatePath(`/guides/${slug}`);
    revalidatePath("/guides");

    return { success: true, guide };
  } catch (error) {
    console.error(`Failed to update guide with ID ${id}:`, error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    return { success: false, error: "Failed to update guide" };
  }
}

// Delete a guide
export async function deleteGuide(id: string) {
  try {
    // Get the guide to delete
    const guide = await prisma.guide.findUnique({
      where: { id },
    });

    if (!guide) {
      return { success: false, error: "Guide not found" };
    }

    // Delete associated images from S3
    if (guide.coverImage) {
      // Extract the key from the URL
      const coverImageKey = guide.coverImage.split("/").slice(-2).join("/");
      await deleteFromS3(coverImageKey);
    }

    // Delete content images from S3
    for (const image of guide.images) {
      // Extract the key from the URL
      const imageKey = image.split("/").slice(-2).join("/");
      await deleteFromS3(imageKey);
    }

    // Delete the guide from the database
    await prisma.guide.delete({
      where: { id },
    });

    revalidatePath("/dashboard/guides");
    revalidatePath("/guides");

    return { success: true };
  } catch (error) {
    console.error(`Failed to delete guide with ID ${id}:`, error);
    return { success: false, error: "Failed to delete guide" };
  }
}

// Publish or unpublish a guide
export async function toggleGuidePublished(id: string) {
  try {
    // Get the current guide
    const guide = await prisma.guide.findUnique({
      where: { id },
    });

    if (!guide) {
      return { success: false, error: "Guide not found" };
    }

    // Toggle published status
    const published = !guide.published;

    // Set publishedAt date if publishing
    const publishedAt = published ? new Date() : null;

    await prisma.guide.update({
      where: { id },
      data: {
        published,
        publishedAt,
      },
    });

    revalidatePath("/dashboard/guides");
    revalidatePath(`/guides/${guide.slug}`);
    revalidatePath("/guides");

    return { success: true };
  } catch (error) {
    console.error(
      `Failed to toggle published status for guide with ID ${id}:`,
      error
    );
    return { success: false, error: "Failed to update guide status" };
  }
}
