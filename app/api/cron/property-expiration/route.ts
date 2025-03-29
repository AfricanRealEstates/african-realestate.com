import { NextResponse } from "next/server";
import {
  checkExpiredProperties,
  checkExpiringProperties,
} from "@/lib/property-expiration";

export const dynamic = "force-dynamic"; // Correct syntax with hyphen, not underscore

export async function GET(request: Request) {
  try {
    // Verify the request is authorized
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the action from the URL or query params
    const url = new URL(request.url);
    const action = url.searchParams.get("action") || "all";

    // Update the results object definition to use proper types instead of null
    const results: {
      expired: {
        deactivated: number;
        emailsSent: number;
      } | null;
      expiring: {
        emailsSent: number;
      } | null;
    } = {
      expired: null,
      expiring: null,
    };

    // Process based on the requested action
    if (action === "expired" || action === "all") {
      const expiredResult = await checkExpiredProperties();
      results.expired = expiredResult;
      console.log(
        `Processed expired properties: ${expiredResult.deactivated} deactivated, ${expiredResult.emailsSent} emails sent`
      );
    }

    if (action === "expiring" || action === "all") {
      const expiringResult = await checkExpiringProperties();
      results.expiring = expiringResult;
      console.log(
        `Processed expiring properties: ${expiringResult.emailsSent} emails sent`
      );
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error) {
    console.error("Error in property expiration cron job:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
