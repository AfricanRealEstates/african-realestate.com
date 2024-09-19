// app/actions/likeBlogPost.ts
'use server'

import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

export async function likeBlogPost(slug: string) {
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('You must be logged in to like a post')
    }

    const post = await prisma.blogPost.findUnique({
        where: { slug },
        include: { likedBy: true },
    })

    if (!post) {
        throw new Error('Post not found')
    }

    const hasLiked = post.likedBy.some(likedUser => likedUser.id === user.id)

    if (hasLiked) {
        await prisma.blogPost.update({
            where: { slug },
            data: {
                likes: { decrement: 1 },
                likedBy: { disconnect: { id: user.id } },
            },
        })
        return { liked: false, likes: post.likes - 1 }
    } else {
        await prisma.blogPost.update({
            where: { slug },
            data: {
                likes: { increment: 1 },
                likedBy: { connect: { id: user.id } },
            },
        })
        return { liked: true, likes: post.likes + 1 }
    }
}