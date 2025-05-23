"use server";

import { headers } from "next/headers";

type GeoLocation = {
  country?: string;
  city?: string;
  county?: string; // Added county field specifically for Kenya
  region?: string;
  latitude?: number;
  longitude?: number;
};

// Kenya counties list for better matching
const KENYA_COUNTIES = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Kiambu",
  "Uasin Gishu",
  "Machakos",
  "Kajiado",
  "Bungoma",
  "Kakamega",
  "Kilifi",
  "Kisii",
  "Nyeri",
  "Meru",
  "Nyandarua",
  "Laikipia",
  "Kericho",
  "Bomet",
  "Busia",
  "Siaya",
  "Murang'a",
  "Homa Bay",
  "Migori",
  "Kirinyaga",
  "Embu",
  "Makueni",
  "Nandi",
  "Trans Nzoia",
  "Baringo",
  "Narok",
  "Kwale",
  "Nyamira",
  "Turkana",
  "Kitui",
  "Vihiga",
  "Tharaka-Nithi",
  "Garissa",
  "Taita-Taveta",
  "Elgeyo-Marakwet",
  "West Pokot",
  "Tana River",
  "Marsabit",
  "Isiolo",
  "Samburu",
  "Wajir",
  "Mandera",
  "Lamu",
];

// Map city names to counties for Kenyan cities
const KENYA_CITY_TO_COUNTY: Record<string, string> = {
  Nairobi: "Nairobi",
  Mombasa: "Mombasa",
  Kisumu: "Kisumu",
  Nakuru: "Nakuru",
  Eldoret: "Uasin Gishu",
  Thika: "Kiambu",
  Ruiru: "Kiambu",
  Kikuyu: "Kiambu",
  Malindi: "Kilifi",
  Kitale: "Trans Nzoia",
  Nyeri: "Nyeri",
  Machakos: "Machakos",
  Kericho: "Kericho",
  Naivasha: "Nakuru",
  Kakamega: "Kakamega",
  Kisii: "Kisii",
  Bungoma: "Bungoma",
  Garissa: "Garissa",
  Voi: "Taita-Taveta",
  Migori: "Migori",
  "Athi River": "Machakos",
  Kilifi: "Kilifi",
};

// Detect if a string is a Kenyan county
function isKenyanCounty(location: string): boolean {
  return KENYA_COUNTIES.some(
    (county) =>
      location.toLowerCase().includes(county.toLowerCase()) ||
      county.toLowerCase().includes(location.toLowerCase())
  );
}

// Get county from city name for Kenya
function getCountyFromCity(city: string): string | undefined {
  return (
    KENYA_CITY_TO_COUNTY[city] ||
    Object.entries(KENYA_CITY_TO_COUNTY).find(
      ([cityName]) =>
        cityName.toLowerCase().includes(city.toLowerCase()) ||
        city.toLowerCase().includes(cityName.toLowerCase())
    )?.[1]
  );
}

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
        county: "Nairobi", // Added county
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

        // For Kenya, try to determine the county
        if (location.country === "Kenya") {
          // Check if region is a county
          if (location.region && isKenyanCounty(location.region)) {
            location.county = location.region;
          }
          // Try to map city to county
          else if (location.city) {
            location.county =
              getCountyFromCity(location.city) || location.region;
          }
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
