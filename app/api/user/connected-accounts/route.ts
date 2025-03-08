import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get all connected accounts for the user
  const accounts = await prisma.account.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      provider: true,
      providerAccountId: true,
    },
  });

  return NextResponse.json({ accounts });
}
