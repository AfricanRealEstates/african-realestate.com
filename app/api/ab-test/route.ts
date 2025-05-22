import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const testName = searchParams.get("testName");

  if (!testName) {
    return NextResponse.json(
      { error: "Missing testName parameter" },
      { status: 400 }
    );
  }

  const cookieStore = cookies();
  const testCookie = cookieStore.get(`ab_test_${testName}`);

  if (testCookie) {
    return NextResponse.json({ variant: testCookie.value });
  }

  // Assign a random variant if none exists
  const variants = ["A", "B", "C"];
  const randomVariant = variants[Math.floor(Math.random() * variants.length)];

  // Set the cookie
  cookieStore.set(`ab_test_${testName}`, randomVariant, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return NextResponse.json({ variant: randomVariant });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testName, variant, userId, event = "conversion" } = body;

    if (!testName || !variant) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // In a real implementation, you would store this data in your database
    // and/or send it to your analytics service

    // Example: Store in database
    /*
    await prisma.abTestEvent.create({
      data: {
        testName,
        variant,
        userId,
        event,
        timestamp: new Date(),
      },
    })
    */

    // Log for demonstration purposes
    console.log(
      `A/B Test Event: ${event} for test ${testName}, variant ${variant}, user ${userId || "anonymous"}`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing A/B test event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
