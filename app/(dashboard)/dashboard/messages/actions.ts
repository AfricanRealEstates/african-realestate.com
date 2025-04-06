"use server";

import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

type Property = {
  id: string;
  title: string;
  propertyNumber: number;
  status: string;
  isActive: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

type SendEmailParams = {
  properties: Property[];
  message: string;
  templateId: string;
  type: "active-property" | "inactive-property";
};

export async function sendMarketingEmail({
  properties,
  message,
  templateId,
  type,
}: SendEmailParams) {
  try {
    // Initialize Resend with your API key
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send emails to each property owner
    const emailPromises = properties.map(async (property) => {
      const { user, title, propertyNumber } = property;

      // Create email subject based on the type
      const subject =
        type === "active-property"
          ? `Marketing Update for Your Property #${propertyNumber}`
          : `Reactivate Your Property #${propertyNumber}`;

      // Send the email
      const emailResult = await resend.emails.send({
        from: `African Real Estate <noreply@african-realestate.com>`,
        to: user.email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
              <img src="https://www.african-realestate.com/logo.png" alt="African Real Estate" style="max-width: 200px;">
            </div>
            <div style="padding: 20px;">
              <h2>Hello ${user.name},</h2>
              <p>Regarding your property: <strong>${title}</strong> (Property #${propertyNumber})</p>
              <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #4a6cf7;">
                ${message}
              </div>
              <p>If you have any questions, please don't hesitate to contact our support team.</p>
              <div style="margin-top: 30px; text-align: center;">
                <a href="https://www.african-realestate.com/dashboard" style="background-color: #4a6cf7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
                  Go to Dashboard
                </a>
              </div>
            </div>
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d;">
              <p>© ${new Date().getFullYear()} African Real Estate. All rights reserved.</p>
              <p>
                <a href="https://www.african-realestate.com/privacy" style="color: #6c757d; margin-right: 10px;">Privacy Policy</a>
                <a href="https://www.african-realestate.com/terms" style="color: #6c757d;">Terms of Service</a>
              </p>
            </div>
          </div>
        `,
      });

      // Log the email in the database
      await prisma.marketingEmail.create({
        data: {
          propertyId: property.id,
          userId: user.id,
          templateId: templateId !== "custom" ? templateId : null,
          message,
          type,
        },
      });

      return emailResult;
    });

    // Wait for all emails to be sent
    await Promise.all(emailPromises);

    // Log the activity
    console.log(
      `Sent ${type} marketing emails to ${properties.length} property owners`
    );

    return { success: true, count: properties.length };
  } catch (error) {
    console.error("Error sending marketing emails:", error);
    throw new Error("Failed to send marketing emails");
  }
}

export async function getEmailTemplates(type?: string) {
  try {
    const whereClause = type ? { type } : {};

    const templates = await prisma.emailTemplate.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    return templates;
  } catch (error) {
    console.error("Error fetching email templates:", error);
    throw new Error("Failed to fetch email templates");
  }
}

export async function createEmailTemplate(data: {
  name: string;
  content: string;
  type: string;
  isDefault?: boolean;
}) {
  try {
    const { name, content, type, isDefault } = data;

    // If this is set as default, unset any existing defaults of this type
    if (isDefault) {
      await prisma.emailTemplate.updateMany({
        where: { type, isDefault: true },
        data: { isDefault: false },
      });
    }

    const template = await prisma.emailTemplate.create({
      data: {
        name,
        content,
        type,
        isDefault: isDefault || false,
      },
    });

    return template;
  } catch (error) {
    console.error("Error creating email template:", error);
    throw new Error("Failed to create email template");
  }
}

export async function updateEmailTemplate(
  id: string,
  data: {
    name: string;
    content: string;
    type: string;
    isDefault?: boolean;
  }
) {
  try {
    const { name, content, type, isDefault } = data;

    // If this is set as default, unset any existing defaults of this type
    if (isDefault) {
      await prisma.emailTemplate.updateMany({
        where: { type, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const template = await prisma.emailTemplate.update({
      where: { id },
      data: {
        name,
        content,
        type,
        isDefault: isDefault || false,
        updatedAt: new Date(),
      },
    });

    return template;
  } catch (error) {
    console.error("Error updating email template:", error);
    throw new Error("Failed to update email template");
  }
}

export async function deleteEmailTemplate(id: string) {
  try {
    await prisma.emailTemplate.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting email template:", error);
    throw new Error("Failed to delete email template");
  }
}
