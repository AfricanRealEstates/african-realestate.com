"use client";

import { useState, useEffect } from "react";
import { Property as PrismaProperty } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Eye, MoreVertical, SquarePen, Trash2 } from 'lucide-react';
import Link from "next/link";
import IconMenu from "@/components/globals/icon-menu";
import { deleteProperty } from "./deleteProperty";
import { formatDate } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";

type Property = Omit<PrismaProperty, 'expiryDate'> & { expiryDate: Date | null };

interface PropertiesTableProps {
  properties: Property[];
  selectedProperties: string[];
  onPropertySelect: (propertyId: string, propertyNumber: number, isSelected: boolean) => void;
  // paymentSuccess: boolean;
}

export default function PropertiesTable({
  properties,
  selectedProperties,
  onPropertySelect,
  // paymentSuccess,
}: PropertiesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage, setPropertiesPerPage] = useState(10);
  const [localProperties, setLocalProperties] = useState(properties);

  useEffect(() => {
    setLocalProperties(properties);
  }, [properties]);

  // useEffect(() => {
  //   if (paymentSuccess) {
  //     refreshProperties();
  //   }
  // }, [paymentSuccess]);

  // const refreshProperties = async () => {
  //   try {
  //     const response = await fetch('/api/properties'); // Adjust this endpoint as needed
  //     if (response.ok) {
  //       const updatedProperties = await response.json();
  //       setLocalProperties(updatedProperties);
  //       toast.success("Properties updated successfully");
  //     } else {
  //       throw new Error('Failed to fetch updated properties');
  //     }
  //   } catch (error) {
  //     console.error('Error refreshing properties:', error);
  //     toast.error("Failed to refresh properties");
  //   }
  // };

  const totalPages = Math.ceil(localProperties.length / propertiesPerPage);
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = localProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePropertiesPerPageChange = (value: string) => {
    setPropertiesPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleSelectAllUnpaid = () => {
    const unpaidProperties = localProperties.filter((property) => !property.isActive);
    unpaidProperties.forEach((property) => {
      onPropertySelect(property.id, property.propertyNumber, true);
    });
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="p-4">
                <Checkbox
                  checked={selectedProperties.length === localProperties.filter((p) => !p.isActive).length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleSelectAllUnpaid();
                    } else {
                      localProperties.forEach((property) =>
                        onPropertySelect(property.id, property.propertyNumber, false)
                      );
                    }
                  }}
                />
              </th>
              <th scope="col" className="px-6 py-3">
                Property ID
              </th>
              <th scope="col" className="px-6 py-3">
                Property Name
              </th>
              <th scope="col" className="px-6 py-3">
                Property Details
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              {/* <th scope="col" className="px-6 py-3">
                Posted on
              </th> */}
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Payment Status
              </th>
              <th scope="col" className="px-6 py-3">
                Expiry Date
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentProperties.map((property) => (
              <tr
                key={property.id}
                className="bg-white border-b hover:bg-gray-50"
              >
                <td className="w-4 p-4">
                  <Checkbox
                    checked={selectedProperties.includes(property.id)}
                    onCheckedChange={(checked) =>
                      onPropertySelect(property.id, property.propertyNumber, checked === true)
                    }
                    disabled={property.isActive}
                  />
                </td>
                <td className="px-6 py-4">{property.propertyNumber}</td>
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {property.isActive ? (
                    <Link
                      href={`/properties/${property.propertyDetails}/${property.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {property.title.length > 30
                        ? `${property.title.substring(0, 30)}...`
                        : property.title}
                    </Link>
                  ) : (
                    <span className="text-gray-500 cursor-not-allowed">
                      {property.title.length > 30
                        ? `${property.title.substring(0, 30)}...`
                        : property.title}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">{property.propertyDetails}</td>
                <td className="px-6 py-4 inline-flex items-center gap-0.5">
                  <strong>{property.currency}</strong>
                  {property.price.toLocaleString()}
                </td>
                {/* <td className="p-4 text-sm text-gray-500 sm:table-cell">
                  {formatDate(property.createdAt, "MMM d, yyyy")}
                </td> */}
                <td className="px-6 py-4">{property.status}</td>
                <td className="px-6 py-4">
                  <Badge
                    variant={property.isActive ? "default" : "destructive"}
                  >
                    {property.isActive ? "Published" : "Unpublished"}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  {property.expiryDate ? (
                    formatDate(property.expiryDate, "MMM d, yyyy")
                  ) : (
                    <span className="text-gray-400">Not set</span>
                  )}
                </td>
                <td className="p-4 text-sm font-medium">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="size-8 p-0 data-[state=open]:bg-muted"
                      >
                        <MoreVertical className="size-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/properties/${property.propertyDetails}/${property.id}`}
                          className="flex w-full items-center"
                        >
                          <IconMenu
                            text="View"
                            icon={<Eye className="size-4 mr-2" />}
                          />
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/agent/properties/create-property/?cloneFrom=${property.id}`}
                          className="flex w-full items-center"
                        >
                          <IconMenu
                            text="Duplicate"
                            icon={<Copy className="size-4 mr-2" />}
                          />
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/agent/properties/edit-property/${property.id}`}
                          className="flex w-full items-center"
                        >
                          <IconMenu
                            text="Edit"
                            icon={<SquarePen className="size-4 mr-2" />}
                          />
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <form action={deleteProperty.bind(null, property.id)}>
                          <button
                            type="submit"
                            className="flex w-full items-center text-red-500"
                          >
                            <IconMenu
                              text="Delete"
                              icon={<Trash2 className="size-4 mr-2" />}
                            />
                          </button>
                        </form>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between space-x-2 w-full">
          <Select
            onValueChange={handlePropertiesPerPageChange}
            defaultValue={propertiesPerPage.toString()}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Properties per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="30">30 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Showing {indexOfFirstProperty + 1} to {Math.min(indexOfLastProperty, localProperties.length)} of {localProperties.length} results
          </p>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {currentPage > 1 ? (
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                />
              ) : (
                <PaginationPrevious
                  onClick={() => { }}
                  className="cursor-not-allowed opacity-50"
                />
              )}
            </PaginationItem>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
              return pageNumber <= totalPages ? (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    onClick={() => handlePageChange(pageNumber)}
                    isActive={currentPage === pageNumber}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ) : null;
            })}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            <PaginationItem>
              {currentPage < totalPages ? (
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                />
              ) : (
                <PaginationNext
                  onClick={() => { }}
                  className="cursor-not-allowed opacity-50"
                />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

