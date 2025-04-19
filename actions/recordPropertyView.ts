import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { UAParser } from "ua-parser-js";
import { headers } from "next/headers";

export async function recordPropertyView(propertyId: string) {
  try {
    const user = await getCurrentUser();

    // Get request headers (for IP and user-agent)
    const headerList = headers();
    const userAgent = headerList.get("user-agent") || "";
    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "Unknown";

    // Parse device info
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser().name || "Unknown";
    const os = parser.getOS().name || "Unknown";
    const deviceType = parser.getDevice().type || "desktop";

    // Geolocation lookup from IP using ipapi.co
    let country = "Unknown";
    let city = "Unknown";

    try {
      const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
      if (geoRes.ok) {
        const geo = await geoRes.json();
        country = geo.country_name || country;
        city = geo.city || city;
      }
    } catch (geoError) {
      console.warn("Geolocation fetch failed:", geoError);
    }

    // Create property view record
    await prisma.propertyView.create({
      data: {
        propertyId,
        userId: user?.id,
        deviceType,
        browser,
        os,
        country,
        city,
      },
    });

    // If user is logged in, also record this for personalization
    if (user) {
      // Check if this property is already in recently viewed
      const existingView = await prisma.recentlyViewedProperty.findUnique({
        where: {
          userId_propertyId: {
            userId: user.id!,
            propertyId,
          },
        },
      });

      if (existingView) {
        // Update the timestamp
        await prisma.recentlyViewedProperty.update({
          where: {
            userId_propertyId: {
              userId: user.id!,
              propertyId,
            },
          },
          data: {
            viewedAt: new Date(),
          },
        });
      } else {
        // Create a new entry
        await prisma.recentlyViewedProperty.create({
          data: {
            userId: user.id!,
            propertyId,
          },
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error recording property view:", error);
    return { success: false, error };
  }
}
