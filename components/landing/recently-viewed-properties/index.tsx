import { cookies } from "next/headers";
import { getRecentlyViewedProperties } from "@/actions/getRecentlyViewedProperties";
import RecentlyViewedPropertiesScript from "./RecentlyViewedPropertiesScript";
import PropertyCarousel from "../property-carousel";

export default async function RecentlyViewedProperties() {
  // This component will render a client component that handles localStorage
  // and a server component that fetches the properties
  return (
    <>
      {/* Client-side script to pass localStorage data to server */}
      <RecentlyViewedPropertiesScript />

      {/* Server component with client wrapper */}
      <RecentlyViewedPropertiesLoader />
    </>
  );
}

async function RecentlyViewedPropertiesLoader() {
  // Get property IDs from cookies (set by the script component)
  const propertyIdsCookie = cookies().get("recentlyViewedProperties");
  const propertyIds = propertyIdsCookie
    ? JSON.parse(propertyIdsCookie.value)
    : [];

  // If no property IDs, don't render anything
  if (!propertyIds.length) {
    return null;
  }

  // Fetch properties using server action
  const properties = await getRecentlyViewedProperties(propertyIds);

  // If no properties found, don't render anything
  if (!properties.length) {
    return null;
  }

  return (
    // <RecentlyViewedPropertiesClient>
    //   <article className="mx-auto mb-8 gap-8 grid w-full max-w-screen-xl grid-cols-[repeat(auto-fill,_minmax(335px,1fr))] justify-center">
    //     {properties.slice(0, 3).map((property) => (
    //       <PropertyCard key={property.id} data={property} />
    //     ))}
    //   </article>
    // </RecentlyViewedPropertiesClient>
    <>
      <PropertyCarousel
        properties={properties}
        title="Properties For You"
        subtitle="Based on properties you recently viewed"
      />
    </>
  );
}
