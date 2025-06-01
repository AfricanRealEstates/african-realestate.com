interface EmailTemplateData {
  agentName: string;
  propertyTitle: string;
  propertyId: string;
  propertyType?: string;
  location?: string;
  price?: number;
  currency?: string;
  isActive: boolean;
  daysInactive?: number;
  viewCount?: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string | ((data: EmailTemplateData) => string);
  generateContent: (data: EmailTemplateData) => string;
  description: string;
  category: "activation" | "engagement" | "feedback" | "marketing" | "support";
}

const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const getEmailHeader = () => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
        African Real Estate
      </h1>
      <p style="color: #e8f0fe; margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">
        Your Premier Property Platform
      </p>
    </div>
`;

const getEmailFooter = () => `
    <div style="background-color: #f8fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
      <div style="margin-bottom: 20px;">
        <a href="https://www.african-realestate.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
          Visit Your Dashboard
        </a>
      </div>
      <div style="font-size: 12px; color: #64748b; line-height: 1.5;">
        <p style="margin: 0 0 8px 0;">© ${new Date().getFullYear()} African Real Estate. All rights reserved.</p>
        <p style="margin: 0 0 8px 0;">
          <a href="mailto:support@african-realestate.com" style="color: #667eea; text-decoration: none;">support@african-realestate.com</a> | 
          <a href="https://www.african-realestate.com/guides" style="color: #667eea; text-decoration: none;">Help Center</a>
        </p>
        <p style="margin: 0; font-size: 11px; color: #94a3b8;">
          You're receiving this email because you have a property listed on African Real Estate.
        </p>
      </div>
    </div>
  </div>
`;

export const emailTemplates: EmailTemplate[] = [
  {
    id: "property-activation-urgent",
    name: "Property Activation - Urgent",
    subject: (data: EmailTemplateData) =>
      `🚨 Action Required: Activate "${data.propertyTitle}" to Start Getting Inquiries`,
    description: "Urgent activation request for inactive properties",
    category: "activation",
    generateContent: (data) => `
      ${getEmailHeader()}
      <div style="padding: 30px 20px;">
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #92400e; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">
            ⚠️ Your Property Needs Immediate Attention
          </h2>
          <p style="color: #92400e; margin: 0; font-size: 14px;">
            Your listing is currently inactive and invisible to potential buyers/renters.
          </p>
        </div>

        <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">
          Hello ${data.agentName},
        </h2>

        <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
          We noticed that your property <strong>"${data.propertyTitle}"</strong> has been inactive for ${data.daysInactive || "several"} days. 
          This means potential buyers and renters can't see your listing, and you're missing out on valuable inquiries.
        </p>

        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #334155; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
            📊 What You're Missing:
          </h3>
          <ul style="color: #475569; margin: 0; padding-left: 20px; line-height: 1.6;">
            <li>Potential inquiries from interested buyers/renters</li>
            <li>Increased visibility in search results</li>
            <li>Higher chances of quick property sale/rental</li>
            <li>Access to our premium marketing features</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://www.african-realestate.com/dashboard/properties" 
             style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
            🚀 Activate Your Property Now
          </a>
        </div>

        <p style="color: #475569; line-height: 1.6; margin: 20px 0 0 0; font-size: 14px;">
          Need help? Our support team is here to assist you. Simply reply to this email or contact us at 
          <a href="mailto:support@african-realestate.com" style="color: #667eea;">support@african-realestate.com</a>.
        </p>
      </div>
      ${getEmailFooter()}
    `,
  },

  {
    id: "property-optimization",
    name: "Property Listing Optimization",
    subject: (data) =>
      `💡 Boost Your Property's Performance: "${data.propertyTitle}"`,
    description: "Suggestions to improve property listing performance",
    category: "engagement",
    generateContent: (data) => `
      ${getEmailHeader()}
      <div style="padding: 30px 20px;">
        <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">
          Hello ${data.agentName},
        </h2>

        <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
          Your property <strong>"${data.propertyTitle}"</strong> is live on our platform! 
          ${data.viewCount ? `It has received ${data.viewCount} views so far.` : ""} 
          Here are some tips to maximize its potential and attract more qualified leads.
        </p>

        <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
            🎯 Optimization Checklist
          </h3>
          
          <div style="color: #1e40af;">
            <div style="margin-bottom: 12px;">
              <strong>📸 Photos (Most Important):</strong>
              <ul style="margin: 5px 0 0 20px; line-height: 1.5;">
                <li>Add 8-12 high-quality, well-lit photos</li>
                <li>Include exterior, interior, and neighborhood shots</li>
                <li>Ensure the first photo is your best one</li>
              </ul>
            </div>
            
            <div style="margin-bottom: 12px;">
              <strong>📝 Description:</strong>
              <ul style="margin: 5px 0 0 20px; line-height: 1.5;">
                <li>Highlight unique features and amenities</li>
                <li>Mention nearby schools, shopping, transport</li>
                <li>Use descriptive, engaging language</li>
              </ul>
            </div>
            
            <div style="margin-bottom: 12px;">
              <strong>💰 Pricing:</strong>
              <ul style="margin: 5px 0 0 20px; line-height: 1.5;">
                <li>Research comparable properties in your area</li>
                <li>Consider market conditions and property condition</li>
                <li>Be competitive but realistic</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
            💡 Pro Tip
          </h3>
          <p style="color: #166534; margin: 0; line-height: 1.5;">
            Properties with complete information and 8+ photos receive 3x more inquiries than basic listings!
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://www.african-realestate.com/dashboard/properties/${data.propertyId}/edit" 
             style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            ✏️ Update Your Listing
          </a>
        </div>
      </div>
      ${getEmailFooter()}
    `,
  },

  {
    id: "market-insights",
    name: "Market Insights & Tips",
    subject: (data) =>
      `📈 Market Update: How to Price "${data.propertyTitle}" Competitively`,
    description: "Market insights and pricing guidance",
    category: "marketing",
    generateContent: (data) => `
      ${getEmailHeader()}
      <div style="padding: 30px 20px;">
        <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">
          Hello ${data.agentName},
        </h2>

        <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
          The real estate market is constantly evolving. Here's what's happening in your area and how it affects 
          your property <strong>"${data.propertyTitle}"</strong>${data.location ? ` in ${data.location}` : ""}.
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 25px 0;">
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #92400e;">📊</div>
            <div style="font-size: 12px; color: #92400e; margin-top: 5px;">Market Activity</div>
            <div style="font-size: 14px; color: #92400e; font-weight: 600;">High Demand</div>
          </div>
          <div style="background-color: #dcfce7; padding: 15px; border-radius: 8px; text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #166534;">💰</div>
            <div style="font-size: 12px; color: #166534; margin-top: 5px;">Price Trends</div>
            <div style="font-size: 14px; color: #166534; font-weight: 600;">Stable Growth</div>
          </div>
        </div>

        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #334155; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
            🎯 Recommendations for Your Property:
          </h3>
          <ul style="color: #475569; margin: 0; padding-left: 20px; line-height: 1.6;">
            <li><strong>Pricing:</strong> ${data.price ? `Your current price of ${formatPrice(data.price, data.currency || "USD")} appears competitive` : "Consider researching comparable properties for optimal pricing"}</li>
            <li><strong>Timing:</strong> Current market conditions favor sellers/landlords</li>
            <li><strong>Marketing:</strong> Highlight unique features that set your property apart</li>
            <li><strong>Presentation:</strong> Professional photos can increase inquiries by 40%</li>
          </ul>
        </div>

        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
            🔥 Hot Tip
          </h3>
          <p style="color: #92400e; margin: 0; line-height: 1.5;">
            Properties that respond to inquiries within 1 hour are 7x more likely to convert leads into viewings!
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://www.african-realestate.com/dashboard/analytics" 
             style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            📊 View Your Analytics
          </a>
        </div>
      </div>
      ${getEmailFooter()}
    `,
  },

  {
    id: "feedback-request",
    name: "Platform Feedback Request",
    subject: (data) =>
      `🌟 Help Us Improve: Your Experience with African Real Estate`,
    description: "Request feedback on platform experience",
    category: "feedback",
    generateContent: (data) => `
      ${getEmailHeader()}
      <div style="padding: 30px 20px;">
        <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">
          Hello ${data.agentName},
        </h2>

        <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
          Thank you for choosing African Real Estate for your property <strong>"${data.propertyTitle}"</strong>. 
          Your success is our success, and we're constantly working to improve our platform based on feedback from valued users like you.
        </p>

        <div style="background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); border-left: 4px solid #6366f1; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #3730a3; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
            💭 We'd Love Your Input On:
          </h3>
          <ul style="color: #3730a3; margin: 0; padding-left: 20px; line-height: 1.6;">
            <li>How easy was it to list your property?</li>
            <li>Are you satisfied with the inquiry quality?</li>
            <li>What features would help you sell/rent faster?</li>
            <li>How can we improve our communication?</li>
            <li>Overall platform experience (1-10 rating)</li>
          </ul>
        </div>

        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
            🎁 Thank You Gift
          </h3>
          <p style="color: #166534; margin: 0; line-height: 1.5;">
            Complete our 2-minute feedback survey and receive a 20% discount on your next property listing upgrade!
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://www.african-realestate.com/feedback?property=${data.propertyId}" 
             style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin-right: 10px;">
            📝 Share Feedback (2 min)
          </a>
          <a href="mailto:feedback@african-realestate.com?subject=Feedback for ${data.propertyTitle}" 
             style="display: inline-block; background: transparent; color: #667eea; padding: 15px 30px; text-decoration: none; border: 2px solid #667eea; border-radius: 8px; font-weight: 600; font-size: 16px;">
            📧 Email Us Directly
          </a>
        </div>

        <p style="color: #475569; line-height: 1.6; margin: 20px 0 0 0; font-size: 14px; text-align: center; font-style: italic;">
          Your feedback helps us serve you better and improve the experience for all property owners on our platform.
        </p>
      </div>
      ${getEmailFooter()}
    `,
  },

  {
    id: "success-celebration",
    name: "Property Success Celebration",
    subject: (data) =>
      `🎉 Congratulations! "${data.propertyTitle}" is Performing Great`,
    description:
      "Celebrate property performance and encourage continued engagement",
    category: "engagement",
    generateContent: (data) => `
      ${getEmailHeader()}
      <div style="padding: 30px 20px;">
        <div style="text-align: center; margin-bottom: 25px;">
          <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
          <h2 style="color: #1e293b; margin: 0; font-size: 24px; font-weight: 700;">
            Congratulations, ${data.agentName}!
          </h2>
        </div>

        <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px; text-align: center;">
          Your property <strong>"${data.propertyTitle}"</strong> is performing exceptionally well on our platform!
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 25px 0;">
          <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 20px; border-radius: 8px; text-align: center;">
            <div style="font-size: 28px; font-weight: 700; color: #166534;">${data.viewCount || "50+"}</div>
            <div style="font-size: 12px; color: #166534; margin-top: 5px;">Total Views</div>
          </div>
          <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 20px; border-radius: 8px; text-align: center;">
            <div style="font-size: 28px; font-weight: 700; color: #1e40af;">⭐</div>
            <div style="font-size: 12px; color: #1e40af; margin-top: 5px;">High Interest</div>
          </div>
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 8px; text-align: center;">
            <div style="font-size: 28px; font-weight: 700; color: #92400e;">🚀</div>
            <div style="font-size: 12px; color: #92400e; margin-top: 5px;">Trending</div>
          </div>
        </div>

        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #334155; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
            🌟 Keep the Momentum Going:
          </h3>
          <ul style="color: #475569; margin: 0; padding-left: 20px; line-height: 1.6;">
            <li>Respond quickly to inquiries (within 1 hour if possible)</li>
            <li>Consider adding a virtual tour or video walkthrough</li>
            <li>Update your listing with any new features or improvements</li>
            <li>Share your listing on social media for even more exposure</li>
          </ul>
        </div>

        <div style="background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); border-left: 4px solid #6366f1; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #3730a3; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
            💡 Pro Tip
          </h3>
          <p style="color: #3730a3; margin: 0; line-height: 1.5;">
            Consider upgrading to our Premium listing to get even more visibility and advanced features!
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://www.african-realestate.com/dashboard/properties/${data.propertyId}" 
             style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            📊 View Detailed Analytics
          </a>
        </div>
      </div>
      ${getEmailFooter()}
    `,
  },

  {
    id: "support-assistance",
    name: "Support & Assistance Offer",
    subject: (data) =>
      `🤝 Need Help with "${data.propertyTitle}"? We're Here for You`,
    description: "Offer support and assistance to property owners",
    category: "support",
    generateContent: (data) => `
      ${getEmailHeader()}
      <div style="padding: 30px 20px;">
        <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">
          Hello ${data.agentName},
        </h2>

        <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
          We noticed you might need some assistance with your property listing <strong>"${data.propertyTitle}"</strong>. 
          Our dedicated support team is here to help you succeed!
        </p>

        <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
            🛠️ How We Can Help:
          </h3>
          <ul style="color: #1e40af; margin: 0; padding-left: 20px; line-height: 1.6;">
            <li><strong>Listing Optimization:</strong> Professional advice on photos, descriptions, and pricing</li>
            <li><strong>Marketing Strategy:</strong> Tips to increase visibility and attract quality leads</li>
            <li><strong>Technical Support:</strong> Help with platform features and tools</li>
            <li><strong>Market Insights:</strong> Local market data and pricing recommendations</li>
            <li><strong>Lead Management:</strong> Best practices for handling inquiries</li>
          </ul>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 25px 0;">
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; text-align: center;">
            <div style="font-size: 24px; margin-bottom: 8px;">📞</div>
            <div style="font-size: 14px; color: #166534; font-weight: 600;">Phone Support</div>
            <div style="font-size: 12px; color: #166534;">Mon-Fri, 9AM-6PM</div>
          </div>
          <div style="background-color: #fef3c7; border: 1px solid #fde68a; padding: 15px; border-radius: 8px; text-align: center;">
            <div style="font-size: 24px; margin-bottom: 8px;">💬</div>
            <div style="font-size: 14px; color: #92400e; font-weight: 600;">Live Chat</div>
            <div style="font-size: 12px; color: #92400e;">Available 24/7</div>
          </div>
        </div>

        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #334155; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
            📚 Free Resources Available:
          </h3>
          <ul style="color: #475569; margin: 0; padding-left: 20px; line-height: 1.6;">
            <li>Property Photography Guide</li>
            <li>Writing Compelling Descriptions</li>
            <li>Pricing Your Property Right</li>
            <li>Handling Inquiries Effectively</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://www.african-realestate.com/support" 
             style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin-right: 10px;">
            🤝 Get Free Support
          </a>
          <a href="mailto:support@african-realestate.com?subject=Help with ${data.propertyTitle}" 
             style="display: inline-block; background: transparent; color: #667eea; padding: 15px 30px; text-decoration: none; border: 2px solid #667eea; border-radius: 8px; font-weight: 600; font-size: 16px;">
            📧 Email Support
          </a>
        </div>

        <p style="color: #475569; line-height: 1.6; margin: 20px 0 0 0; font-size: 14px; text-align: center; font-style: italic;">
          Remember, your success is our success. We're committed to helping you achieve your property goals!
        </p>
      </div>
      ${getEmailFooter()}
    `,
  },
];

export const getTemplateById = (id: string): EmailTemplate | undefined => {
  return emailTemplates.find((template) => template.id === id);
};

export const getTemplatesByCategory = (
  category: EmailTemplate["category"]
): EmailTemplate[] => {
  return emailTemplates.filter((template) => template.category === category);
};
