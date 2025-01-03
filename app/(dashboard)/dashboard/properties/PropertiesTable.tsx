"use client";

import { useState } from "react";
import { Property } from "@prisma/client";
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
import {
  Copy,
  Eye,
  MoreVertical,
  SquarePen,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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

interface PropertiesTableProps {
  properties: Property[];
  selectedProperties: string[];
  onPropertySelect: (propertyId: string, isSelected: boolean) => void;
}

export default function PropertiesTable({
  properties,
  selectedProperties,
  onPropertySelect,
}: PropertiesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage, setPropertiesPerPage] = useState(10);

  const totalPages = Math.ceil(properties.length / propertiesPerPage);
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = properties.slice(
    indexOfFirstProperty,
    Math.min(indexOfLastProperty, indexOfFirstProperty + 5)
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePropertiesPerPageChange = (value: string) => {
    setPropertiesPerPage(Number(value));
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="p-4">
                <Checkbox
                  checked={selectedProperties.length === properties.length}
                  onCheckedChange={(checked) => {
                    properties.forEach((property) =>
                      onPropertySelect(property.id, checked === true)
                    );
                  }}
                  disabled={properties.some((property) => property.isActive)} // Disable Select All if any property is active
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
              <th scope="col" className="px-6 py-3">
                Posted on
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Payment Status
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
                      onPropertySelect(property.id, checked === true)
                    }
                    disabled={property.isActive} // Disable checkbox if property is active
                  />
                </td>
                <td className="px-6 py-4">{property.propertyNumber}</td>

                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {property.title.length > 50
                    ? `${property.title.substring(0, 50)}...`
                    : property.title}
                </td>

                <td className="px-6 py-4">{property.propertyDetails}</td>
                <td className="px-6 py-4 inline-flex items-center gap-0.5">
                  <strong>{property.currency}</strong>
                  {property.price.toLocaleString()}
                </td>
                <td className="p-4 text-sm text-gray-500 sm:table-cell">
                  {formatDate(property.createdAt, "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4">{property.status}</td>
                <td className="px-6 py-4">
                  <Badge>{property.isActive ? "Paid" : "Unpaid"}</Badge>
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
        <div className="flex items-center">
          <Select
            onValueChange={handlePropertiesPerPageChange}
            defaultValue="10"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Properties per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="30">30 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-1 justify-between sm:hidden">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{indexOfFirstProperty + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastProperty, properties.length)}
              </span>{" "}
              of <span className="font-medium">{properties.length}</span>{" "}
              results
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <Button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                variant="outline"
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber =
                  currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                return pageNumber <= totalPages ? (
                  <Button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {pageNumber}
                  </Button>
                ) : null;
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                    ...
                  </span>
                  <Button
                    onClick={() => handlePageChange(totalPages)}
                    variant="outline"
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
              <Button
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                variant="outline"
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
