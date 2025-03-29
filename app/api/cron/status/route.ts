import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Verify the request is authorized
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Import the cron service to check if it's initialized
  const { cronJobsInitialized } = require("@/lib/cron-service");

  return NextResponse.json({
    status: "ok",
    cronJobsInitialized: !!cronJobsInitialized,
    timestamp: new Date().toISOString(),
  });
}
