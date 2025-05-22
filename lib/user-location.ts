"use server";

import { headers } from "next/headers";

type GeoLocation = {
  country?: string;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
};

export async function getUserLocation(): Promise<GeoLocation> {
  try {
    const headersList = headers();

    // Try to get real IP from various headers
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    const cfConnectingIp = headersList.get("cf-connecting-ip");

    // Extract the first IP if there are multiple (comma-separated)
    const ip =
      forwardedFor?.split(",")[0]?.trim() ||
      realIp ||
      cfConnectingIp ||
      headersList.get("remote-addr") ||
      "127.0.0.1";

    console.log("Detected IP:", ip);

    // Only use fallback for localhost/private IPs
    const isLocalhost =
      ip === "127.0.0.1" ||
      ip === "::1" ||
      ip.startsWith("192.168.") ||
      ip.startsWith("10.") ||
      ip.startsWith("172.");

    if (isLocalhost) {
      console.log("Using fallback location for localhost");
      // You can change this fallback to your preferred location for testing
      return {
        country: "Kenya",
        city: "Nairobi",
        region: "Nairobi County",
        latitude: -1.292066,
        longitude: 36.821945,
      };
    }

    // Try multiple geolocation services for better reliability
    const geoServices = [
      `https://ipapi.co/${ip}/json/`,
      `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IPGEOLOCATION_API_KEY}&ip=${ip}`,
      `https://ipinfo.io/${ip}/json?token=${process.env.IPINFO_TOKEN}`,
    ];

    for (const serviceUrl of geoServices) {
      try {
        // Skip services that require API keys if not provided
        if (serviceUrl.includes("undefined")) continue;

        const response = await fetch(serviceUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; PropertyApp/1.0)",
          },
          next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) continue;

        const data = await response.json();

        // Handle different API response formats
        let location: GeoLocation = {};

        if (serviceUrl.includes("ipapi.co")) {
          location = {
            country: data.country_name,
            city: data.city,
            region: data.region,
            latitude: data.latitude,
            longitude: data.longitude,
          };
        } else if (serviceUrl.includes("ipgeolocation.io")) {
          location = {
            country: data.country_name,
            city: data.city,
            region: data.state_prov,
            latitude: Number.parseFloat(data.latitude),
            longitude: Number.parseFloat(data.longitude),
          };
        } else if (serviceUrl.includes("ipinfo.io")) {
          const [lat, lng] = data.loc?.split(",") || [];
          location = {
            country: data.country,
            city: data.city,
            region: data.region,
            latitude: lat ? Number.parseFloat(lat) : undefined,
            longitude: lng ? Number.parseFloat(lng) : undefined,
          };
        }

        // Validate that we got meaningful data
        if (location.city && location.country) {
          console.log("Successfully detected location:", location);
          return location;
        }
      } catch (serviceError) {
        console.warn(`Geolocation service failed:`, serviceError);
        continue;
      }
    }

    // If all services fail, return empty object
    console.warn("All geolocation services failed");
    return {};
  } catch (error) {
    console.error("Error fetching user location:", error);
    return {};
  }
}
