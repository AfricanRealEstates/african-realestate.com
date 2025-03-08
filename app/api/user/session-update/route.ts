import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UAParser } from "ua-parser-js";

export async function POST() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the current session token
  const sessionToken = cookies().get("next-auth.session-token")?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: "No session found" }, { status: 400 });
  }

  // Get user agent and IP
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const forwardedFor = headersList.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0] : "127.0.0.1";

  // Parse user agent
  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser().name;
  const os = parser.getOS().name;
  const deviceType = parser.getDevice().type || "desktop";

  try {
    // Find the session
    const dbSession = await prisma.session.findFirst({
      where: { sessionToken },
    });

    if (dbSession) {
      // Update session with metadata
      await prisma.session.update({
        where: { id: dbSession.id },
        data: {
          userAgent,
          ipAddress: ip,
          browser,
          os,
          deviceType,
          lastActive: new Date(),
        },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  } catch (error) {
    console.error("Error updating session metadata:", error);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}
