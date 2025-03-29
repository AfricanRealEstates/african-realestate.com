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

    // Format the message with proper HTML
    const htmlMessage = message.replace(/\n/g, "<br />");

    const data = await resend.emails.send({
      from: "African Real Estate <support@african-realestate.com>",
      to: [agentEmail],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 3px solid #4f46e5;">
            <h1 style="color: #4f46e5; margin: 0;">African Real Estate</h1>
          </div>
          <div style="padding: 20px; background-color: white;">
            <div style="line-height: 1.6;">
              ${htmlMessage}
            </div>
          </div>
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #6c757d;">
            <p>© ${new Date().getFullYear()} African Real Estate. All rights reserved.</p>
            <p>If you have any questions, please contact our support team at support@african-realestate.com</p>
          </div>
        </div>
      `,
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: "Failed to send email",
    };
  }
}

export async function togglePropertyStatus(propertyId: string) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    // Get current property
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return {
        success: false,
        message: "Property not found",
      };
    }

    // Toggle the isActive status
    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: { isActive: !property.isActive },
    });

    // Revalidate the properties page to reflect the changes
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
