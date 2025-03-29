"use client";
import { useState, useEffect } from "react";
import type { Property as PrismaProperty } from "@prisma/client";
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
import { Copy, Eye, MoreVertical, SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";
import IconMenu from "@/components/globals/icon-menu";
import { deleteProperty } from "./deleteProperty";
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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

type Property = Omit<PrismaProperty, "expiryDate"> & {
  expiryDate: Date | null;
};

interface PropertiesTableProps {
  properties: Property[];
  selectedProperties: string[];
  onPropertySelect: (
    propertyId: string,
    propertyNumber: number,
    isSelected: boolean
  ) => void;
}

export default function PropertiesTable({
  properties,
  selectedProperties,
  onPropertySelect,
}: PropertiesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage, setPropertiesPerPage] = useState(10);
  const [localProperties, setLocalProperties] = useState(properties);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setLocalProperties(properties);
  }, [properties]);

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
    const unpaidProperties = localProperties.filter(
      (property) => !property.isActive
    );
    unpaidProperties.forEach((property) => {
      onPropertySelect(property.id, property.propertyNumber, true);
    });
  };

  const handleDeleteProperty = (propertyId: string) => {
    setPropertyToDelete(propertyId);
    router.refresh();
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPropertyToDelete(null);
  };

  const confirmDeleteProperty = async () => {
    if (propertyToDelete) {
      try {
        setIsLoading(true);
        const result = await deleteProperty(propertyToDelete);
        if (result.success) {
          setLocalProperties((prevProperties) =>
            prevProperties.filter((p) => p.id !== propertyToDelete)
          );
          router.refresh();
          toast({
            title: "Property deleted",
            description: "The property has been successfully deleted.",
            variant: "default",
          });
        }
      } catch (error: any) {
        console.error("Failed to delete property:", error);
        toast({
          title: "Error",
          description:
            error.message || "Failed to delete the property. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    handleCloseDeleteModal();
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="p-4">
              <Checkbox
                checked={
                  selectedProperties.length ===
                  localProperties.filter((p) => !p.isActive).length
                }
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleSelectAllUnpaid();
                  } else {
                    localProperties.forEach((property) =>
                      onPropertySelect(
                        property.id,
                        property.propertyNumber,
                        false
                      )
                    );
                  }
                }}
              />
            </th>
            <th scope="col" className="px-4 py-3">
              ID
            </th>
            <th scope="col" className="px-4 py-3">
              Name
            </th>
            <th scope="col" className="px-4 py-3 hidden sm:table-cell">
              Price
            </th>
            <th scope="col" className="px-4 py-3 hidden sm:table-cell">
              Status
            </th>
            <th scope="col" className="px-4 py-3 hidden sm:table-cell">
              Expiry
            </th>
            <th scope="col" className="px-4 py-3">
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
                    onPropertySelect(
                      property.id,
                      property.propertyNumber,
                      checked === true
                    )
                  }
                  disabled={property.isActive}
                />
              </td>
              <td className="px-4 py-4">{property.propertyNumber}</td>
              <td className="px-4 py-4 font-medium text-gray-900">
                {property.isActive ? (
                  <Link
                    href={`/properties/${property.propertyDetails}/${property.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {property.title.length > 20
                      ? `${property.title.substring(0, 20)}...`
                      : property.title}
                  </Link>
                ) : (
                  <span className="text-gray-500 cursor-not-allowed">
                    {property.title.length > 20
                      ? `${property.title.substring(0, 20)}...`
                      : property.title}
                  </span>
                )}
              </td>
              <td className="px-4 py-4 hidden sm:table-cell">
                <span className="whitespace-nowrap">
                  <strong>{property.currency}</strong>
                  {property.price.toLocaleString()}
                </span>
              </td>
              <td className="px-4 py-4 hidden sm:table-cell">
                <Badge variant={property.isActive ? "default" : "destructive"}>
                  {property.isActive ? "Published" : "Unpublished"}
                </Badge>
              </td>
              <td className="px-4 py-4 hidden sm:table-cell">
                {property.expiryDate
                  ? new Date(property.expiryDate).toLocaleDateString("en-US")
                  : "No Expiry"}
              </td>
              <td className="p-4 text-sm font-medium">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
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
                          icon={<Eye className="mr-2 h-4 w-4" />}
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
                          icon={<Copy className="mr-2 h-4 w-4" />}
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
                          icon={<SquarePen className="mr-2 h-4 w-4" />}
                        />
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => {
                        handleDeleteProperty(property.id);
                      }}
                    >
                      <button
                        type="button"
                        className="flex w-full items-center text-red-500"
                      >
                        <IconMenu
                          text="Delete"
                          icon={<Trash2 className="mr-2 h-4 w-4" />}
                        />
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex items-center justify-between gap-4 sm:flex-row">
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <Select
            onValueChange={handlePropertiesPerPageChange}
            defaultValue={propertiesPerPage.toString()}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="30">30 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground text-center sm:text-left hidden lg:block">
            Showing {indexOfFirstProperty + 1}-
            {Math.min(indexOfLastProperty, localProperties.length)} of{" "}
            {localProperties.length} properties
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                {currentPage > 1 && (
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                  />
                )}
              </PaginationItem>
              {totalPages <= 5 ? (
                Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      onClick={() => handlePageChange(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))
              ) : (
                <>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageChange(1)}
                      isActive={currentPage === 1}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {currentPage > 3 && <PaginationEllipsis />}
                  {currentPage === totalPages && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(currentPage - 2)}
                      >
                        {currentPage - 2}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  {currentPage > 2 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        {currentPage - 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  {currentPage !== 1 && currentPage !== totalPages && (
                    <PaginationItem>
                      <PaginationLink isActive>{currentPage}</PaginationLink>
                    </PaginationItem>
                  )}
                  {currentPage < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        {currentPage + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  {currentPage === 1 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(currentPage + 2)}
                      >
                        {currentPage + 2}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  {currentPage < totalPages - 2 && <PaginationEllipsis />}
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageChange(totalPages)}
                      isActive={currentPage === totalPages}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    if (currentPage < totalPages) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this property?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              property from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteModal}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteProperty}
              className={`bg-rose-500 hover:bg-rose-400 transition-all ${
                isLoading ? "opacity-50 pointer-events-none" : ""
              }`}
              disabled={isLoading} // Disable the button when loading
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
