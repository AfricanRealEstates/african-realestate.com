import { UAParser } from "ua-parser-js";
import { prisma } from "@/lib/prisma";

export async function updateSessionAfterLogin(
  sessionToken: string,
  userAgent?: string,
  ip?: string
) {
  if (!sessionToken) return null;

  try {
    // Parse user agent
    const parser = new UAParser(userAgent || "");
    const browser = parser.getBrowser().name;
    const os = parser.getOS().name;
    const deviceType = parser.getDevice().type || "desktop";

    // Find the session
    const session = await prisma.session.findFirst({
      where: { sessionToken },
    });

    if (session) {
      // Update session with metadata
      await prisma.session.update({
        where: { id: session.id },
        data: {
          userAgent: userAgent || null,
          ipAddress: ip || null,
          browser,
          os,
          deviceType,
          lastActive: new Date(),
        },
      });

      return { success: true };
    }

    return { success: false, error: "Session not found" };
  } catch (error) {
    console.error("Error updating session metadata:", error);
    return { success: false, error };
  }
}
