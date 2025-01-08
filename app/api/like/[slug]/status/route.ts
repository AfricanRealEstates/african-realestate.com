import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ isLiked: false });
    }

    const { slug } = params;

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