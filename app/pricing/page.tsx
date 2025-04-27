import { getSEOTags } from "@/lib/seo";
import Link from "next/link";
import PricingPlans from "./PricingPlans";

export const metadata = getSEOTags({
  title: "Pricing | African Real Estate",
  description:
    "Choose the perfect plan for your property listings. We offer flexible pricing options for agents and agencies.",
  canonicalUrlRelative: "pricing",
});

export default function PricingPage() {
  return (
    <div className="bg-white">
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-base font-semibold leading-7 text-blue-600">
              Pricing
            </h1>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Choose the right plan for your business
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Get your properties in front of thousands of potential buyers and
              renters with our flexible pricing options.
            </p>
          </div>
          <PricingPlans />
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              If you can&apos;t find what you&apos;re looking for, please{" "}
              <Link
                href="/contact"
                className="text-blue-600 hover:text-blue-500"
              >
                contact our team
              </Link>
              .
            </p>
          </div>

          {/* FAQ items */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* FAQ 1 */}
            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-blue-500/5">
              <h3 className="text-lg font-semibold text-gray-900">
                How long will my listing be active?
              </h3>
              <p className="mt-4 text-sm text-gray-600">
                Your listing will be active for the duration specified in your
                plan - 30 days for Intermediate and Advanced plans, and 60 days
                for the Super Agent plan.
              </p>
            </div>
            {/* FAQ 2 */}
            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-blue-500/5">
              <h3 className="text-lg font-semibold text-gray-900">
                Can I upgrade my plan later?
              </h3>
              <p className="mt-4 text-sm text-gray-600">
                Yes, you can upgrade your plan at any time. The additional
                features will be applied to your listing immediately.
              </p>
            </div>
            {/* FAQ 3 */}
            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-blue-500/5">
              <h3 className="text-lg font-semibold text-gray-900">
                How do I get featured on the homepage?
              </h3>
              <p className="mt-4 text-sm text-gray-600">
                Advanced and Super Agent plans include featured placement. The
                duration depends on your plan - 24 hours for Advanced and 14
                days for Super Agent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
