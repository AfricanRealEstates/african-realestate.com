import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface PropertyExpiringEmailProps {
  propertyTitle: string;
  propertyId: string;
  propertyImage: string;
  daysRemaining: number;
  tierName: string;
  expiryDate: string;
  renewalLink: string;
  recipientName: string;
}

export default function PropertyExpiringEmail({
  propertyTitle,
  propertyId,
  propertyImage,
  daysRemaining,
  tierName,
  expiryDate,
  renewalLink,
  recipientName,
}: PropertyExpiringEmailProps) {
  const previewText = `Your ${tierName} listing for "${propertyTitle}" expires in ${daysRemaining} days`;

  // Determine urgency level based on days remaining
  const isUrgent = daysRemaining <= 3;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/logo.png`}
            width="170"
            height="50"
            alt="African Real Estate"
            style={logo}
          />

          <Heading style={heading}>
            {isUrgent ? "Urgent: " : ""}Your Property Listing is Expiring Soon
          </Heading>

          <Section style={propertySection}>
            <Img
              src={
                propertyImage ||
                `${process.env.NEXT_PUBLIC_APP_URL}/placeholder.svg?height=200&width=300`
              }
              width="300"
              height="200"
              alt={propertyTitle}
              style={propertyImageStyle}
            />
            <Text style={propertyTitleStyle}>{propertyTitle}</Text>
            <Text style={tierBadge(tierName)}>{tierName} Plan</Text>
          </Section>

          <Text style={paragraph}>Hello {recipientName},</Text>

          <Text style={paragraph}>
            Your <strong>{tierName}</strong> listing for &quot;
            <strong>{propertyTitle}</strong>&quot; will expire in{" "}
            <strong style={isUrgent ? { color: "#e11d48" } : {}}>
              {daysRemaining} {daysRemaining === 1 ? "day" : "days"}
            </strong>{" "}
            on {expiryDate}.
          </Text>

          <Text style={paragraph}>
            {isUrgent
              ? "Once your listing expires, it will no longer be visible to potential buyers and will be removed from featured properties. Act now to maintain your listing's visibility!"
              : "We recommend renewing your listing before it expires to maintain continuous visibility to potential buyers."}
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={renewalLink}>
              Renew Your Listing Now
            </Button>
          </Section>

          <Text style={paragraph}>
            If you have any questions or need assistance, please don&apos;t
            hesitate to contact our support team.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            © {new Date().getFullYear()} African Real Estate. All rights
            reserved.
            <br />
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}`} style={link}>
              african-realestate.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styling
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
  borderRadius: "4px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
};

const logo = {
  margin: "0 auto 20px",
  display: "block",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  color: "#333",
  margin: "30px 0",
};

const propertySection = {
  backgroundColor: "#f9f9f9",
  padding: "15px",
  borderRadius: "4px",
  marginBottom: "20px",
  textAlign: "center" as const,
};

const propertyImageStyle = {
  borderRadius: "4px",
  margin: "0 auto",
  display: "block",
  objectFit: "cover" as const,
  maxWidth: "100%",
};

const propertyTitleStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  margin: "10px 0 5px",
};

const tierBadge = (tier: string) => ({
  display: "inline-block",
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "14px",
  fontWeight: "bold",
  backgroundColor:
    tier === "Platinum"
      ? "#e9d5ff"
      : tier === "Diamond"
        ? "#dbeafe"
        : "#fef9c3",
  color:
    tier === "Platinum"
      ? "#7e22ce"
      : tier === "Diamond"
        ? "#1e40af"
        : "#854d0e",
  margin: "5px 0 15px",
});

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#404040",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#3b82f6",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "22px",
  textAlign: "center" as const,
  marginTop: "20px",
};

const link = {
  color: "#3b82f6",
  textDecoration: "underline",
};
