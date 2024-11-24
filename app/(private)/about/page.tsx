import { Metadata } from "next";
import { Raleway } from "next/font/google";
import Image from "next/image";
import { FaHome, FaHandshake, FaListUl } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TeamSection from "./TeamSection";
import TestimonialsSection from "./TestimonialsSection";
import StatisticsSection from "./StatisticsSection";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About African Real Estate | Premier Property Platform in Africa",
  description:
    "Discover Africa's leading real estate platform. Buy, sell, or list luxury properties across the continent. Learn about our mission, team, and success stories.",
  keywords:
    "African real estate, luxury properties, property listings, buy property in Africa, sell property in Africa, real estate team, property testimonials",
  openGraph: {
    title: "About African Real Estate | Premier Property Platform in Africa",
    description:
      "Connect with Africa's leading real estate marketplace. Explore exclusive listings, meet our expert team, and read success stories from satisfied clients.",
    images: [
      {
        url: "/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "African Real Estate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About African Real Estate | Luxury Properties Across Africa",
    description:
      "Your gateway to Africa's most exclusive properties. Discover our mission, meet our team, and explore client testimonials.",
    images: ["/assets/twitter-image.jpg"],
  },
};

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-raleway",
});

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
    <div className={`${raleway.variable} font-sans`}>
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
            About African Real Estate
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-muted-foreground">
            Welcome to Africa&apos;s premier real estate platform. We connect
            buyers, sellers, and investors with the most opulent and exclusive
            properties across the continent.
          </p>
        </section>

        <section className="grid gap-8 md:grid-cols-3 mb-16">
          <FeatureCard
            icon={<FaHome className="w-10 h-10 text-blue-400" />}
            title="Buy Properties"
            description="Explore a wide range of luxury homes, from beachfront villas to urban penthouses."
          />
          <FeatureCard
            icon={<FaHandshake className="w-10 h-10 text-blue-400" />}
            title="Sell Properties"
            description="List your property with us to reach a network of high-net-worth buyers across Africa."
          />
          <FeatureCard
            icon={<FaListUl className="w-10 h-10 text-blue-400" />}
            title="Create Listings"
            description="Easily create and manage property listings with our user-friendly platform."
          />
        </section>

        <section className="grid gap-10 lg:grid-cols-2 lg:gap-12 mb-16">
          <Image
            src="/assets/mission.jpg"
            alt="African Real Estate Mission"
            width={600}
            height={400}
            className="rounded-lg object-cover"
          />
          <Card>
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4 text-blue-400">
                Our Mission & Vision
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  <strong>Mission:</strong> Our mission is to revolutionize the
                  African real estate market by providing an accessible,
                  transparent, and efficient platform for luxury property
                  transactions.
                </p>
                <p>
                  <strong>Vision:</strong> We envision a future where African
                  real estate is at the forefront of global property investment.
                  We strive to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Showcase the diversity and potential of African real estate
                    to the world
                  </li>
                  <li>Facilitate seamless transactions across borders</li>
                  <li>
                    Promote sustainable and responsible property development
                  </li>
                  <li>
                    Contribute to the economic growth of African communities
                    through real estate
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <StatisticsSection />
        <TeamSection />
        <TestimonialsSection />

        <section className="text-center py-16 bg-muted rounded-lg">
          <h2 className="text-3xl font-bold mb-4 text-blue-400">
            Ready to Find Your Dream Property?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Join thousands of satisfied clients who have found their perfect
            home with African Real Estate.
          </p>
          <Button
            size="lg"
            asChild
            className="bg-blue-400 hover:bg-blue-500 transtion-colors"
          >
            <Link href="/properties" className="text-white">
              Explore Listings
            </Link>
          </Button>
        </section>
      </main>
    </div>
  );
}
