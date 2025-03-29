import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPropertyExpiredEmail } from "@/lib/email-service";

export async function GET() {
  try {
    // Get current date
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
      //   select: {
      //     id: true,
      //     title: true,
      //     userId: true,
      //     expiryDate: true,
      //     coverPhotos: true,
      //   },
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
      return NextResponse.json({
        success: true,
        message: "No newly expired properties found",
      });
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
    let emailsSent = 0;
    for (const property of newlyExpiredProperties) {
      const sent = await sendPropertyExpiredEmail(property.id);
      if (sent) emailsSent++;
    }

    return NextResponse.json({
      success: true,
      deactivated: deactivationResults.length,
      notifications: notifications.length,
      emailsSent,
      message: `Successfully deactivated ${deactivationResults.length} expired properties and sent ${emailsSent} emails`,
    });
  } catch (error) {
    console.error("Error checking expired properties:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check expired properties" },
      { status: 500 }
    );
  }
}
