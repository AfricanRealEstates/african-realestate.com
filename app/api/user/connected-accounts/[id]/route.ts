import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accountId = params.id;

  // Check if the account belongs to the user
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    select: { userId: true },
  });

  if (!account || account.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Account not found or unauthorized" },
      { status: 404 }
    );
  }

  // Check if this is the only account and user has no password
  const accountCount = await prisma.account.count({
    where: { userId: session.user.id },
  });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  });

  if (accountCount <= 1 && !user?.password) {
    return NextResponse.json(
      {
        error:
          "Cannot remove the only login method. Please set a password first.",
      },
      { status: 400 }
    );
  }

  // Delete the account
  await prisma.account.delete({
    where: { id: accountId },
  });

  return NextResponse.json({ success: true });
}
