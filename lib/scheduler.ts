import cron from "node-cron";
import { prisma } from "./prisma";
import {
  sendPropertyExpiringEmail,
  sendPropertyExpiredEmail,
} from "./email-service";
import { addDays, differenceInDays } from "date-fns";

// Days before expiration to send reminder emails
const REMINDER_DAYS = [7, 3, 1]; // 1 week, 3 days, and 1 day before expiration

export function initScheduler() {
  // Run every day at 8:00 AM
  cron.schedule("0 8 * * *", async () => {
    console.log("Running scheduled task: checking properties for expiration");

    try {
      await checkExpiringProperties();
      await checkExpiredProperties();
    } catch (error) {
      console.error("Error in scheduler:", error);
    }
  });

  console.log("Property expiration scheduler initialized");
}

// Check for properties that will expire soon and send reminder emails
async function checkExpiringProperties() {
  const now = new Date();

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
        await sendPropertyExpiringEmail(property.id, exactDaysRemaining);
      }
    }
  }
}

// Check for properties that have expired today and send expiration emails
async function checkExpiredProperties() {
  const now = new Date();

  // Find properties that expired in the last 24 hours
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  // Find properties that have just expired (in the last 24 hours)
  const newlyExpiredProperties = await prisma.property.findMany({
    where: {
      isActive: true, // Still active but should be deactivated
      expiryDate: {
        gte: yesterday,
        lt: now,
      },
    },
    // select: {
    //   id: true,
    //   title: true,
    //   userId: true,
    //   expiryDate: true,
    //   coverPhotos: true,
    // },
    include: {
      orders: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  console.log(
    `Found ${newlyExpiredProperties.length} newly expired properties`
  );

  if (newlyExpiredProperties.length === 0) {
    return;
  }

  // Deactivate all expired properties
  const deactivationResults = await prisma.$transaction(
    newlyExpiredProperties.map((property) =>
      prisma.property.update({
        where: { id: property.id },
        data: {
          isActive: false,
        },
      })
    )
  );

  // Create notifications for property owners
  const notifications = await prisma.$transaction(
    newlyExpiredProperties.map((property) =>
      prisma.notification.create({
        data: {
          userId: property.userId,
          body: `Your ${property.orders[0]?.tierName || "featured"} listing for "${property.title}" has expired. Renew now to keep it visible!`,
          profilePicture: property.coverPhotos[0] || "",
          propertyId: property.id,
          type: "ACTIVATED", // Using ACTIVATED type but for expiration notification
        },
      })
    )
  );

  // Send expiration emails
  for (const property of newlyExpiredProperties) {
    await sendPropertyExpiredEmail(property.id);
  }

  console.log(
    `Successfully deactivated ${deactivationResults.length} expired properties and sent notifications`
  );
}
