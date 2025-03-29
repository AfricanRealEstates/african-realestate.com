import { prisma } from "./prisma";
import { addDays, differenceInDays } from "date-fns";
import {
  sendPropertyExpiringEmail,
  sendPropertyExpiredEmail,
} from "./email-service";

// Days before expiration to send reminder emails
const REMINDER_DAYS = [7, 3, 1]; // 1 week, 3 days, and 1 day before expiration

// Check for properties that will expire soon and send reminder emails
export async function checkExpiringProperties() {
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

  return { emailsSent };
}

// Check for properties that have expired and deactivate them
export async function checkExpiredProperties() {
  const now = new Date();

  // Find properties that have expired but are still active
  const expiredProperties = await prisma.property.findMany({
    where: {
      isActive: true,
      expiryDate: {
        lt: now,
      },
    },
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
    `Found ${expiredProperties.length} expired properties to deactivate`
  );

  if (expiredProperties.length === 0) {
    return {
      success: true,
      message: "No expired properties found",
      deactivated: 0,
      notifications: 0,
      emailsSent: 0,
    };
  }

  // Deactivate all expired properties
  const deactivationResults = await prisma.$transaction(
    expiredProperties.map((property) =>
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
    expiredProperties.map((property) =>
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
  let emailsSent = 0;
  for (const property of expiredProperties) {
    const sent = await sendPropertyExpiredEmail(property.id);
    if (sent) emailsSent++;
  }

  return {
    success: true,
    deactivated: deactivationResults.length,
    notifications: notifications.length,
    emailsSent,
    message: `Successfully deactivated ${deactivationResults.length} expired properties`,
  };
}
