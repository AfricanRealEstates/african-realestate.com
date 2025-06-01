"use server";

import { auth } from "@/auth";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  propertyId: string;
  agentEmail: string;
  agentName: string;
  subject: string;
  message: string;
}

export async function sendEmailToAgent({
  propertyId,
  agentEmail,
  agentName,
  subject,
  message,
}: SendEmailParams) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Validate email parameters
    if (!agentEmail || !subject || !message) {
      return {
        success: false,
        error: "Missing required email parameters",
      };
    }

    // Send email with improved HTML content
    const data = await resend.emails.send({
      from: "African Real Estate <support@african-real-estate.com>",
      to: [agentEmail],
      subject: subject,
      html: message, // The message now contains full HTML from templates
      // Add text fallback for better deliverability
      text: message.replace(/<[^>]*>/g, "").replace(/\n\s*\n/g, "\n"),
    });

    // Log the email for tracking
    try {
      if (session?.user?.id) {
        await prisma.marketingEmail.create({
          data: {
            propertyId,
            userId: session.user.id, // Now we know this is defined
            message: message,
            type: "admin-communication",
            senderEmail: "support@african-real-estate.com",
          },
        });
      } else {
        console.warn("User ID not available for logging email");
      }
    } catch (logError) {
      console.warn("Failed to log email:", logError);
      // Don't fail the email send if logging fails
    }

    return {
      success: true,
      data,
      messageId: data.data?.id, // Correctly access the id from the Resend response
    };
  } catch (error) {
    console.error("Error sending email:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return {
          success: false,
          error: "Email service configuration error",
        };
      }
      if (error.message.includes("rate limit")) {
        return {
          success: false,
          error: "Too many emails sent. Please try again later.",
        };
      }
    }

    return {
      success: false,
      error: "Failed to send email. Please try again.",
    };
  }
}

// Keep the existing togglePropertyStatus function unchanged
export async function togglePropertyStatus(propertyId: string) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return {
        success: false,
        message: "Property not found",
      };
    }

    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: { isActive: !property.isActive },
    });

    revalidatePath("/dashboard/property-management");

    return {
      success: true,
      message: `Property ${updatedProperty.isActive ? "activated" : "deactivated"} successfully`,
      property: updatedProperty,
    };
  } catch (error) {
    console.error("Error toggling property status:", error);
    return {
      success: false,
      message: "Failed to update property status",
    };
  }
}
