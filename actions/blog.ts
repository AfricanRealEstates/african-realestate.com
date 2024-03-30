"use server";

import { toSlug } from "@/lib/formatter";
import { addBlogSchema } from "@/lib/formschema";
import { nanoid } from "nanoid";
import { put } from "@vercel/blob";
import path from "path";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { notFound, redirect } from "next/navigation";

export async function createBlogPosting(formData: FormData) {
    const user = await getServerSession(authOptions)

    const values = Object.fromEntries(formData.entries())

    const { title, description, image } = addBlogSchema.parse(values)
    const slug = `${toSlug(title)}-${nanoid(10)}`

    let coverImageUrl: string | undefined = undefined;

    if (image) {
        const coverImage = await put(`blog_images/${slug}/${path.extname(image.name)}`, image, {
            access: "public",
            addRandomSuffix: false

        })
        coverImageUrl = coverImage.url
    }
    await prisma.post.create({
        data: {
            slug,
            title: title.trim(),
            coverImageUrl,
            description: description?.trim(),
        }
    })
    redirect("/dashboard/blog")
}

export async function togglePublished(id: string, published: boolean) {
    await prisma.post.update({ where: { id }, data: { published } })
}

export async function deleteProduct(id: string) {
    const post = await prisma.post.delete({ where: { id } })
    if (post === null) return notFound()
}