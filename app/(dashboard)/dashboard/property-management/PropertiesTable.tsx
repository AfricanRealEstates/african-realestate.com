import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import PropertyStatusToggle from "./PropertyStatusToggle";
import ContactAgentDialog from "./ContactAgentsDialog";

export default async function PropertiesTable({
  status,
  page,
  search,
}: {
  status?: string;
  page: number;
  search?: string;
}) {
  const limit = 10;
  const skip = (page - 1) * limit;
  const whereClause: any = {};

  if (status === "active") whereClause.isActive = true;
  if (status === "inactive") whereClause.isActive = false;

  // Add search functionality
  if (search) {
    // Check if search is a number (for propertyNumber)
    const isNumeric = /^\d+$/.test(search);

    whereClause.OR = [
      // If search is numeric, search by propertyNumber as a number
      ...(isNumeric ? [{ propertyNumber: Number.parseInt(search, 10) }] : []),
      // Text-based searches
      { title: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { country: { contains: search, mode: "insensitive" } },
      { county: { contains: search, mode: "insensitive" } },
      { locality: { contains: search, mode: "insensitive" } },
      { propertyType: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  // Fetch properties with pagination
  const properties = await prisma.property.findMany({
    where: whereClause,
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { likes: true, ratings: true } },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });

  if (properties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {search
            ? `No properties found matching "${search}"`
            : "No properties found"}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left">Property</th>
            <th className="px-4 py-2 text-left">Owner</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Created</th>
            <th className="px-4 py-2 text-left">Engagement</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 relative rounded-md overflow-hidden">
                    <Image
                      src={property.coverPhotos?.[0] || "/house-1.jpg"}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium truncate max-w-[200px]">
                      {property.title}
                    </p>
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">
                        {property.location}
                      </p>
                      {property.propertyNumber && (
                        <Badge variant="outline" className="text-xs">
                          #{property.propertyNumber}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm">{property.user.name}</p>
                <p className="text-xs text-gray-500">{property.user.email}</p>
              </td>
              <td className="px-4 py-4">
                {property.isActive ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    Active
                  </Badge>
                ) : (
                  <Badge
                    variant="destructive"
                    className="bg-red-100 text-red-800 hover:bg-red-100"
                  >
                    Inactive
                  </Badge>
                )}
              </td>
              <td className="px-4 py-4">
                <p className="text-sm font-medium">
                  {property.currency} {property.price.toLocaleString()}
                </p>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm">
                  {format(property.createdAt, "MMM d, yyyy")}
                </p>
              </td>
              <td className="px-4 py-4">
                <div className="flex space-x-2">
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                    {property._count.likes} likes
                  </span>
                  <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
                    {property._count.ratings} ratings
                  </span>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex space-x-2">
                  <Link
                    href={`/properties/${property.propertyDetails}/${property.id}`}
                    target="_blank"
                  >
                    <Button size="icon" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <ContactAgentDialog
                    property={property}
                    trigger={
                      <Button size="icon" variant="ghost">
                        <Mail className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <PropertyStatusToggle
                    propertyId={property.id}
                    isActive={property.isActive}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
