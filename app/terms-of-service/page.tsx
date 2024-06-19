import { Button } from "@/components/utils/Button";
import { getSEOTags } from "@/lib/seo";
import Link from "next/link";
import React from "react";

export const metadata = getSEOTags({
  title: `Terms and Conditions | African Real Estate`,
  canonicalUrlRelative: "/terms-of-service",
});

export default function TermOfService() {
  return (
    <section className="mx-auto w-[95%] max-w-4xl px-5 py-32 md:px-10 md:py-36 lg:py-40">
      <div className="p-5 shadow-sm border border-neutral-100">
        <Button
          href={"/"}
          variant="outline"
          className="flex gap-x-3 items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </Button>
        <h1 className="text-3xl mt-6 font-extrabold pb-6">
          Terms and Conditions for African Real Estate
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap text-gray-600 text-sm"
          style={{ fontFamily: "sans-serif" }}
        >
          {`
Effective Date: June 19, 2024

Welcome to African Real Estate! By accessing or using our website (https://african-realestate.com/), you agree to comply with and be bound by the following Terms & Services. Please review them carefully. If you do not agree with these terms, you should not use our website.

1. Introduction
African Real Estate ("we", "us", "our") is a modern real estate platform where agents can post properties, and clients can view these properties. These Terms & Services govern your use of our website and services.

2. Ownership and Management of Property Listings
Users can post properties on our platform.
Users retain ownership of their property listings and have the ability to modify or delete their listings at any time.
Users may request a full refund of the advertising fee within 7 days of purchase.
3. User Data Collection
We collect the following personal data from our users:

Name
Email
Payment information
We also collect non-personal data through web cookies. For more information on how we handle your data, please review our Privacy Policy.

4. Use of the Website
By using our website, you agree to:

Provide accurate and complete information when posting a property.
Use the website for lawful purposes only.
Not engage in any activity that could harm the website or its users.
5. Refund Policy
Users can request a full refund of the advertising fee within 7 days of the purchase. To request a refund, please contact us at Africanrealestate0@gmail.com.

6. Governing Law
These Terms & Services are governed by the laws of Kenya. Any disputes arising from the use of our website will be subject to the jurisdiction of the Kenyan courts.

7. Updates to Terms & Services
We may update these Terms & Services from time to time. Users will be notified of any changes via email. Continued use of the website after such updates constitutes acceptance of the new terms.

8. Contact Information
If you have any questions or concerns about these Terms & Services, please contact us at Africanrealestate0@gmail.com.

Thank you for using African Real Estate!

            `}
        </pre>
      </div>
    </section>
  );
}
