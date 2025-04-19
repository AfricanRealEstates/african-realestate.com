import { Button } from "@/components/ui/button";
import { getSEOTags } from "@/lib/seo";
import Link from "next/link";

export const metadata = getSEOTags({
  title: "Property Management | African Real Estate",
  canonicalUrlRelative: "/property-management",
});

export default function PropertyManagement() {
  return (
    <div
      className={`w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-[90px] lg:py-[120px]`}
    >
      <div className="mx-auto mt-24 max-w-7xl">
        <div className="rounded-2xl bg-gradient-to-r bg-blue-50 px-6 py-16 sm:p-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Property Management
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Coming soon...
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button asChild className=" w-full sm:w-auto">
                <Link href="/pricing">View Partner Plans</Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/contact">Contact Partnership Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
