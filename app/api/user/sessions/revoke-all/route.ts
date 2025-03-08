import { NextResponse } from "next/server";

import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the current session token
  const currentSessionToken = cookies().get("next-auth.session-token")?.value;

  if (!currentSessionToken) {
    return NextResponse.json(
      { error: "Current session not found" },
      { status: 400 }
    );
  }

  // Delete all sessions except the current one
  const result = await prisma.session.deleteMany({
    where: {
      userId: session.user.id,
      sessionToken: {
        not: currentSessionToken,
      },
    },
  });

  return NextResponse.json({
    success: true,
    message: `Revoked ${result.count} sessions`,
  });
}
