import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Metadata } from "next";
import { baseUrl } from "@/app/sitemap";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Properties Near You | African Real Estate";
  const description =
    "Explore properties in towns near you. Find your dream home or next investment opportunity in various locations across Africa.";
  const canonicalUrlRelative = "/properties/town";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}${canonicalUrlRelative}`,
      images: [
        {
          url: `${baseUrl}/assets/nearby-towns-og.jpg`,
          width: 1200,
          height: 630,
          alt: "African Real Estate Nearby Towns",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/assets/nearby-towns-og.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}${canonicalUrlRelative}`,
    },
  };
}

// Function to fetch nearby towns and their first property with coverPhoto
async function getNearbyTowns() {
  // Group by nearbyTown and get the count of properties for each town
  const towns = await prisma.property.groupBy({
    by: ["nearbyTown"],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
    take: 50, // Limit to top 50 towns
  });

  // Fetch the first property (coverPhoto) for each town
  const townsWithCoverPhotos = await Promise.all(
    towns.map(async (town) => {
      const firstProperty = await prisma.property.findFirst({
        where: { nearbyTown: town.nearbyTown },
        orderBy: { createdAt: "desc" },
        select: { coverPhotos: true }, // Assuming coverPhotos is an array of image URLs
      });

      return {
        nearbyTown: town.nearbyTown,
        _count: town._count,
        coverPhoto: firstProperty?.coverPhotos[0] || "/assets/kitengela.webp", // Get the first coverPhoto or fallback to null
      };
    })
  );

  return townsWithCoverPhotos;
}

export default async function NearbyTownsPage() {
  const towns = await getNearbyTowns();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Properties Near You | African Real Estate",
            description:
              "Explore properties in towns near you. Find your dream home or next investment opportunity in various locations across Africa.",
            url: `${baseUrl}/properties/town`,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: towns.map((town, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Place",
                  name: town.nearbyTown,
                  url: `${baseUrl}/properties/town/${encodeURIComponent(
                    town.nearbyTown
                  )}`,
                  image: town.coverPhoto,
                  description: `${town._count.id} Properties available in ${town.nearbyTown}`,
                },
              })),
            },
          }),
        }}
      />
      <div className={`w-[95%] lg:max-w-7xl mx-auto py-[100px] lg:py-[160px]`}>
        <h1 className="text-xl lg:text-3xl font-bold my-4 lg:mb-8 text-gray-600">
          Browse Properties by{" "}
          <span className="text-blue-500">Town Near You</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {towns.map((town) => (
            <Link
              key={town.nearbyTown}
              href={`/properties/town/${encodeURIComponent(town.nearbyTown)}`}
              className="border rounded-lg"
            >
              <div className="relative rounded-lg overflow-hidden m-2">
                <Image
                  src={town.coverPhoto || "/assets/kitengela.webp"} // Use the coverPhoto or fallback to a default image
                  alt={`Properties in ${town.nearbyTown}`}
                  width={700}
                  height={500}
                  className="rounded-lg w-full h-[250px] object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <div className="absolute p-4 top-4">
                  <h2 className="text-lg font-semibold text-white capitalize">
                    {town.nearbyTown}
                  </h2>
                  <p className="text-gray-300">{town._count.id} Properties</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
