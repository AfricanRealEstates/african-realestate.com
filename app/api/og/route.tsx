import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get property details from URL params
    const title = searchParams.get("title") || "Property Listing";
    const price = searchParams.get("price") || "0";
    const currency = searchParams.get("currency") || "KES";
    const location = searchParams.get("location") || "Kenya";
    const bedrooms = searchParams.get("bedrooms") || "0";
    const bathrooms = searchParams.get("bathrooms") || "0";
    const imageUrl = searchParams.get("imageUrl") || "";
    const propertyType = searchParams.get("propertyType") || "Residential";

    // Format price with commas
    const formattedPrice = Number.parseInt(price).toLocaleString();

    // Fetch the property image
    let imageData;
    if (imageUrl) {
      const imageResp = await fetch(imageUrl);
      imageData = await imageResp.arrayBuffer();
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            padding: "40px",
            fontFamily: "Calibri, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb",
            }}
          >
            {/* Header with logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "16px 24px",
                borderBottom: "1px solid #e5e7eb",
                backgroundColor: "#f9fafb",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#4f46e5",
                }}
              >
                African Real Estate
              </div>
            </div>

            {/* Image section */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "300px",
                backgroundColor: "#f3f4f6",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {imageData ? (
                <img
                  src={(imageData as unknown as string) || "/placeholder.svg"}
                  alt={title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#e5e7eb",
                    color: "#6b7280",
                    fontSize: "18px",
                  }}
                >
                  Property Image
                </div>
              )}

              {/* Property type badge */}
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  backgroundColor: "rgba(79, 70, 229, 0.9)",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "9999px",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {propertyType}
              </div>
            </div>

            {/* Property details */}
            <div
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {/* Title */}
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#111827",
                }}
              >
                {title}
              </div>

              {/* Price */}
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#4f46e5",
                }}
              >
                {currency} {formattedPrice}
              </div>

              {/* Location */}
              <div
                style={{
                  fontSize: "18px",
                  color: "#4b5563",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                    stroke="#4b5563"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z"
                    stroke="#4b5563"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {location}
              </div>

              {/* Features */}
              <div
                style={{
                  display: "flex",
                  gap: "24px",
                  marginTop: "8px",
                }}
              >
                {/* Bedrooms */}
                {bedrooms && Number.parseInt(bedrooms) > 0 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 21V7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V21"
                        stroke="#4f46e5"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 11H21"
                        stroke="#4f46e5"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5 5V3"
                        stroke="#4f46e5"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19 5V3"
                        stroke="#4f46e5"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 17H21"
                        stroke="#4f46e5"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span style={{ color: "#4b5563", fontSize: "16px" }}>
                      {bedrooms} Beds
                    </span>
                  </div>
                )}

                {/* Bathrooms */}
                {bathrooms && Number.parseInt(bathrooms) > 0 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 12H20"
                        stroke="#4f46e5"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 12V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V12"
                        stroke="#4f46e5"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6 12V6C6 4.89543 6.89543 4 8 4H16C17.1046 4 18 4.89543 18 6V12"
                        stroke="#4f46e5"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6 16H18"
                        stroke="#4f46e5"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span style={{ color: "#4b5563", fontSize: "16px" }}>
                      {bathrooms} Baths
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                marginTop: "auto",
                padding: "16px 24px",
                borderTop: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#f9fafb",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                www.african-realestate.com
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                Scan QR code to view property
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
