"use client";

import { useState, useEffect, useRef } from "react";
import PropertyCard from "@/components/properties/new/PropertyCard";
import { PropertyData } from "@/lib/types";
import Loader from "@/components/globals/loader";
import { getProperties } from "./getProperties";
import { Property } from "@prisma/client";
import InfiniteScrollLoader from "./InfiniteScrollLoader";

interface InfinitePropertyListProps {
  initialProperties: Property[];
  searchParams: { [key: string]: string | string[] | undefined };
  status: string;
}

export default function InfinitePropertyList({
  initialProperties,
  searchParams,
  status,
}: InfinitePropertyListProps) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  useEffect(() => {
    setProperties(initialProperties);
    setPage(1);
    setHasMore(true);
  }, [searchParams]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, []);

  const handleObserver = (entities: IntersectionObserverEntry[]) => {
    const target = entities[0];
    if (target.isIntersecting && !loading && hasMore) {
      loadMore();
    }
  };

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    const nextPage = page + 1;
    const newProperties: any = await getProperties(
      searchParams,
      status,
      nextPage,
      12
    );
    if (newProperties.length === 0) {
      setHasMore(false);
    } else {
      setProperties((prev) => [...prev, ...newProperties]);
      setPage(nextPage);
    }
    setLoading(false);
  };

  if (properties.length === 0) {
    return (
      <div className="flex h-full items-center justify-center mt-8">
        No properties matched your search query. Please try again with a
        different term.
      </div>
    );
  }

  return (
    <>
      <section className="mx-auto mb-8 gap-8 grid w-full grid-cols-[repeat(auto-fill,minmax(335px,1fr))] justify-center">
        {properties.map((property) => (
          <PropertyCard data={property as any} key={property.id} />
        ))}
      </section>
      {hasMore && (
        <div ref={loader} className="flex justify-center">
          <InfiniteScrollLoader />
        </div>
      )}
    </>
  );
}
