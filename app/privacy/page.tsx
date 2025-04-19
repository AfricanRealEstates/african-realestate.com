import { getSEOTags, renderSchemaTags } from "@/lib/seo";

export const metadata = getSEOTags({
  title: "Privacy Policy | African Real Estate",
  description:
    "Learn how African Real Estate collects, uses, and protects your personal information. Read our comprehensive Privacy Policy.",
  canonicalUrlRelative: "privacy",
});

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      {renderSchemaTags()}
      <div className="mx-auto max-w-3xl px-6 py-24 sm:py-32 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-gray-500">Last updated: April 15, 2025</p>
        </div>

        <div className="mt-10 prose prose-blue max-w-none">
          <h2>1. Introduction</h2>
          <p>
            At African Real Estate (&quot;we,&quot; &quot;our,&quot; or
            &quot;us&quot;), we respect your privacy and are committed to
            protecting your personal information. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when
            you visit our website, mobile application, and use our services
            (collectively, the &quot;Services&quot;).
          </p>
          <p>
            Please read this Privacy Policy carefully. By accessing or using our
            Services, you acknowledge that you have read, understood, and agree
            to be bound by this Privacy Policy. If you do not agree with our
            policies and practices, please do not use our Services.
          </p>

          <h2>2. Information We Collect</h2>
          <h3>2.1 Personal Information</h3>
          <p>
            We may collect personal information that you voluntarily provide to
            us when you:
          </p>
          <ul>
            <li>Register for an account</li>
            <li>List a property</li>
            <li>Submit an inquiry about a property</li>
            <li>Subscribe to our newsletter</li>
            <li>Contact our customer support</li>
            <li>Participate in surveys or promotions</li>
          </ul>
          <p>The personal information we may collect includes:</p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Postal address</li>
            <li>Profile photo</li>
            <li>Payment information</li>
            <li>Property details (for sellers/landlords)</li>
            <li>Property preferences (for buyers/renters)</li>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <p>
            When you access or use our Services, we may automatically collect
            certain information, including:
          </p>
          <ul>
            <li>
              Device information (e.g., device type, operating system, browser
              type)
            </li>
            <li>IP address</li>
            <li>Location information</li>
            <li>
              Usage data (e.g., pages visited, time spent on pages, links
              clicked)
            </li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>
            We may use the information we collect for various purposes,
            including to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our Services</li>
            <li>Process transactions and send related information</li>
            <li>Connect property buyers/renters with sellers/landlords</li>
            <li>
              Send administrative information, such as updates to our terms and
              policies
            </li>
            <li>
              Send marketing communications, if you have opted in to receive
              them
            </li>
            <li>Respond to your comments, questions, and requests</li>
            <li>
              Monitor and analyze trends, usage, and activities in connection
              with our Services
            </li>
            <li>
              Detect, prevent, and address technical issues, fraud, or illegal
              activities
            </li>
            <li>Personalize your experience on our Services</li>
          </ul>

          <h2>4. How We Share Your Information</h2>
          <p>We may share your information in the following circumstances:</p>
          <ul>
            <li>
              <strong>With Property Owners/Agents:</strong> If you express
              interest in a property, we may share your contact information with
              the property owner or agent to facilitate communication.
            </li>
            <li>
              <strong>With Service Providers:</strong> We may share your
              information with third-party vendors, service providers,
              contractors, or agents who perform services on our behalf.
            </li>
            <li>
              <strong>For Business Transfers:</strong> If we are involved in a
              merger, acquisition, or sale of all or a portion of our assets,
              your information may be transferred as part of that transaction.
            </li>
            <li>
              <strong>For Legal Purposes:</strong> We may disclose your
              information if required to do so by law or in response to valid
              requests by public authorities.
            </li>
            <li>
              <strong>With Your Consent:</strong> We may share your information
              with third parties when you have given us your consent to do so.
            </li>
          </ul>

          <h2>5. Your Rights and Choices</h2>
          <p>
            Depending on your location, you may have certain rights regarding
            your personal information, including:
          </p>
          <ul>
            <li>
              <strong>Access:</strong> You may request access to the personal
              information we hold about you.
            </li>
            <li>
              <strong>Correction:</strong> You may request that we correct
              inaccurate or incomplete information about you.
            </li>
            <li>
              <strong>Deletion:</strong> You may request that we delete your
              personal information in certain circumstances.
            </li>
            <li>
              <strong>Restriction:</strong> You may request that we restrict the
              processing of your personal information in certain circumstances.
            </li>
            <li>
              <strong>Data Portability:</strong> You may request a copy of the
              personal information you provided to us in a structured, commonly
              used, and machine-readable format.
            </li>
            <li>
              <strong>Objection:</strong> You may object to our processing of
              your personal information in certain circumstances.
            </li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information
            provided in the &quot;Contact Us&quot; section below.
          </p>

          <h3>5.1 Marketing Communications</h3>
          <p>
            You can opt out of receiving marketing communications from us by
            following the unsubscribe instructions included in our marketing
            communications or by contacting us directly.
          </p>

          <h3>5.2 Cookies and Tracking Technologies</h3>
          <p>
            Most web browsers are set to accept cookies by default. You can
            usually choose to set your browser to remove or reject cookies.
            Please note that if you choose to remove or reject cookies, this
            could affect the availability and functionality of our Services.
          </p>

          <h2>6. Data Security</h2>
          <p>
            We have implemented appropriate technical and organizational
            measures to protect the security of your personal information.
            However, please be aware that no method of transmission over the
            internet or method of electronic storage is 100% secure. While we
            strive to use commercially acceptable means to protect your personal
            information, we cannot guarantee its absolute security.
          </p>

          <h2>7. Data Retention</h2>
          <p>
            We will retain your personal information only for as long as
            necessary to fulfill the purposes for which it was collected,
            including for the purposes of satisfying any legal, accounting, or
            reporting requirements.
          </p>

          <h2>8. Children&apos;s Privacy</h2>
          <p>
            Our Services are not intended for children under the age of 18. We
            do not knowingly collect personal information from children under
            18. If you are a parent or guardian and you believe your child has
            provided us with personal information, please contact us, and we
            will take steps to delete such information.
          </p>

          <h2>9. International Data Transfers</h2>
          <p>
            Your information may be transferred to, and maintained on, computers
            located outside of your state, province, country, or other
            governmental jurisdiction where the data protection laws may differ
            from those in your jurisdiction. If you are located outside Kenya
            and choose to provide information to us, please note that we
            transfer the information to Kenya and process it there.
          </p>

          <h2>10. Third-Party Links</h2>
          <p>
            Our Services may contain links to third-party websites and services.
            We have no control over, and assume no responsibility for, the
            content, privacy policies, or practices of any third-party websites
            or services. We encourage you to review the privacy policies of any
            third-party websites or services that you visit.
          </p>

          <h2>11. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the &quot;Last updated&quot; date at the top of this
            Privacy Policy. You are advised to review this Privacy Policy
            periodically for any changes.
          </p>

          <h2>12. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at:
          </p>
          <p>
            Email:{" "}
            <a
              href="mailto:privacy@african-realestate.com"
              className="text-blue-600 hover:text-blue-500"
            >
              privacy@african-realestate.com
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
