import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createUploadthing, FileRouter } from "uploadthing/next"
import { UploadThingError, UTApi } from "uploadthing/server";
const f = createUploadthing();

export const fileRouter = {
    avatar: f({
        image: { maxFileSize: '512KB' }
    })
        .middleware(async () => {
            const session = await auth();
            const user = session?.user

            if (!user) {
                throw new UploadThingError('Unauthorized')
            }
            return { user }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const oldAvatarUrl = metadata.user.image;

            // if (oldAvatarUrl) {
            //     const key = oldAvatarUrl.split(
            //         `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
            //     )[1];

            //     await new UTApi().deleteFiles(key);
            // }

            const newAvatarUrl = file.url.replace(
                "/f/",
                `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
            );

            await prisma.user.update({
                where: { id: metadata.user.id },
                data: {
                    image: newAvatarUrl,
                },
            });

            return { image: newAvatarUrl };
        }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
