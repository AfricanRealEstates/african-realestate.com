import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UAParser } from "ua-parser-js";
import { prisma } from "@/lib/prisma";

// Export the auth middleware directly
export { auth as middleware } from "@/auth";

// Create a custom middleware function to update session metadata
export async function updateSessionMetadata(request: NextRequest) {
  // Get the session token from cookies
  const sessionToken = request.cookies.get("next-auth.session-token")?.value;

  if (!sessionToken) return NextResponse.next();

  // Get user agent details
  const userAgent = request.headers.get("user-agent") || "";
  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser().name;
  const os = parser.getOS().name;
  const deviceType = parser.getDevice().type || "desktop";

  // Get IP address
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0] : "127.0.0.1";

  try {
    // Find the session by token
    const session = await prisma.session.findFirst({
      where: { sessionToken },
    });

    if (session) {
      // Update session metadata if not already set
      if (!session.userAgent || !session.ipAddress) {
        await prisma.session.update({
          where: { id: session.id },
          data: {
            userAgent,
            ipAddress: ip,
            browser,
            os,
            deviceType,
          },
        });
      }

      // Always update lastActive timestamp
      await prisma.session.update({
        where: { id: session.id },
        data: { lastActive: new Date() },
      });
    }
  } catch (error) {
    // Log error but don't block the request
    console.error("Error updating session metadata:", error);
  }

  return NextResponse.next();
}

// Use Auth.js middleware configuration
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
