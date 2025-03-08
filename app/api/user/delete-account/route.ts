import { deleteAccount } from "@/app/(dashboard)/dashboard/settings/actions";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function DELETE() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await deleteAccount();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      {
        error: "Failed to delete account",
      },
      { status: 500 }
    );
  }
}
