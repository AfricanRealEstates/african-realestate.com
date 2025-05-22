"use client";

/**
 * Tracks a Google Ads conversion event
 * @param eventName The name of the conversion event to track
 * @param parameters Optional parameters to include with the event
 */
export function trackConversion(
  eventName: string,
  parameters: Record<string, any> = {}
) {
  // Make sure gtag is available
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, parameters);
  } else {
    console.warn("Google Ads tracking not available");
  }
}

// // Add TypeScript declaration for gtag
// declare global {
//   interface Window {
//     gtag: (
//       command: string,
//       action: string,
//       params?: Record<string, any>
//     ) => void;
//   }
// }
