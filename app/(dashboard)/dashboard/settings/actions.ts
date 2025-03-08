"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { UAParser } from "ua-parser-js";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function updateSessionMetadata() {
  const sessionToken = cookies().get("next-auth.session-token")?.value;

  if (!sessionToken) return null;

  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const forwardedFor = headersList.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0] : "127.0.0.1";

  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser().name;
  const os = parser.getOS().name;
  const deviceType = parser.getDevice().type || "desktop";

  try {
    const session = await prisma.session.findFirst({
      where: { sessionToken },
    });

    if (session) {
      await prisma.session.update({
        where: { id: session.id },
        data: {
          userAgent,
          ipAddress: ip,
          browser,
          os,
          deviceType,
          lastActive: new Date(),
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating session metadata:", error);
    return { success: false, error };
  }
}

export async function revokeSession(sessionId: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Get the current session token
  const currentSessionToken = cookies().get("next-auth.session-token")?.value;

  // Find the session to revoke
  const sessionToRevoke = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { sessionToken: true, userId: true },
  });

  // Make sure the session belongs to the current user
  if (!sessionToRevoke || sessionToRevoke.userId !== user.id) {
    throw new Error("Session not found or unauthorized");
  }

  // Don't allow revoking the current session through this method
  if (sessionToRevoke.sessionToken === currentSessionToken) {
    throw new Error("Cannot revoke current session");
  }

  // Delete the session
  await prisma.session.delete({
    where: { id: sessionId },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function revokeAllOtherSessions() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Get the current session token
  const currentSessionToken = cookies().get("next-auth.session-token")?.value;

  if (!currentSessionToken) {
    throw new Error("Current session not found");
  }

  // Delete all sessions except the current one
  await prisma.session.deleteMany({
    where: {
      userId: user.id,
      sessionToken: {
        not: currentSessionToken,
      },
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function deleteAccount() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Start a transaction to delete all user data
  await prisma.$transaction(async (tx) => {
    // Delete all related data first (following the schema relationships)
    await tx.comment.deleteMany({ where: { userId: user.id } });
    await tx.like.deleteMany({ where: { userId: user.id } });
    await tx.savedProperty.deleteMany({ where: { userId: user.id } });
    await tx.upvote.deleteMany({ where: { userId: user.id } });
    await tx.notification.deleteMany({ where: { userId: user.id } });
    await tx.propertyView.deleteMany({ where: { userId: user.id } });
    await tx.rating.deleteMany({ where: { userId: user.id } });
    await tx.query.deleteMany({ where: { userId: user.id } });
    await tx.order.deleteMany({ where: { userId: user.id } });
    await tx.subscription.deleteMany({ where: { userId: user.id } });
    await tx.follows.deleteMany({
      where: {
        OR: [{ followerId: user.id }, { followingId: user.id }],
      },
    });

    // Delete properties (which may have their own relationships)
    const userProperties = await tx.property.findMany({
      where: { userId: user.id },
      select: { id: true },
    });

    const propertyIds = userProperties.map((p) => p.id);

    if (propertyIds.length > 0) {
      await tx.comment.deleteMany({
        where: { propertyId: { in: propertyIds } },
      });
      await tx.like.deleteMany({ where: { propertyId: { in: propertyIds } } });
      await tx.savedProperty.deleteMany({
        where: { propertyId: { in: propertyIds } },
      });
      await tx.upvote.deleteMany({
        where: { propertyId: { in: propertyIds } },
      });
      await tx.notification.deleteMany({
        where: { propertyId: { in: propertyIds } },
      });
      await tx.propertyView.deleteMany({
        where: { propertyId: { in: propertyIds } },
      });
      await tx.rating.deleteMany({
        where: { propertyId: { in: propertyIds } },
      });
      await tx.query.deleteMany({ where: { propertyId: { in: propertyIds } } });
      await tx.order.deleteMany({ where: { propertyId: { in: propertyIds } } });

      await tx.property.deleteMany({ where: { userId: user.id } });
    }

    // Delete posts
    await tx.post.deleteMany({ where: { authorId: user.id } });

    // Delete sessions and accounts
    await tx.session.deleteMany({ where: { userId: user.id } });
    await tx.account.deleteMany({ where: { userId: user.id } });

    // Finally delete the user
    await tx.user.delete({ where: { id: user.id } });
  });

  // Sign out and redirect
  cookies().delete("next-auth.session-token");
  cookies().delete("next-auth.csrf-token");
  cookies().delete("next-auth.callback-url");

  redirect("/");
}
