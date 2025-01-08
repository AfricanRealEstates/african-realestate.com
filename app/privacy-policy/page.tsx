import { Button } from "@/components/utils/Button";
import { getSEOTags } from "@/lib/seo";
import Link from "next/link";
import React from "react";

export const metadata = getSEOTags({
  title: `Privacy Policy | African Real Estate`,
  canonicalUrlRelative: "/privacy-policy",
});

export default function PrivacyPolicy() {
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
          Privacy Policy for African Real Estate
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap text-gray-600 text-sm"
          style={{ fontFamily: "sans-serif" }}
        >
          {`
Effective Date: June 19, 2024

At African Real Estate, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website (https://african-realestate.com/).

1. Information We Collect
Personal Data
When you use our services, we may collect the following personal information:

Name
Email address
Payment information
Non-Personal Data
We also collect non-personal data through the use of web cookies. This data includes:

Browser type
Operating system
IP address
Pages visited on our website
Time and date of visits
2. How We Use Your Information
We use the collected information for the following purposes:

To provide and maintain our services
To process transactions and send related information
To communicate with you, including responding to your requests and sending updates
To improve our website and services
To monitor and analyze usage and trends to improve user experience
3. Cookies and Tracking Technologies
We use cookies to enhance your browsing experience. Cookies are small data files stored on your device. They help us understand how you interact with our website and enable us to personalize your experience. You can choose to disable cookies through your browser settings, but doing so may affect the functionality of our website.

4. Sharing Your Information
We do not sell, trade, or otherwise transfer your personal information to outside parties, except as described in this policy. We may share your information with:

Service providers who assist us in operating our website and conducting our business
Law enforcement or other government agencies when required by law
5. Data Security
We implement various security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is completely secure, so we cannot guarantee absolute security.

6. Your Rights
You have the right to:

Access and review your personal information
Correct any inaccuracies in your personal information
Request the deletion of your personal information
Withdraw consent to the processing of your personal information
To exercise these rights, please contact us at Africanrealestate0@gmail.com.

7. Retention of Data
We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy unless a longer retention period is required or permitted by law.

8. Changes to This Privacy Policy
We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our website and sending you an email notification. Changes will take effect immediately upon posting on the website.

9. Contact Us
If you have any questions or concerns about this Privacy Policy, please contact us at Africanrealestate0@gmail.com.

African Real Estate



            `}
        </pre>
      </div>
    </section>
  );
}
