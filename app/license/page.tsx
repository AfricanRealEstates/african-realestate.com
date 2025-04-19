import Link from "next/link";
import { getSEOTags, renderSchemaTags } from "@/lib/seo";

export const metadata = getSEOTags({
  title: "License Information | African Real Estate",
  description:
    "Information about our real estate licenses, compliance with regulatory requirements, and legal disclosures.",
  canonicalUrlRelative: "license",
});

export default function LicensePage() {
  return (
    <div className="bg-white">
      {renderSchemaTags()}
      <div className="mx-auto max-w-3xl px-6 py-24 sm:py-32 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            License Information
          </h1>
          <p className="mt-4 text-gray-500">Last updated: April 15, 2025</p>
        </div>

        <div className="mt-10 prose prose-blue max-w-none">
          <h2>Real Estate Licensing</h2>
          <p>
            African Real Estate is a licensed real estate brokerage firm
            operating in Kenya and other African countries. We maintain all
            required licenses and registrations to operate as a real estate
            marketplace and brokerage service.
          </p>

          <h3>Kenya Real Estate License</h3>
          <p>
            African Real Estate is licensed by the Estate Agents Registration
            Board (EARB) of Kenya under License No. EARB/2023/0123. Our
            principal broker is registered and in good standing with all
            applicable regulatory authorities.
          </p>
          <p>
            All real estate activities conducted through our platform in Kenya
            comply with the Estate Agents Act (Cap. 533) and other relevant laws
            and regulations governing real estate transactions in Kenya.
          </p>

          <h3>Agent Verification</h3>
          <p>
            All agents and agencies listing properties on our platform are
            required to provide valid licensing information. We verify this
            information to ensure that only properly licensed professionals can
            list properties for sale or rent on our platform.
          </p>
          <p>
            Users can view an agent&apos;s license information on their profile
            page. If you have concerns about an agent&apos;s credentials, please
            contact us immediately.
          </p>

          <h2>Software Licensing</h2>
          <p>
            The African Real Estate platform, including our website and mobile
            applications, contains proprietary software and content that is
            protected by copyright, trademark, and other intellectual property
            laws.
          </p>

          <h3>User License</h3>
          <p>
            By using our Services, we grant you a limited, non-exclusive,
            non-transferable, revocable license to access and use our platform
            for personal, non-commercial purposes. This license is subject to
            these License Terms and our{" "}
            <Link href="/terms" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </Link>
            .
          </p>

          <h3>Restrictions</h3>
          <p>You may not:</p>
          <ul>
            <li>
              Copy, modify, or create derivative works based on our platform or
              its content
            </li>
            <li>
              Reverse engineer, decompile, or disassemble any portion of our
              platform
            </li>
            <li>
              Remove any copyright, trademark, or other proprietary notices
            </li>
            <li>Transfer your license rights to any other party</li>
            <li>
              Use our platform for any illegal purpose or in violation of any
              local, state, national, or international law
            </li>
            <li>
              Use our platform to send automated queries to any website or to
              send any unsolicited commercial email
            </li>
            <li>
              Use our platform in a manner that could damage, disable,
              overburden, or impair our servers or networks
            </li>
          </ul>

          <h2>Third-Party Licenses</h2>
          <p>
            Our platform incorporates certain third-party software and services,
            which are subject to their respective licenses. We acknowledge and
            appreciate the following third-party components:
          </p>
          <ul>
            <li>Google Maps API (© Google LLC)</li>
            <li>OpenStreetMap data (© OpenStreetMap contributors)</li>
            <li>Various open-source libraries and frameworks</li>
          </ul>
          <p>
            Complete information about third-party licenses used in our platform
            is available upon request.
          </p>

          <h2>Content Licensing</h2>
          <h3>Property Listings</h3>
          <p>
            Property listings, including descriptions, images, and videos, are
            provided by our users (agents, agencies, and property owners). By
            submitting content to our platform, users grant us a non-exclusive,
            worldwide, royalty-free license to use, reproduce, modify, adapt,
            publish, translate, and distribute such content in connection with
            our Services.
          </p>

          <h3>African Real Estate Content</h3>
          <p>
            All content created by African Real Estate, including blog posts,
            guides, market reports, and other educational materials, is
            protected by copyright. You may not reproduce, distribute, or create
            derivative works without our express permission.
          </p>

          <h2>Regulatory Compliance</h2>
          <h3>Anti-Money Laundering (AML) Compliance</h3>
          <p>
            African Real Estate complies with all applicable anti-money
            laundering laws and regulations. We implement appropriate customer
            due diligence procedures and report suspicious transactions to the
            relevant authorities as required by law.
          </p>

          <h3>Data Protection Compliance</h3>
          <p>
            We comply with the Data Protection Act of Kenya and other applicable
            data protection laws. For more information about how we collect,
            use, and protect your personal information, please refer to our{" "}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </Link>
            .
          </p>

          <h2>Disclaimer</h2>
          <p>
            While we strive to ensure that all information on our platform is
            accurate and up-to-date, we make no representations or warranties
            about the accuracy, reliability, completeness, or timeliness of any
            content. All property information should be independently verified.
          </p>
          <p>
            African Real Estate is not responsible for any errors or omissions,
            or for the results obtained from the use of this information. All
            information on our platform is provided &quot;as is,&quot; with no
            guarantee of completeness, accuracy, timeliness, or of the results
            obtained from the use of this information.
          </p>

          <h2>Contact Information</h2>
          <p>
            For questions or concerns regarding our licenses or compliance with
            regulatory requirements, please contact our legal department:
          </p>
          <p>
            Email:{" "}
            <a
              href="mailto:legal@african-realestate.com"
              className="text-blue-600 hover:text-blue-500"
            >
              legal@african-realestate.com
            </a>
            <br />
            Address: 123 Kenyatta Avenue, Nairobi, 00100, Kenya
            <br />
            Phone: +254 732 945 534
          </p>
        </div>
      </div>
    </div>
  );
}
