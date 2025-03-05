import { removeUserImage } from "@/app/(dashboard)/dashboard/profile/use-actions";
import { auth } from "@/auth";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { type } = await req.json();

    if (type !== "profile" && type !== "cover") {
      return new NextResponse("Invalid image type", { status: 400 });
    }

    await removeUserImage(session.user.id!, type);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[REMOVE_IMAGE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
