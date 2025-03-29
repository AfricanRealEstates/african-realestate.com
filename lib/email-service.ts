import { format } from "date-fns";
import { Resend } from "resend";
import { prisma } from "./prisma";
import PropertyExpiringEmail from "@/app/emails/property-expiring";
import PropertyExpiredEmail from "@/app/emails/property-expired";

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender configuration
const emailConfig = {
  from: `African Real Estate <info@african-realestate.com>`,
};

// Send an email notification for a property that will expire soon
export async function sendPropertyExpiringEmail(
  propertyId: string,
  daysRemaining: number
): Promise<boolean> {
  try {
    // Get property details with user information
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orders: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            tierName: true,
            expiryDate: true,
          },
        },
      },
    });

    if (!property || !property.user.email || !property.orders[0]) {
      console.error(
        `Cannot send expiring email: Missing property, user email, or order data for property ${propertyId}`
      );
      return false;
    }

    // Check if we already sent this email recently (within last 24 hours)
    const emailType = `expiring-${daysRemaining}`;
    const recentEmail = await prisma.emailLog.findFirst({
      where: {
        propertyId,
        userId: property.user.id,
        emailType,
        sentAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    });

    if (recentEmail) {
      console.log(
        `Skipping duplicate expiring email for property ${propertyId} (${daysRemaining} days)`
      );
      return false;
    }

    const expiryDate = property.orders[0].expiryDate;
    if (!expiryDate) {
      console.error(
        `Cannot send expiring email: No expiry date for property ${propertyId}`
      );
      return false;
    }

    // Format the expiry date
    const formattedExpiryDate = format(new Date(expiryDate), "MMMM d, yyyy");

    // Generate renewal link
    const renewalLink = `${process.env.NEXT_PUBLIC_APP_URL}/pay?propertyId=${propertyId}&renewal=true`;

    // Send the email using React email template
    const { error } = await resend.emails.send({
      from: emailConfig.from,
      to: property.user.email,
      subject: `Your listing "${property.title}" expires in ${daysRemaining} days`,
      react: PropertyExpiringEmail({
        propertyTitle: property.title,
        propertyId: property.id,
        propertyImage: property.coverPhotos[0] || "",
        daysRemaining,
        tierName: property.orders[0].tierName || "Standard",
        expiryDate: formattedExpiryDate,
        renewalLink,
        recipientName: property.user.name || "Property Owner",
      }),
    });

    if (error) {
      console.error("Error sending expiring email:", error);
      return false;
    }

    // Record that we sent this email in the database
    await prisma.emailLog.create({
      data: {
        propertyId,
        userId: property.user.id,
        emailType,
      },
    });

    console.log(
      `Sent expiring email for property ${propertyId} (${daysRemaining} days)`
    );
    return true;
  } catch (error) {
    console.error("Error in sendPropertyExpiringEmail:", error);
    return false;
  }
}

// Send an email notification for a property that has expired
export async function sendPropertyExpiredEmail(
  propertyId: string
): Promise<boolean> {
  try {
    // Get property details with user information
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orders: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            tierName: true,
            expiryDate: true,
          },
        },
      },
    });

    if (!property || !property.user.email || !property.orders[0]) {
      console.error(
        `Cannot send expired email: Missing property, user email, or order data for property ${propertyId}`
      );
      return false;
    }

    // Check if we already sent this email recently (within last 24 hours)
    const emailType = "expired";
    const recentEmail = await prisma.emailLog.findFirst({
      where: {
        propertyId,
        userId: property.user.id,
        emailType,
        sentAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    });

    if (recentEmail) {
      console.log(
        `Skipping duplicate expired email for property ${propertyId}`
      );
      return false;
    }

    const expiryDate = property.orders[0].expiryDate;
    if (!expiryDate) {
      console.error(
        `Cannot send expired email: No expiry date for property ${propertyId}`
      );
      return false;
    }

    // Format the expiry date
    const formattedExpiryDate = format(new Date(expiryDate), "MMMM d, yyyy");

    // Generate renewal link
    const renewalLink = `${process.env.NEXT_PUBLIC_APP_URL}/pay?propertyId=${propertyId}&renewal=true`;

    // Send the email using React email template
    const { error } = await resend.emails.send({
      from: emailConfig.from,
      to: property.user.email,
      subject: `Your listing "${property.title}" has expired`,
      react: PropertyExpiredEmail({
        propertyTitle: property.title,
        propertyId: property.id,
        propertyImage: property.coverPhotos[0] || "",
        tierName: property.orders[0].tierName || "Standard",
        expiryDate: formattedExpiryDate,
        renewalLink,
        recipientName: property.user.name || "Property Owner",
      }),
    });

    if (error) {
      console.error("Error sending expired email:", error);
      return false;
    }

    // Record that we sent this email in the database
    await prisma.emailLog.create({
      data: {
        propertyId,
        userId: property.user.id,
        emailType,
      },
    });

    console.log(`Sent expired email for property ${propertyId}`);
    return true;
  } catch (error) {
    console.error("Error in sendPropertyExpiredEmail:", error);
    return false;
  }
}
