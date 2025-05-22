"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

type Variant = "A" | "B" | "C";
type TestName = "featuredContent" | "propertyLayout" | "callToAction";

// This function must be called from a Server Component or a Server Action
export async function getTestVariant(testName: TestName): Promise<Variant> {
  const cookieStore = cookies();
  const testCookie = cookieStore.get(`ab_test_${testName}`);

  if (testCookie) {
    return testCookie.value as Variant;
  }

  // Assign a random variant if none exists
  const variants: Variant[] = ["A", "B", "C"];
  const randomVariant = variants[Math.floor(Math.random() * variants.length)];

  // We can't set cookies directly here if this is called from a Server Component
  // Instead, we'll return the variant and let the caller handle setting the cookie
  return randomVariant;
}

// This must be called from a Server Action
export async function setTestVariantCookie(
  testName: TestName,
  variant: Variant
) {
  "use server";

  const cookieStore = cookies();
  cookieStore.set(`ab_test_${testName}`, variant, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
}

// This must be called from a Server Action
export async function trackConversion(
  testName: TestName,
  variant: Variant,
  userId?: string
) {
  "use server";

  try {
    // Real implementation: Store the conversion in the database
    await prisma.aBTestConversion.create({
      data: {
        testName,
        variant,
        userId,
        timestamp: new Date(),
      },
    });

    // You could also send this data to an analytics service like Google Analytics,
    // Mixpanel, or a custom analytics endpoint

    // Example of sending to a custom analytics endpoint:
    /*
    await fetch('/api/analytics/conversion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        testName,
        variant,
        userId,
        timestamp: new Date(),
      }),
    })
    */

    return { success: true };
  } catch (error) {
    console.error("Error tracking conversion:", error);
    return { success: false, error };
  }
}
