import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const user = await getCurrentUser();
    const { slug } = params;

    if (!user) {
        return NextResponse.json({ isLiked: false });
    }

    try {
        const post = await prisma.blogPost.findUnique({
            where: { slug },
            include: { likedBy: { where: { id: user.id } } },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const isLiked = post.likedBy.length > 0;

        return NextResponse.json({ isLiked });
    } catch (error) {
        console.error('Error checking like status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = params;

    try {
        const post = await prisma.blogPost.findUnique({
            where: { slug },
            include: { likedBy: true },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const hasLiked = post.likedBy.some((likedUser) => likedUser.id === user.id);

        let updatedPost;

        if (hasLiked) {
            updatedPost = await prisma.blogPost.update({
                where: { slug },
                data: {
                    likes: { decrement: 1 },
                    likedBy: { disconnect: { id: user.id } },
                },
                include: { likedBy: true },
            });
        } else {
            updatedPost = await prisma.blogPost.update({
                where: { slug },
                data: {
                    likes: { increment: 1 },
                    likedBy: { connect: { id: user.id } },
                },
                include: { likedBy: true },
            });
        }

        const isLiked = updatedPost.likedBy.some((likedUser) => likedUser.id === user.id);

        return NextResponse.json({ likes: updatedPost.likes, isLiked });
    } catch (error) {
        console.error('Error updating likes:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}