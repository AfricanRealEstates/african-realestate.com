import { Check } from "lucide-react";
import { getSEOTags, renderSchemaTags } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = getSEOTags({
  title: "Pricing | African Real Estate",
  description:
    "Choose the perfect plan for your property listings. We offer flexible pricing options for agents and agencies.",
  canonicalUrlRelative: "pricing",
});

const pricingPlans = [
  {
    name: "Intermediate Agent",
    badge: "Bronze",
    description: "Perfect for getting started with property listings",
    price: "KES 400",
    duration: "per listing",
    days: "30 DAYS",
    features: [
      "Basic Listing",
      "Special landing page",
      "Local & Display visibility",
      "Feature for 6hrs",
    ],
    recommended: false,
  },
  {
    name: "Advanced Agent",
    badge: "Diamond",
    description: "Everything in Bronze, plus enhanced visibility",
    price: "KES 1,200",
    duration: "per listing",
    days: "30 DAYS",
    features: [
      "Everything in Bronze, Plus",
      "Special marketing campaign",
      "Recommended Leads",
      "Feature for 24hrs",
      "Diamond crest on Listings",
    ],
    recommended: true,
    expandable: true,
  },
  {
    name: "Super Agent",
    badge: "Platinum",
    description: "Everything in Diamond, plus premium features",
    price: "KES 4,000",
    duration: "per listing",
    days: "60 DAYS",
    features: [
      "Everything in Diamond, Plus",
      "Feature for 14 days",
      "Platinum Crest on Listings",
      "Top placement on search results",
      "Extra 30 days for free Marketing",
      "5-10 Qualified leads",
      "Pre-qualification for a free video shoot",
      "Special feature in our social media",
      "24/7 Customer Support",
    ],
    recommended: false,
    expandable: true,
  },
];

export default function PricingPage() {
  return (
    <div className="bg-white">
      {renderSchemaTags()}
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

          <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl p-8 ring-1 ring-gray-200 ${
                  plan.recommended
                    ? "bg-white shadow-xl ring-2 ring-blue-600 relative"
                    : "bg-white/5 hover:shadow-md transition-shadow duration-300"
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-blue-600 px-3 py-1 text-center text-sm font-semibold text-white">
                    Recommended
                  </div>
                )}
                <div className="flex items-center justify-between gap-x-4">
                  <h2 className="text-lg font-semibold leading-8 text-gray-900">
                    {plan.name}
                  </h2>
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-900">
                    {plan.badge}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {plan.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">
                    {plan.duration}
                  </span>
                </p>
                <p className="mt-1 text-sm text-gray-500">{plan.days}</p>
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
                >
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check
                        className="h-6 w-5 flex-none text-blue-600"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="mt-8 w-full"
                  variant={plan.recommended ? "default" : "outline"}
                >
                  <Link href="/pay">Select Plan</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

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
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-blue-500/5">
              <h3 className="text-lg font-semibold text-gray-900">
                Can I upgrade my plan later?
              </h3>
              <p className="mt-4 text-sm text-gray-600">
                Yes, you can upgrade your plan at any time. The additional
                features will be applied to your listing immediately.
              </p>
            </div>
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
