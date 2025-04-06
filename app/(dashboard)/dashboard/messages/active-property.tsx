import type * as React from "react";

interface ActivePropertyEmailProps {
  propertyTitle: string;
  propertyNumber: number;
  ownerName: string;
  message: string;
}

export const ActivePropertyEmail: React.FC<ActivePropertyEmailProps> = ({
  propertyTitle,
  propertyNumber,
  ownerName,
  message,
}) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <img
          src="https://www.african-realestate.com/logo.png"
          alt="African Real Estate"
          style={{ maxWidth: "200px" }}
        />
      </div>
      <div style={{ padding: "20px" }}>
        <h2>Hello {ownerName},</h2>
        <p>
          Regarding your property: <strong>{propertyTitle}</strong> (Property #
          {propertyNumber})
        </p>
        <div
          style={{
            margin: "20px 0",
            padding: "15px",
            backgroundColor: "#f8f9fa",
            borderLeft: "4px solid #4a6cf7",
          }}
        >
          {message}
        </div>
        <p>
          If you have any questions, please don&apos;t hesitate to contact our
          support team.
        </p>
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <a
            href="https://www.african-realestate.com/dashboard"
            style={{
              backgroundColor: "#4a6cf7",
              color: "white",
              padding: "10px 20px",
              textDecoration: "none",
              borderRadius: "4px",
            }}
          >
            Go to Dashboard
          </a>
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          textAlign: "center",
          fontSize: "12px",
          color: "#6c757d",
        }}
      >
        <p>
          © {new Date().getFullYear()} African Real Estate. All rights
          reserved.
        </p>
        <p>
          <a
            href="https://www.african-realestate.com/privacy"
            style={{ color: "#6c757d", marginRight: "10px" }}
          >
            Privacy Policy
          </a>
          <a
            href="https://www.african-realestate.com/terms"
            style={{ color: "#6c757d" }}
          >
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  );
};
