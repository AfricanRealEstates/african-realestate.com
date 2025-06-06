"use server";

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

type Property = {
  id: string;
  title: string;
  propertyNumber: number;
  status: string;
  isActive: boolean;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
  };
};

type SearchPropertiesParams = {
  term: string;
  status: "active" | "inactive";
  role: string;
  propertyNumberFrom?: number;
  propertyNumberTo?: number;
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

export async function searchPropertiesByRole({
  term,
  status,
  role,
  propertyNumberFrom,
  propertyNumberTo,
}: SearchPropertiesParams) {
  try {
    const isActive = status === "active";

    // Build the where clause
    const whereClause: any = {
      isActive,
    };

    // Add search term conditions
    if (term) {
      whereClause.OR = [
        {
          title: {
            contains: term,
            mode: "insensitive",
          },
        },
        {
          propertyNumber: {
            equals: Number.parseInt(term) || undefined,
          },
        },
        {
          user: {
            name: {
              contains: term,
              mode: "insensitive",
            },
          },
        },
        {
          user: {
            email: {
              contains: term,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    // Add role filter if not "all"
    if (role !== "all") {
      whereClause.user = {
        ...whereClause.user,
        role: role,
      };
    }

    // Add property number range filter
    if (propertyNumberFrom || propertyNumberTo) {
      const propertyNumberFilter: any = {};

      if (propertyNumberFrom) {
        propertyNumberFilter.gte = propertyNumberFrom;
      }

      if (propertyNumberTo) {
        propertyNumberFilter.lte = propertyNumberTo;
      }

      whereClause.propertyNumber = propertyNumberFilter;
    }

    const properties = await prisma.property.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 50, // Limit results
    });

    return properties;
  } catch (error) {
    console.error("Error searching properties by role:", error);
    throw new Error("Failed to search properties");
  }
}

export async function getMarketingEmailHistory(type?: string) {
  try {
    const whereClause = type ? { type } : {};

    const emails = await prisma.marketingEmail.findMany({
      where: whereClause,
      include: {
        property: {
          select: {
            title: true,
            propertyNumber: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        sentAt: "desc",
      },
      take: 100, // Limit to last 100 emails
    });

    return emails;
  } catch (error) {
    console.error("Error fetching marketing email history:", error);
    throw new Error("Failed to fetch email history");
  }
}

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

      // Skip if user doesn't have an email
      if (!user.email) {
        console.warn(`Skipping property ${propertyNumber} - user has no email`);
        return null;
      }

      // Create email subject based on the type
      const subject =
        type === "active-property"
          ? `🏡 Exciting Updates for Your Property #${propertyNumber} - African Real Estate`
          : `🚀 Reactivate Your Property #${propertyNumber} - New Opportunities Await!`;

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

      // Enhanced HTML email template with modern design
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>African Real Estate</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px 20px; text-align: center; }
            .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .tagline { color: #e0e7ff; font-size: 14px; }
            .content { padding: 40px 30px; }
            .greeting { font-size: 24px; font-weight: 600; color: #1f2937; margin-bottom: 20px; }
            .property-info { background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #3b82f6; }
            .property-title { font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 5px; }
            .property-number { color: #6b7280; font-size: 14px; }
            .message-content { background-color: #f8fafc; padding: 25px; border-radius: 12px; margin: 25px 0; line-height: 1.6; color: #374151; }
            .cta-section { text-align: center; margin: 30px 0; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3); }
            .role-badge { display: inline-block; background: ${user.role === "AGENT" ? "#dbeafe" : user.role === "AGENCY" ? "#f3e8ff" : "#f3f4f6"}; color: ${user.role === "AGENT" ? "#1e40af" : user.role === "AGENCY" ? "#7c3aed" : "#374151"}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin: 10px 0; }
            .stats { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 20px; border-radius: 12px; margin: 25px 0; }
            .footer { background-color: #1f2937; color: #9ca3af; padding: 30px; text-align: center; }
            @media (max-width: 600px) {
              .content { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <div class="logo">African Real Estate</div>
              <div class="tagline">Connecting Africa Through Premium Real Estate</div>
            </div>

            <!-- Main Content -->
            <div class="content">
              <div class="greeting">Hello ${user.name || "Property Owner"}! 👋</div>
              
              <div class="role-badge">
                ${user.role === "AGENT" ? "👤 Agent" : user.role === "AGENCY" ? "🏢 Agency" : "👥 Property Owner"}
              </div>
              
              <div class="property-info">
                <div class="property-title">📍 ${title}</div>
                <div class="property-number">Property #${propertyNumber}</div>
              </div>

              <div class="message-content">
                ${emailContent.replace(/\n/g, "<br>")}
              </div>

              <!-- Platform Stats -->
              <div class="stats">
                <h3 style="text-align: center; color: #059669; margin-bottom: 20px;">🚀 African Real Estate Platform Impact</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; text-align: center;">
                  <div>
                    <div style="font-size: 24px; font-weight: bold; color: #059669;">50K+</div>
                    <div style="font-size: 12px; color: #6b7280;">Verified Buyers</div>
                  </div>
                  <div>
                    <div style="font-size: 24px; font-weight: bold; color: #059669;">8+</div>
                    <div style="font-size: 12px; color: #6b7280;">Years Experience</div>
                  </div>
                </div>
              </div>

              <!-- Call to Action -->
              <div class="cta-section">
                <a href="https://www.african-real-estate.com/dashboard?utm_source=email&utm_medium=marketing&utm_campaign=${type}" class="cta-button">
                  🚀 Access Your Dashboard
                </a>
                <p style="margin-top: 15px; color: #6b7280; font-size: 14px;">
                  Manage your property, view analytics, and connect with buyers
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <div style="font-size: 18px; font-weight: 600; margin-bottom: 10px;">African Real Estate</div>
              <div style="margin-bottom: 20px;">Transforming African Real Estate Markets</div>
              
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #374151; font-size: 12px;">
                <p>© ${new Date().getFullYear()} African Real Estate. All rights reserved.</p>
                <p>
                  <a href="https://www.african-realestate.com/privacy" style="color: #9ca3af;">Privacy Policy</a> | 
                  <a href="https://www.african-realestate.com/terms" style="color: #9ca3af;">Terms of Service</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      // Send the email
      const emailResult = await resend.emails.send({
        from: fromEmail,
        to: user.email,
        subject: subject,
        html: htmlContent,
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

    // Wait for all emails to be sent (filter out null results)
    const results = await Promise.all(emailPromises);
    const successfulEmails = results.filter((result) => result !== null);

    // Log the activity
    console.log(
      `Sent ${type} marketing emails to ${successfulEmails.length} property owners`
    );

    return { success: true, count: successfulEmails.length };
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
    // First, get the sender to find its email
    const sender = await prisma.emailSender.findUnique({
      where: { id },
    });

    if (sender) {
      // Update any templates using this sender to remove the sender reference
      await prisma.emailTemplate.updateMany({
        where: {
          senderEmail: sender.email,
        },
        data: {
          senderEmail: null,
        },
      });
    }

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

// Get email statistics
export async function getEmailStatistics() {
  try {
    const [
      totalEmails,
      activePropertyEmails,
      inactivePropertyEmails,
      recentEmails,
    ] = await Promise.all([
      prisma.marketingEmail.count(),
      prisma.marketingEmail.count({
        where: { type: "active-property" },
      }),
      prisma.marketingEmail.count({
        where: { type: "inactive-property" },
      }),
      prisma.marketingEmail.count({
        where: {
          sentAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
    ]);

    return {
      totalEmails,
      activePropertyEmails,
      inactivePropertyEmails,
      recentEmails,
    };
  } catch (error) {
    console.error("Error fetching email statistics:", error);
    throw new Error("Failed to fetch email statistics");
  }
}
