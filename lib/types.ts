import {
    Prisma, Comment,
    Follows,
    Like,
    Property,
    SavedProperty,
    User,
} from "@prisma/client";

export function getUserDataSelect(loggedInUserId: string) {
    return {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        permissions: true,
        password: true,
        isVerified: true,
        isActive: true,
        token: true,
        agentName: true,
        agentEmail: true,
        agentLocation: true,
        officeLine: true,
        whatsappNumber: true,
        phoneNumber: true,
        address: true,
        postalCode: true,
        profilePhoto: true,
        coverPhoto: true,
        bio: true,
        xLink: true,
        tiktokLink: true,
        facebookLink: true,
        youtubeLink: true,
        linkedinLink: true,
        instagramLink: true,
        showAgentContact: true,
        createdAt: true,
        _count: {
            select: {
                properties: true
            }
        }
    } satisfies Prisma.UserSelect;
}

export type UserData = Prisma.UserGetPayload<{
    select: ReturnType<typeof getUserDataSelect>;
}>

export function getPropertyDataInclude(loggedInUserId: string) {
    return {
        user: {
            select: getUserDataSelect(loggedInUserId)
        },
        likes: {
            where: {
                userId: loggedInUserId,
            },
            select: {
                userId: true,
            },
        },
        _count: {
            select: {
                likes: true,
            },
        },
    } satisfies Prisma.PropertyInclude;
}

export type PropertyData = Prisma.PropertyGetPayload<{
    include: ReturnType<typeof getPropertyDataInclude>;
}>

export interface PropertiesPage {
    properties: PropertyData[],
    nextCursor: string | null;
}

export interface LikeInfo {
    likes: number;
    isLikedByUser: boolean;
}

export type CommentWithExtras = Comment & { user: User };
export type LikeWithExtras = Like & { user: User };

export type PropertyWithExtras = Property & {
    comments: CommentWithExtras[];
    likes: LikeWithExtras[];
    savedBy: SavedProperty[];
    user: User;
};

export type UserWithFollows = User & {
    following: Follows[];
    followedBy: Follows[];
};

export type FollowerWithExtras = Follows & { follower: UserWithFollows };
export type FollowingWithExtras = Follows & { following: UserWithFollows };

export type UserWithExtras = User & {
    properties: Property[];
    saved: SavedProperty[];
    followedBy: FollowerWithExtras[];
    following: FollowingWithExtras[];
};