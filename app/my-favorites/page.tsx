import { auth } from "@/auth";
import { getUpvotedProperties } from "@/lib/actions";
import { getSEOTags } from "@/lib/seo";
import { Property } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = getSEOTags({
  title: `My Favorites | African Real Estate`,
  canonicalUrlRelative: "/my-favorites",
});

export default async function MyFavorites() {
  const authenticatedUser = await auth();

  if (!authenticatedUser) {
    redirect("/");
  }

  const products = await getUpvotedProperties();
  return (
    <section className="mx-auto max-w-7xl px-4 pt-32 pb-8 sm:px-6 lg:px-8 md:pt-40">
      {products.length === 0 ? (
        <div>
          <h1 className="text-3xl font-bold">
            You have not favorited any products yet
          </h1>
          <p className="text-gray-400 pt-4">
            Like properties to get started, and they will display here
          </p>
        </div>
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold">Your Favorites</h1>
            <p className="text-gray-500">
              View all the properties you have liked
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {products.map((product: Property) => (
              <Link
                href={`/properties/${product.propertyDetails}/${product.id}`}
                key={product.id}
              >
                <div>
                  <div
                    className="
                        rounded-lg 
                        hover:scale-105 
                        transition-transform
                        duration-300
                        ease-in-out
                        justify-center
                        items-center
                        border

                        
                        "
                  >
                    <Image
                      src={product.coverPhotos[0]}
                      alt="logo"
                      width={1000}
                      height={1000}
                      className="rounded-t-lg object-cover h-40"
                    />

                    <h2 className="font-semibold text-sm p-4">
                      {product.title}
                    </h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
