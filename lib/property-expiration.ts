import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function checkExpiredProperties(): Promise<{
  deactivated: number;
  emailsSent: number;
}> {
  const now = new Date();

  // Find orders that have expired but properties are still active
  const expiredOrders = await prisma.order.findMany({
    where: {
      expiryDate: {
        lt: now,
        not: null, // Only include orders with non-null expiryDate
      },
      property: {
        isActive: true,
      },
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          propertyNumber: true,
          slug: true,
          isActive: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  console.log(`Found ${expiredOrders.length} expired property orders`);

  let deactivated = 0;
  let emailsSent = 0;

  for (const order of expiredOrders) {
    try {
      // Validate required data is present
      if (!validateOrderData(order, "expired")) {
        continue; // Skip this order if validation fails
      }

      // Check if we've already sent an expired email for this property to this user
      const existingLog = await prisma.emailLog.findUnique({
        where: {
          propertyId_userId_emailType: {
            propertyId: order.propertyId,
            userId: order.userId,
            emailType: "expired",
          },
        },
      });

      if (!existingLog) {
        // Send email notification
        await sendExpiredPropertyEmail(order);
        emailsSent++;

        // Log the email
        await prisma.emailLog.create({
          data: {
            propertyId: order.propertyId,
            userId: order.userId,
            emailType: "expired",
          },
        });
      }

      // Deactivate the property
      await prisma.property.update({
        where: { id: order.propertyId },
        data: { isActive: false },
      });

      deactivated++;
    } catch (error) {
      console.error(`Error processing expired order ${order.id}:`, error);
    }
  }

  return { deactivated, emailsSent };
}

export async function checkExpiringProperties(): Promise<{
  emailsSent: number;
}> {
  const now = new Date();
  const sevenDaysFromNow = new Date(now);
  sevenDaysFromNow.setDate(now.getDate() + 7);

  const expiringOrders = await prisma.order.findMany({
    where: {
      expiryDate: {
        gte: now,
        lte: sevenDaysFromNow,
        not: null, // Only include orders with non-null expiryDate
      },
      property: {
        isActive: true,
      },
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          propertyNumber: true,
          slug: true,
          isActive: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  console.log(`Found ${expiringOrders.length} soon-to-expire property orders`);

  let emailsSent = 0;

  for (const order of expiringOrders) {
    try {
      // Validate required data is present
      if (!validateOrderData(order, "expiring")) {
        continue; // Skip this order if validation fails
      }

      // Add null check for expiryDate
      if (!order.expiryDate) {
        console.error(`Order ${order.id} has null expiryDate`);
        continue;
      }

      const daysUntilExpiry = Math.ceil(
        (order.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      let emailType: string;

      // Determine which reminder to send
      if (daysUntilExpiry <= 1) {
        emailType = "expiring-soon-1";
      } else if (daysUntilExpiry <= 3) {
        emailType = "expiring-soon-3";
      } else if (daysUntilExpiry <= 7) {
        emailType = "expiring-soon-7";
      } else {
        continue; // Skip if not within our reminder windows
      }

      // Check if we've already sent this type of reminder for this property to this user
      const existingLog = await prisma.emailLog.findUnique({
        where: {
          propertyId_userId_emailType: {
            propertyId: order.propertyId,
            userId: order.userId,
            emailType,
          },
        },
      });

      if (!existingLog) {
        // Send email notification
        await sendExpiringPropertyEmail(order, daysUntilExpiry);
        emailsSent++;

        // Log the email
        await prisma.emailLog.create({
          data: {
            propertyId: order.propertyId,
            userId: order.userId,
            emailType,
          },
        });
      }
    } catch (error) {
      console.error(`Error processing expiring order ${order.id}:`, error);
    }
  }

  return { emailsSent };
}

// Helper function to validate order data
function validateOrderData(order: any, type: "expired" | "expiring"): boolean {
  // Check if order has all required properties
  if (!order || !order.id || !order.propertyId || !order.userId) {
    console.error(
      `Invalid order data for ${type} check:`,
      JSON.stringify(order, null, 2)
    );
    return false;
  }

  // Check if expiryDate is valid
  if (!order.expiryDate) {
    console.error(`Order ${order.id} has null expiryDate`);
    return false;
  }

  // Check if property data is valid
  if (
    !order.property ||
    !order.property.id ||
    !order.property.title ||
    !order.property.propertyNumber ||
    !order.property.slug
  ) {
    console.error(
      `Cannot send ${type} email: Missing property data for property ${order.propertyId}`
    );
    console.debug("Property data:", JSON.stringify(order.property, null, 2));
    return false;
  }

  // Check if user data is valid
  if (!order.user || !order.user.id || !order.user.email) {
    console.error(
      `Cannot send ${type} email: Missing user data for user ${order.userId}`
    );
    console.debug("User data:", JSON.stringify(order.user, null, 2));
    return false;
  }

  return true;
}

async function sendExpiredPropertyEmail(order: any) {
  const { user, property } = order;

  try {
    // Double-check required data
    if (
      !user ||
      !user.email ||
      !property ||
      !property.title ||
      !property.propertyNumber ||
      !property.slug
    ) {
      console.error(
        `Cannot send expired email: Missing property, user email, or order data for property ${order.propertyId}`
      );
      return null;
    }

    const { data, error } = await resend.emails.send({
      from: `African Real Estate <info@african-realestate.com>`,
      to: [user.email],
      subject: `Your Property Listing Has Expired - ${property.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Property Listing Has Expired</h2>
          <p>Hello ${user.name || "there"},</p>
          <p>Your listing for <strong>${property.title}</strong> (Property #${property.propertyNumber}) has expired and is no longer active on our platform.</p>
          <p>To reactivate your listing and continue showcasing your property to potential buyers, please renew your subscription.</p>
          <div style="margin: 20px 0; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/properties/${property.slug}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Renew Your Listing</a>
          </div>
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          <p>Thank you for choosing African Real Estate for your property needs.</p>
          <p>Best regards,<br>The African Real Estate Team</p>
        </div>
      `,
    });

    if (error) {
      console.error(
        `Failed to send expired property email for property ${property.id}:`,
        error
      );
      throw error;
    }

    return data;
  } catch (error) {
    console.error(
      `Error sending expired email for property ${property?.id || order.propertyId}:`,
      error
    );
    throw error;
  }
}

async function sendExpiringPropertyEmail(order: any, daysRemaining: number) {
  const { user, property } = order;

  try {
    // Double-check required data
    if (
      !user ||
      !user.email ||
      !property ||
      !property.title ||
      !property.propertyNumber ||
      !property.slug
    ) {
      console.error(
        `Cannot send expiring email: Missing property, user email, or order data for property ${order.propertyId}`
      );
      return null;
    }

    const { data, error } = await resend.emails.send({
      from: `African Real Estate <info@african-realestate.com>`,
      to: [user.email],
      subject: `Your Property Listing Will Expire in ${daysRemaining} Day${daysRemaining > 1 ? "s" : ""} - ${property.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Property Listing Will Expire Soon</h2>
          <p>Hello ${user.name || "there"},</p>
          <p>Your listing for <strong>${property.title}</strong> (Property #${property.propertyNumber}) will expire in <strong>${daysRemaining} day${daysRemaining > 1 ? "s" : ""}</strong>.</p>
          <p>To ensure your property remains visible to potential buyers, please renew your subscription before it expires.</p>
          <div style="margin: 20px 0; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/properties/${property.slug}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Renew Your Listing</a>
          </div>
          <p>Benefits of keeping your listing active:</p>
          <ul>
            <li>Continuous exposure to our growing user base</li>
            <li>Increased chances of finding the right buyer</li>
            <li>Access to all premium features</li>
          </ul>
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          <p>Thank you for choosing African Real Estate for your property needs.</p>
          <p>Best regards,<br>The African Real Estate Team</p>
        </div>
      `,
    });

    if (error) {
      console.error(
        `Failed to send expiring property email for property ${property.id}:`,
        error
      );
      throw error;
    }

    return data;
  } catch (error) {
    console.error(
      `Error sending expiring email for property ${property?.id || order.propertyId}:`,
      error
    );
    throw error;
  }
}
