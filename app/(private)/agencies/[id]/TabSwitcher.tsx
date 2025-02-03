"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyCard from "@/components/properties/new/PropertyCard";
import Pagination from "@/components/globals/Pagination";

interface TabSwitcherProps {
  saleProperties: any[];
  letProperties: any[];
  saleTotalPages: number;
  letTotalPages: number;
  currentPage: number;
}

export default function TabSwitcher({
  saleProperties,
  letProperties,
  saleTotalPages,
  letTotalPages,
  currentPage,
}: TabSwitcherProps) {
  const [activeTab, setActiveTab] = useState("sale");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList>
        <TabsTrigger value="sale">For Sale</TabsTrigger>
        <TabsTrigger value="let">To Let</TabsTrigger>
      </TabsList>
      <TabsContent value="sale">
        <div className="mt-8 grid grid-cols-1 gap-6 md:gap-7 sm:grid-cols-2">
          {saleProperties.map((property: any) => (
            <PropertyCard key={property.id} data={property} />
          ))}
        </div>
        {saleTotalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={saleTotalPages} />
        )}
      </TabsContent>
      <TabsContent value="let">
        <div className="mt-8 grid grid-cols-1 gap-6 md:gap-7 sm:grid-cols-2">
          {letProperties.map((property: any) => (
            <PropertyCard key={property.id} data={property} />
          ))}
        </div>
        {letTotalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={letTotalPages} />
        )}
      </TabsContent>
    </Tabs>
  );
}
