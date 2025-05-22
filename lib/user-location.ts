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
    const ip = headersList.get("x-forwarded-for") || "127.0.0.1";

    // Skip actual API call in development
    if (process.env.NODE_ENV === "development" || ip === "127.0.0.1") {
      return {
        country: "Kenya",
        city: "Nairobi",
        region: "Nairobi County",
        latitude: -1.292066,
        longitude: 36.821945,
      };
    }

    // Use a geolocation API service
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();

    return {
      country: data.country_name,
      city: data.city,
      region: data.region,
      latitude: data.latitude,
      longitude: data.longitude,
    };
  } catch (error) {
    console.error("Error fetching user location:", error);
    return {};
  }
}
