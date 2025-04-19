import Link from "next/link";
import { getSEOTags, renderSchemaTags } from "@/lib/seo";

export const metadata = getSEOTags({
  title: "Terms of Service | African Real Estate",
  description:
    "Read our Terms of Service agreement. Learn about the rules, guidelines, and policies for using the African Real Estate platform.",
  canonicalUrlRelative: "terms",
});

export default function TermsPage() {
  return (
    <div className="bg-white">
      {renderSchemaTags()}
      <div className="mx-auto max-w-3xl px-6 py-24 sm:py-32 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-gray-500">Last updated: April 15, 2025</p>
        </div>

        <div className="mt-10 prose prose-blue max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Welcome to African Real Estate (&quot;we,&quot; &quot;our,&quot; or
            &quot;us&quot;). These Terms of Service (&quot;Terms&quot;) govern
            your access to and use of the African Real Estate website, mobile
            applications, and services (collectively, the &quot;Services&quot;).
          </p>
          <p>
            By accessing or using our Services, you agree to be bound by these
            Terms. If you do not agree to these Terms, you may not access or use
            the Services.
          </p>

          <h2>2. Eligibility</h2>
          <p>
            You must be at least 18 years old to use our Services. By using our
            Services, you represent and warrant that you meet this requirement
            and that you have the right, authority, and capacity to enter into
            these Terms.
          </p>

          <h2>3. Account Registration</h2>
          <p>
            To access certain features of our Services, you may need to register
            for an account. When you register, you agree to provide accurate,
            current, and complete information and to update this information to
            maintain its accuracy. You are responsible for maintaining the
            confidentiality of your account credentials and for all activities
            that occur under your account.
          </p>
          <p>
            We reserve the right to suspend or terminate your account if any
            information provided during registration or thereafter proves to be
            inaccurate, false, or misleading, or if you fail to comply with
            these Terms.
          </p>

          <h2>4. User Content</h2>
          <p>
            Our Services allow you to post, link, store, share, and otherwise
            make available certain information, text, graphics, videos, or other
            material (&quot;User Content&quot;). You are responsible for the
            User Content that you post on or through our Services, including its
            legality, reliability, and appropriateness.
          </p>
          <p>
            By posting User Content on or through our Services, you represent
            and warrant that:
          </p>
          <ul>
            <li>
              You own or have the necessary rights to use and authorize us to
              use the User Content;
            </li>
            <li>
              The User Content does not violate the privacy rights, publicity
              rights, copyrights, contract rights, or any other rights of any
              person or entity;
            </li>
            <li>
              The User Content does not contain material that is false,
              intentionally misleading, or defamatory;
            </li>
            <li>
              The User Content does not contain material that is unlawful,
              obscene, offensive, or inappropriate.
            </li>
          </ul>
          <p>
            We reserve the right to remove any User Content from our Services at
            any time, for any reason, without notice.
          </p>

          <h2>5. Property Listings</h2>
          <p>
            If you are a property owner, agent, or agency, you may list
            properties for sale or rent on our Services. You represent and
            warrant that:
          </p>
          <ul>
            <li>You have the legal right to list the property;</li>
            <li>
              All information provided about the property is accurate, complete,
              and not misleading;
            </li>
            <li>
              You have obtained all necessary permissions and consents to list
              the property;
            </li>
            <li>
              The property complies with all applicable laws and regulations.
            </li>
          </ul>
          <p>
            We reserve the right to remove any property listing from our
            Services at any time, for any reason, without notice.
          </p>

          <h2>6. Prohibited Activities</h2>
          <p>
            You agree not to engage in any of the following prohibited
            activities:
          </p>
          <ul>
            <li>
              Using the Services for any illegal purpose or in violation of any
              local, state, national, or international law;
            </li>
            <li>
              Harassing, threatening, intimidating, or impersonating others;
            </li>
            <li>
              Posting false, inaccurate, misleading, defamatory, or libelous
              content;
            </li>
            <li>
              Attempting to circumvent any security feature of the Services;
            </li>
            <li>
              Using the Services to send unsolicited communications, promotions,
              or advertisements;
            </li>
            <li>
              Interfering with, disrupting, or creating an undue burden on the
              Services or the networks or services connected to the Services;
            </li>
            <li>Attempting to impersonate another user or person;</li>
            <li>
              Using any information obtained from the Services to harass, abuse,
              or harm another person;
            </li>
            <li>
              Using the Services as part of any effort to compete with us or
              otherwise use the Services for any revenue-generating endeavor or
              commercial enterprise.
            </li>
          </ul>

          <h2>7. Intellectual Property</h2>
          <p>
            The Services and their original content (excluding User Content),
            features, and functionality are and will remain the exclusive
            property of African Real Estate and its licensors. The Services are
            protected by copyright, trademark, and other laws of both Kenya and
            foreign countries. Our trademarks and trade dress may not be used in
            connection with any product or service without the prior written
            consent of African Real Estate.
          </p>

          <h2>8. Privacy</h2>
          <p>
            Your privacy is important to us. Please review our{" "}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </Link>
            , which explains how we collect, use, and share information about
            you when you use our Services.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, in no event shall African
            Real Estate, its directors, employees, partners, agents, suppliers,
            or affiliates be liable for any indirect, incidental, special,
            consequential, or punitive damages, including without limitation,
            loss of profits, data, use, goodwill, or other intangible losses,
            resulting from:
          </p>
          <ul>
            <li>
              Your access to or use of or inability to access or use the
              Services;
            </li>
            <li>Any conduct or content of any third party on the Services;</li>
            <li>Any content obtained from the Services; and</li>
            <li>
              Unauthorized access, use, or alteration of your transmissions or
              content.
            </li>
          </ul>

          <h2>10. Disclaimer</h2>
          <p>
            Your use of the Services is at your sole risk. The Services are
            provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis.
            The Services are provided without warranties of any kind, whether
            express or implied, including, but not limited to, implied
            warranties of merchantability, fitness for a particular purpose,
            non-infringement, or course of performance.
          </p>
          <p>
            African Real Estate, its subsidiaries, affiliates, and its licensors
            do not warrant that:
          </p>
          <ul>
            <li>
              The Services will function uninterrupted, secure, or available at
              any particular time or location;
            </li>
            <li>Any errors or defects will be corrected;</li>
            <li>
              The Services are free of viruses or other harmful components; or
            </li>
            <li>
              The results of using the Services will meet your requirements.
            </li>
          </ul>

          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the
            laws of Kenya, without regard to its conflict of law provisions.
          </p>
          <p>
            Our failure to enforce any right or provision of these Terms will
            not be considered a waiver of those rights. If any provision of
            these Terms is held to be invalid or unenforceable by a court, the
            remaining provisions of these Terms will remain in effect.
          </p>

          <h2>12. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. If a revision is material, we will provide
            at least 30 days&apos; notice prior to any new terms taking effect.
            What constitutes a material change will be determined at our sole
            discretion.
          </p>
          <p>
            By continuing to access or use our Services after any revisions
            become effective, you agree to be bound by the revised terms. If you
            do not agree to the new terms, you are no longer authorized to use
            the Services.
          </p>

          <h2>13. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
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
