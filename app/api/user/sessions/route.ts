import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Helper function to get location info from IP
async function getLocationFromIP(ip: string) {
  try {
    // Use a free IP geolocation API
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country_name,
        city: data.city,
        region: data.region,
      };
    }
  } catch (error) {
    console.error("Error fetching location data:", error);
  }
  return null;
}

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the current session token
  const currentSessionToken = cookies().get("next-auth.session-token")?.value;

  // Get all sessions for the user
  const userSessions = await prisma.session.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      lastActive: "desc",
    },
  });

  // Add metadata to sessions
  const enhancedSessions = await Promise.all(
    userSessions.map(async (userSession) => {
      // Mark the current session
      const isCurrentSession = userSession.sessionToken === currentSessionToken;

      // Get location info if IP is available
      let locationInfo = null;
      if (userSession.ipAddress) {
        locationInfo = await getLocationFromIP(userSession.ipAddress);
      }

      // Calculate session duration
      const createdAt =
        userSession.createdAt || new Date(Date.now() - 86400000); // Default to 1 day ago
      const sessionDuration = Math.floor(
        (Date.now() - createdAt.getTime()) / (1000 * 60 * 60)
      ); // Hours

      return {
        ...userSession,
        isCurrentSession,
        location: locationInfo,
        duration: `${sessionDuration} ${sessionDuration === 1 ? "hour" : "hours"}`,
        formattedLastActive: userSession.lastActive
          ? new Date(userSession.lastActive).toLocaleString()
          : null,
      };
    })
  );

  return NextResponse.json({ sessions: enhancedSessions });
}
