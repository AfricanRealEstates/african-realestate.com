import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import TeamMember from "./TeamMember";

export const metadata: Metadata = {
  title: "About | African Real Estate",
  description:
    "Discover African Real Estate, the continent's premier property platform. Learn about our mission to revolutionize African real estate, meet our expert team, and explore our vision for connecting property seekers, sellers, and investors across Africa.",
  keywords: [
    "African real estate",
    "property platform",
    "buy property in Africa",
    "sell property in Africa",
    "African real estate team",
    "African property investment",
    "real estate technology Africa",
    "African property listings",
  ],
  openGraph: {
    title: "About | African Real Estate",
    description:
      "Explore African Real Estate, the leading digital gateway for property in Africa. Learn how we're revolutionizing real estate transactions and connecting stakeholders across the continent.",
    url: "https://www.african-realestate.com/about",
    siteName: "African Real Estate",
    images: [
      {
        url: "https://www.african-realestate.com/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "African Real Estate Team and Vision",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "About African Real Estate | Innovating Property Solutions in Africa",
    description:
      "Discover how African Real Estate is reshaping the property landscape across Africa. Meet our team and learn about our mission to simplify real estate transactions continent-wide.",
    images: ["https://www.african-realestate.com/twitter-image.jpg"],
    creator: "@AfricanRealEstate",
    site: "@AfricanRealEstate",
  },
  alternates: {
    canonical: "https://www.african-realestate.com/about",
  },
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <Card>
    <CardContent className="flex flex-col items-center text-center p-6">
      {icon}
      <h3 className="mt-4 mb-2 text-xl font-semibold text-blue-300">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default function About() {
  return (
    <section className="py-24 lg:py-32">
      <article className="mx-auto max-w-6xl space-y-16 px-6">
        <div className="relative z-10 mx-auto max-w-3xl space-y-6">
          <h1 className="text-4xl font-medium lg:text-5xl text-blue-300">
            About African Real Estate
          </h1>
          <p className="text-lg text-gray-600">
            Leading African Property Portal & Real Estate Services
          </p>
        </div>

        <div className="mx-auto max-w-3xl border-t px-6">
          <span className="text-caption -ml-6 -mt-3.5 block w-max px-6 bg-gray-50">
            Vision
          </span>
          <div className="mt-6 bg-gray-50 p-2">
            <div className="mt-6 sm:mt-0 ">
              <p className="text-gray-500">
                To be the premier digital gateway for real estate in Africa,
                connecting property seekers, sellers, and investors across the
                continent.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Team */}
      <article className="mx-auto max-w-3xl px-8 lg:px-0">
        <h2 className="my-16 text-3xl lg:text-4xl font-semibold text-blue-300">
          Our Team
        </h2>

        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 border-t py-6">
            <TeamMember
              name="Mungai Kihara"
              role="CEO & Founder"
              imageSrc="/assets/mungai.jpg"
            />
            <TeamMember
              name="Vincent K."
              role="Head of Marketing"
              imageSrc="/assets/vincent.jpg"
            />
            <TeamMember
              name="Ken Mwangi"
              link="https://www.kasukutech.com"
              role="Full stack Engineer"
              imageSrc="/assets/ken.jpeg"
            />
          </div>
        </div>
      </article>
    </section>
  );
}
