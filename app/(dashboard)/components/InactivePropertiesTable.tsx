"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";

type Property = {
  id: string;
  title: string;
  county: string;
  locality: string;
  price: number;
  currency: string;
  isActive: boolean;
  expiryDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string | null;
    email: string | null;
    phoneNumber: string | null;
  };
};

type InactivePropertiesTableProps = {
  inactiveProperties: {
    properties: Property[];
    currentPage: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
};

export default function InactivePropertiesTable({
  inactiveProperties,
  onPageChange,
}: InactivePropertiesTableProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inactiveProperties.properties.map((property) => (
            <TableRow key={property.id}>
              <TableCell className="font-medium">{property.title}</TableCell>
              <TableCell>
                {property.county}, {property.locality}
              </TableCell>
              <TableCell>
                {property.currency} {property.price.toLocaleString()}
              </TableCell>
              <TableCell>{property.user.name}</TableCell>
              <TableCell>
                <Badge variant="destructive">Inactive</Badge>
                {property.expiryDate &&
                  new Date(property.expiryDate) < new Date() && (
                    <Badge variant="outline" className="ml-2">
                      Expired
                    </Badge>
                  )}
              </TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedProperty(property)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Property Details</DialogTitle>
                    </DialogHeader>
                    {selectedProperty && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {selectedProperty.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {selectedProperty.county},{" "}
                            {selectedProperty.locality}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Price</p>
                            <p>
                              {selectedProperty.currency}{" "}
                              {selectedProperty.price.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Status</p>
                            <Badge variant="destructive">Inactive</Badge>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Created</p>
                            <p>
                              {new Date(
                                selectedProperty.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Last Updated</p>
                            <p>
                              {new Date(
                                selectedProperty.updatedAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          {selectedProperty.expiryDate && (
                            <div className="col-span-2">
                              <p className="text-sm font-medium">Expiry Date</p>
                              <p>
                                {new Date(
                                  selectedProperty.expiryDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium mb-2">
                            Owner Information
                          </h4>
                          <p>
                            <span className="font-medium">Name:</span>{" "}
                            {selectedProperty.user.name}
                          </p>
                          <p>
                            <span className="font-medium">Email:</span>{" "}
                            {selectedProperty.user.email}
                          </p>
                          {selectedProperty.user.phoneNumber && (
                            <p>
                              <span className="font-medium">Phone:</span>{" "}
                              {selectedProperty.user.phoneNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {inactiveProperties.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(inactiveProperties.currentPage - 1)}
            disabled={inactiveProperties.currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {inactiveProperties.currentPage} of{" "}
            {inactiveProperties.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(inactiveProperties.currentPage + 1)}
            disabled={
              inactiveProperties.currentPage === inactiveProperties.totalPages
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
