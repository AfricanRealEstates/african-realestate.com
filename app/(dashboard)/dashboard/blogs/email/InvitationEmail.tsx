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

interface InvitationEmailProps {
  invitationUrl: string;
  inviterName: string;
  recipientEmail: string;
  isNewUser: boolean;
}

const NEXT_PUBLIC_APP_URL = "http://localhost:3000";

const baseUrl = NEXT_PUBLIC_APP_URL || "https://african-realestate.com";

export const InvitationEmail = ({
  invitationUrl,
  inviterName,
  recipientEmail,
  isNewUser,
}: InvitationEmailProps) => {
  const previewText = isNewUser
    ? `You've been invited to join African Real Estate's blog platform`
    : `You've been invited to contribute to African Real Estate's blog`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/logo.png`}
            width="180"
            height="60"
            alt="African Real Estate Logo"
            style={logo}
          />
          <Heading style={heading}>You&apos;ve been invited!</Heading>
          <Text style={paragraph}>Hello {recipientEmail},</Text>
          <Text style={paragraph}>
            {inviterName} has invited you to{" "}
            {isNewUser ? "join" : "contribute to"} the African Real Estate blog
            platform.
            {isNewUser
              ? " We're excited to have you join our community of real estate professionals!"
              : " We value your expertise and look forward to your contributions!"}
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={invitationUrl}>
              {isNewUser ? "Accept Invitation" : "Start Contributing"}
            </Button>
          </Section>
          <Text style={paragraph}>
            This invitation link will expire in 7 days.
            {isNewUser
              ? "If you don't create an account within this time, you'll need to request a new invitation."
              : "Please use this link to set up your contributor access."}
          </Text>
          <Text style={paragraph}>
            As a {isNewUser ? "member" : "contributor"}, you&apos;ll be able to
            share your insights on African real estate markets, property
            investment opportunities, and industry trends.
          </Text>
          <Text style={paragraph}>
            If you have any questions, feel free to reply to this email.
          </Text>
          <Text style={paragraph}>
            Best regards,
            <br />
            The African Real Estate Team
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            If you didn&apos;t expect this invitation, you can safely ignore
            this email.
          </Text>
          <Text style={footer}>
            © {new Date().getFullYear()} African Real Estate. All rights
            reserved.
          </Text>
          <Text style={footer}>
            <Link href="https://african-realestate.com" style={link}>
              african-realestate.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
};

const logo = {
  margin: "0 auto 20px",
  display: "block",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
  color: "#333",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#555",
  margin: "16px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#2563eb", // Blue color that matches your website
  borderRadius: "6px",
  color: "#fff",
  padding: "12px 16px",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "30px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "12px 0",
  textAlign: "center" as const,
};

const link = {
  color: "#2563eb",
  textDecoration: "underline",
};

export default InvitationEmail;
