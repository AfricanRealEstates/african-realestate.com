import {
  ArrowRight,
  BookOpen,
  Home,
  Building,
  Warehouse,
  Map,
  DollarSign,
  Key,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Helper function to get icon based on property type
const getTypeIcon = (type: string) => {
  switch (type) {
    case "Residential":
      return <Home className="h-5 w-5" />;
    case "Commercial":
      return <Building className="h-5 w-5" />;
    case "Industrial":
      return <Warehouse className="h-5 w-5" />;
    case "Land":
      return <Map className="h-5 w-5" />;
    default:
      return <Home className="h-5 w-5" />;
  }
};

// Helper function to get icon based on guide type
const getGuideTypeIcon = (type: string) => {
  switch (type) {
    case "sale":
      return <DollarSign className="h-5 w-5" />;
    case "rent":
      return <Key className="h-5 w-5" />;
    case "sell":
      return <FileText className="h-5 w-5" />;
    default:
      return <DollarSign className="h-5 w-5" />;
  }
};

// Helper function to get formatted guide type text
const getGuideTypeText = (type: string) => {
  switch (type) {
    case "sale":
      return "Buying Guide";
    case "rent":
      return "Renting Guide";
    case "sell":
      return "Selling Guide";
    default:
      return "Property Guide";
  }
};

// Default guides with images if no guides are available in the database
const defaultGuides = [
  {
    id: "default-1",
    title: "Buying Residential Property",
    propertyType: "Residential",
    guideType: "sale",
    description:
      "Discover your dream home effortlessly. Explore diverse properties and expert guidance for a seamless buying experience.",
    slug: "buying-residential-property",
    coverImage: "/assets/residential-buying.jpg",
    defaultImage: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "default-2",
    title: "Renting Commercial Space",
    propertyType: "Commercial",
    guideType: "rent",
    description:
      "Find the perfect rental space for your business. Browse our listings tailored to suit your unique business needs.",
    slug: "renting-commercial-property",
    coverImage: "/assets/commercial-renting.jpg",
    defaultImage: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "default-3",
    title: "Selling Land Property",
    propertyType: "Land",
    guideType: "sell",
    description:
      "Maximize your land value with our expert selling guidance. We'll help showcase your property's best features for a successful sale.",
    slug: "selling-land-property",
    coverImage: "/assets/land-selling.jpg",
    defaultImage: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "default-4",
    title: "Buying Commercial Property",
    propertyType: "Commercial",
    guideType: "sale",
    description:
      "Invest in commercial real estate with confidence. Our guide helps you navigate the market and find profitable opportunities.",
    slug: "buying-commercial-property",
    coverImage: "/assets/commercial-buying.jpg",
    defaultImage: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "default-5",
    title: "Renting Residential Property",
    propertyType: "Residential",
    guideType: "rent",
    description:
      "Find your perfect home to rent. Our comprehensive guide walks you through the rental process from search to signing.",
    slug: "renting-residential-property",
    coverImage: "/assets/residential-renting.jpg",
    defaultImage: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "default-6",
    title: "Selling Industrial Property",
    propertyType: "Industrial",
    guideType: "sell",
    description:
      "Sell your industrial property at the best price. Learn about market valuation, buyer expectations, and closing strategies.",
    slug: "selling-industrial-property",
    coverImage: "/assets/industrial-selling.jpg",
    defaultImage: "/placeholder.svg?height=400&width=600",
  },
];

// Guide card component
const GuideCard = ({ guide }: { guide: any }) => {
  return (
    <article className="group hover:cursor-pointer flex flex-col h-full transition-all ease-in-out border rounded-lg border-neutral-200 hover:border-neutral-100 hover:shadow-2xl hover:shadow-gray-600/10 bg-white overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={
            guide.coverImage ||
            guide.defaultImage ||
            "/placeholder.svg?height=400&width=600"
          }
          alt={guide.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          width={600}
          height={400}
        />
        <div className="absolute top-4 right-4">
          <Badge
            className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-none"
            variant="outline"
          >
            {getGuideTypeText(guide.guideType)}
          </Badge>
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-blue-50 text-blue-600">
            {getTypeIcon(guide.propertyType)}
          </div>
          <Badge
            className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none"
            variant="outline"
          >
            {guide.propertyType}
          </Badge>
        </div>

        <div className="content flex-1">
          <h4
            className={`capitalize font-bold text-base lg:text-lg text-[#636262] mb-3`}
          >
            {guide.title}
          </h4>
          {/* <p className="text-[#5c6368] leading-relaxed text-sm mb-6">
            {guide.description}
          </p> */}
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <Link
            href={`/guides/${guide.slug}`}
            className={` group-hover:text-blue-500 text-[#5c6368] group-hover:underline underline-offset-4 transition-all ease-in-out flex items-center gap-2`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Read Guide</span>
          </Link>

          <Link
            href={`/guides/${guide.slug}`}
            aria-label={`Read guide: ${guide.title}`}
            className="relative ml-auto flex h-10 w-10 items-center justify-center before:absolute before:inset-0 before:rounded-full before:border before:border-gray-200/40 before:bg-gray-100 before:transition-transform before:duration-300 active:duration-75 active:before:scale-95 group-hover:before:scale-110 dark:before:border-gray-700 dark:before:bg-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="relative text-gray-500 h-4 w-4 transition duration-300 group-hover:-rotate-45 group-hover:text-blue-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              ></path>
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default async function OurServices() {
  // Fetch published guides from the database
  const guides = await prisma.guide.findMany({
    where: {
      published: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 12, // Get more guides for the carousel
  });

  // Process guides to add descriptions if missing
  const processedGuides = guides.map((guide) => {
    // Generate a description if none exists
    const description =
      "Expert guide on navigating the property market. Learn about pricing, legal requirements, and making informed decisions.";

    // Add default image if none exists
    const defaultImage = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(guide.title)}`;

    return {
      ...guide,
      description,
      defaultImage,
    };
  });

  // Use default guides if no guides are available
  const displayGuides =
    processedGuides.length > 0 ? processedGuides : defaultGuides;

  return (
    <div className="border-t border-gray-50">
      <section className="mx-auto w-full max-w-7xl px-4">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
          <div>
            {/* <h2
            className={`text-[14px] text-blue-500 font-semibold mb-2 uppercase `}
          >
            Our Services
          </h2> */}
            <h3 className={`text-2xl font-bold text-gray-700`}>
              Property Guides
            </h3>
          </div>
          <Link
            href="/guides"
            className={` text-[#636262] hover:text-blue-500 group font-semibold relative flex items-center gap-x-2`}
          >
            <span className="group-hover:underline group-hover:underline-offset-4">
              View All Guides
            </span>
            <ArrowRight className="size-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Featured Guides Carousel */}
        <div className="mb-12">
          {/* <h4
          className={`${josefin.className} text-[#636262] text-xl font-semibold mb-6`}
        >
          Featured Guides
        </h4> */}
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {displayGuides.map((guide) => (
                <CarouselItem
                  key={guide.id}
                  className="md:basis-1/2 lg:basis-1/3 pl-4"
                >
                  <GuideCard guide={guide} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-2 mt-6">
              <CarouselPrevious className="relative inset-0 translate-y-0 bg-white border border-gray-200 hover:bg-gray-50" />
              <CarouselNext className="relative inset-0 translate-y-0 bg-white border border-gray-200 hover:bg-gray-50" />
            </div>
          </Carousel>
        </div>

        {/* Popular Guides Grid */}
        {/* <div>
        <h4
          className={`${josefin.className} text-[#636262] text-xl font-semibold mb-6`}
        >
          Popular Guides
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayGuides.slice(0, 6).map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[#5c6368] mb-6 max-w-2xl mx-auto">
          Looking for more detailed information about buying, selling, or
          renting properties in Africa? Our comprehensive guides provide expert
          advice for every step of your real estate journey.
        </p>
        <Link
          href="/guides"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Explore All Property Guides
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div> */}
      </section>
    </div>
  );
}
