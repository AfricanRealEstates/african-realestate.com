import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addDays, differenceInDays } from "date-fns";
import { sendPropertyExpiringEmail } from "@/lib/email-service";

// Days before expiration to send reminder emails
const REMINDER_DAYS = [7, 3, 1]; // 1 week, 3 days, and 1 day before expiration

export async function GET() {
  try {
    const now = new Date();
    let emailsSent = 0;

    // For each reminder day, find properties that will expire in exactly that many days
    for (const days of REMINDER_DAYS) {
      const targetDate = addDays(now, days);

      // Set time to end of day to include all properties expiring that day
      targetDate.setHours(23, 59, 59, 999);
      const startOfTargetDay = new Date(targetDate);
      startOfTargetDay.setHours(0, 0, 0, 0);

      // Find properties expiring on the target date
      const expiringProperties = await prisma.property.findMany({
        where: {
          isActive: true,
          expiryDate: {
            gte: startOfTargetDay,
            lte: targetDate,
          },
        },
        select: {
          id: true,
          title: true,
          expiryDate: true,
        },
      });

      console.log(
        `Found ${expiringProperties.length} properties expiring in ${days} days`
      );

      // Send reminder emails for each property
      for (const property of expiringProperties) {
        if (property.expiryDate) {
          // Calculate exact days remaining for more accurate messaging
          const exactDaysRemaining = differenceInDays(
            new Date(property.expiryDate),
            now
          );
          const sent = await sendPropertyExpiringEmail(
            property.id,
            exactDaysRemaining
          );
          if (sent) emailsSent++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      emailsSent,
      message: `Sent ${emailsSent} expiration reminder emails`,
    });
  } catch (error) {
    console.error("Error checking expiring properties:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check expiring properties" },
      { status: 500 }
    );
  }
}
