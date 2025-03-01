import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from "@react-email/components";

interface RevocationEmailProps {
  recipientEmail: string;
  inviterName: string;
}

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://african-realestate.com";

export const RevocationEmail = ({
  recipientEmail,
  inviterName,
}: RevocationEmailProps) => {
  const previewText = `Your invitation to African Real Estate's blog platform has been revoked`;

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
          <Heading style={heading}>Invitation Revoked</Heading>
          <Text style={paragraph}>Hello {recipientEmail},</Text>
          <Text style={paragraph}>
            We regret to inform you that your invitation to contribute to the
            African Real Estate blog platform has been revoked by {inviterName}.
          </Text>
          <Text style={paragraph}>
            If you believe this is an error or have any questions, please
            contact our support team.
          </Text>
          <Text style={paragraph}>Thank you for your understanding.</Text>
          <Text style={paragraph}>
            Best regards,
            <br />
            The African Real Estate Team
          </Text>
          <Hr style={hr} />
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

export default RevocationEmail;
