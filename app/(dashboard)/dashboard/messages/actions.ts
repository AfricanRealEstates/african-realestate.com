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
  senderEmail?: string;
};

type EmailSender = {
  id: string;
  email: string;
  displayName: string;
  isActive: boolean;
};

export async function sendMarketingEmail({
  properties,
  message,
  templateId,
  type,
  senderEmail,
}: SendEmailParams) {
  try {
    // Initialize Resend with your API key
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Get the template if templateId is provided
    let template = null;
    if (templateId !== "custom") {
      template = await prisma.emailTemplate.findUnique({
        where: { id: templateId },
      });
    }

    // Get the sender information if senderEmail is provided
    let sender = null;
    if (senderEmail) {
      sender = await prisma.emailSender.findFirst({
        where: { email: senderEmail, isActive: true },
      });
    }

    // If no specific sender is provided, use the default sender
    const fromEmail = sender
      ? `${sender.displayName} <${sender.email}>`
      : `African Real Estate <noreply@african-realestate.com>`;

    // Send emails to each property owner
    const emailPromises = properties.map(async (property) => {
      const { user, title, propertyNumber } = property;

      // Create email subject based on the type
      const subject =
        type === "active-property"
          ? `Marketing Update for Your Property #${propertyNumber}`
          : `Reactivate Your Property #${propertyNumber}`;

      // Prepare the email content
      let emailContent = message;

      // If a template is provided, use it and replace placeholders
      if (template) {
        emailContent = template.content
          .replace(/{userName}/g, user.name || "Property Owner")
          .replace(/{propertyTitle}/g, title)
          .replace(/{propertyNumber}/g, propertyNumber.toString())
          .replace(/{message}/g, message);
      }

      // Send the email
      const emailResult = await resend.emails.send({
        from: fromEmail,
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
                ${emailContent}
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
          message: emailContent,
          type,
          senderEmail: sender?.email || null,
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
  targetRole?: string;
  senderEmail?: string;
}) {
  try {
    const { name, content, type, isDefault, targetRole, senderEmail } = data;

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
        targetRole,
        senderEmail,
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
    targetRole?: string;
    senderEmail?: string;
  }
) {
  try {
    const { name, content, type, isDefault, targetRole, senderEmail } = data;

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
        targetRole,
        senderEmail,
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

// Email Sender functions
export async function getEmailSenders() {
  try {
    const senders = await prisma.emailSender.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return senders;
  } catch (error) {
    console.error("Error fetching email senders:", error);
    throw new Error("Failed to fetch email senders");
  }
}

export async function createEmailSender(data: {
  email: string;
  displayName: string;
  isActive: boolean;
}) {
  try {
    const { email, displayName, isActive } = data;

    const sender = await prisma.emailSender.create({
      data: {
        email,
        displayName,
        isActive,
      },
    });

    return sender;
  } catch (error) {
    console.error("Error creating email sender:", error);
    throw new Error("Failed to create email sender");
  }
}

export async function updateEmailSender(
  id: string,
  data: {
    email: string;
    displayName: string;
    isActive: boolean;
  }
) {
  try {
    const { email, displayName, isActive } = data;

    const sender = await prisma.emailSender.update({
      where: { id },
      data: {
        email,
        displayName,
        isActive,
        updatedAt: new Date(),
      },
    });

    return sender;
  } catch (error) {
    console.error("Error updating email sender:", error);
    throw new Error("Failed to update email sender");
  }
}

export async function deleteEmailSender(id: string) {
  try {
    // First, update any templates using this sender to remove the sender reference
    await prisma.emailTemplate.updateMany({
      where: {
        senderEmail: {
          equals: (await prisma.emailSender.findUnique({ where: { id } }))
            ?.email,
        },
      },
      data: {
        senderEmail: null,
      },
    });

    // Then delete the sender
    await prisma.emailSender.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting email sender:", error);
    throw new Error("Failed to delete email sender");
  }
}
