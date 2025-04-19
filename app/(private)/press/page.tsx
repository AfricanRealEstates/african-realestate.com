import Link from "next/link";
import { getSEOTags, renderSchemaTags } from "@/lib/seo";
import { Button } from "@/components/ui/button";

export const metadata = getSEOTags({
  title: "Press & Media | African Real Estate",
  description:
    "Latest news, press releases, and media resources from African Real Estate. Stay updated with our company announcements and industry insights.",
  canonicalUrlRelative: "press",
});

// This would typically come from a CMS or database
const pressReleases = [
  {
    id: 1,
    title: "African Real Estate Expands to Tanzania and Uganda",
    date: "March 15, 2025",
    excerpt:
      "African Real Estate announces expansion into Tanzania and Uganda markets, bringing its innovative property platform to new regions.",
    image: "/assets/placeholder.jpg",
    url: "/press/expansion-announcement",
  },
  {
    id: 2,
    title: "African Real Estate Secures $5M in Series A Funding",
    date: "January 10, 2025",
    excerpt:
      "Leading property marketplace secures significant investment to accelerate growth and enhance technology platform.",
    image: "/assets/placeholder.jpg",
    url: "/press/funding-announcement",
  },
  {
    id: 3,
    title: "African Real Estate Launches Mobile App",
    date: "November 5, 2024",
    excerpt:
      "New mobile application brings enhanced property search capabilities and virtual tours to users across Africa.",
    image: "/assets/placeholder.jpg",
    url: "/press/app-launch",
  },
];

const mediaFeatures = [
  {
    id: 1,
    title: "The Future of Real Estate in Africa",
    publication: "Business Daily Africa",
    date: "February 20, 2025",
    excerpt:
      "African Real Estate CEO discusses how technology is transforming property transactions across the continent.",
    image: "/assets/placeholder.jpg",
    url: "https://www.businessdailyafrica.com",
  },
  {
    id: 2,
    title: "How Digital Platforms are Revolutionizing Property Sales in Kenya",
    publication: "The Standard",
    date: "December 12, 2024",
    excerpt:
      "Feature on African Real Estate's innovative approach to property listings and virtual tours.",
    image: "/assets/placeholder.jpg",
    url: "https://www.standardmedia.co.ke",
  },
  {
    id: 3,
    title: "Top 10 PropTech Companies in Africa",
    publication: "TechAfrica",
    date: "October 5, 2024",
    excerpt:
      "African Real Estate recognized as a leading property technology company driving innovation in the sector.",
    image: "/assets/placeholder.jpg",
    url: "https://www.techafrica.com",
  },
];

export default function PressPage() {
  return (
    <div className="bg-white">
      {renderSchemaTags()}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Press & Media
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Stay updated with the latest news and announcements from African
            Real Estate. Find press releases, media coverage, and resources for
            journalists.
          </p>
        </div>

        {/* Press Contact Section */}
        <div className="mx-auto mt-16 max-w-5xl rounded-2xl bg-blue-50 p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Press Contact
              </h2>
              <p className="mt-2 text-gray-600">
                For media inquiries, interview requests, or additional
                information, please contact our press team.
              </p>
              <div className="mt-4">
                <p className="text-gray-700">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:press@african-realestate.com"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    press@african-realestate.com
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> +254 732 945 534
                </p>
              </div>
            </div>
            <Button asChild className="sm:flex-shrink-0">
              <Link href="/contact?subject=Press Inquiry">
                Contact Press Team
              </Link>
            </Button>
          </div>
        </div>

        {/* Press Releases Section */}
        <div className="mx-auto mt-24 max-w-7xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Press Releases
          </h2>
          {/* <div className="mt-10 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            {pressReleases.map((release) => (
              <div key={release.id} className="group relative">
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={release.image || "/placeholder.svg"}
                    alt={release.title}
                    fill
                    className="object-cover group-hover:opacity-90 transition-opacity"
                  />
                </div>
                <div className="mt-4 flex items-center gap-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{release.date}</span>
                </div>
                <h3 className="mt-2 text-xl font-semibold leading-8 text-gray-900 group-hover:text-blue-600">
                  <Link href={release.url}>
                    <span className="absolute inset-0" />
                    {release.title}
                  </Link>
                </h3>
                <p className="mt-2 text-gray-600">{release.excerpt}</p>
                <div className="mt-4">
                  <Link
                    href={release.url}
                    className="text-blue-600 hover:text-blue-500 inline-flex items-center"
                  >
                    Read more
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div> */}
          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link href="#">View All Press Releases</Link>
            </Button>
          </div>
        </div>

        {/* Media Coverage Section */}
        {/* <div className="mx-auto mt-24 max-w-7xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Media Coverage
          </h2>
          {/* <div className="mt-10 space-y-8">
            {mediaFeatures.map((feature) => (
              <div
                key={feature.id}
                className="group relative flex flex-col md:flex-row gap-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 md:h-auto md:w-1/3 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={feature.image || "/placeholder.svg"}
                    alt={feature.title}
                    fill
                    className="object-cover group-hover:opacity-90 transition-opacity"
                  />
                </div>
                <div className="md:w-2/3">
                  <div className="flex items-center gap-x-2 text-sm text-gray-500">
                    <span className="font-medium text-blue-600">
                      {feature.publication}
                    </span>
                    <span>•</span>
                    <span>{feature.date}</span>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold leading-8 text-gray-900 group-hover:text-blue-600">
                    <a
                      href={feature.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {feature.title}
                    </a>
                  </h3>
                  <p className="mt-2 text-gray-600">{feature.excerpt}</p>
                  <div className="mt-4">
                    <a
                      href={feature.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-500 inline-flex items-center"
                    >
                      Read article
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div> 
        </div> */}

        {/* Media Resources Section */}
        <div className="mx-auto mt-24 max-w-7xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Media Resources
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900">
                Company Logos
              </h3>
              <p className="mt-2 text-gray-600">
                Download our official logos in various formats for media use.
              </p>
              <div className="mt-4">
                <Button asChild variant="outline" size="sm">
                  <Link href="#">Download Logos</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900">
                Executive Photos
              </h3>
              <p className="mt-2 text-gray-600">
                High-resolution photos of our executive team for media
                publications.
              </p>
              <div className="mt-4">
                <Button asChild variant="outline" size="sm">
                  <Link href="/media-kit/executive-photos">
                    Download Photos
                  </Link>
                </Button>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900">
                Company Fact Sheet
              </h3>
              <p className="mt-2 text-gray-600">
                Key information about African Real Estate, our history, and
                achievements.
              </p>
              <div className="mt-4">
                <Button asChild variant="outline" size="sm">
                  <Link href="/media-kit/fact-sheet">Download Fact Sheet</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Media Kit CTA */}
        <div className="mx-auto mt-24 max-w-7xl">
          <div className="rounded-2xl bg-blue-50 px-6 py-16 sm:p-16 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Complete Media Kit
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Download our comprehensive media kit containing logos, executive
              bios, company information, and high-resolution images for press
              use.
            </p>
            <div className="mt-10 flex justify-center">
              <Button asChild className="">
                <Link href="/media-kit">Download Media Kit</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
