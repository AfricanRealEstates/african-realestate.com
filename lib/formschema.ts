import { z } from "zod"

const blogImageSchema = z
    .custom<File | undefined>()
    .refine(
        (file) => !file || (file instanceof File && file.type.startsWith("image/")),
        "Must be an image file",
    )
    .refine((file) => {
        return !file || file.size < 1024 * 1024 * 2;
    }, "File must be less than 2MB");
export const addBlogSchema = z.object({
    title: z.string().min(1).max(100),
    image: blogImageSchema,
    description: z.string().min(1).max(5000),
})