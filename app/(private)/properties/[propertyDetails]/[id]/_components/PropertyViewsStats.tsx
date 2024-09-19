import React from "react";
import prisma from "../../../../../../lib/prisma";
import { Eye } from "lucide-react";
import { formatNumber } from "@/lib/utils";

async function PropertyViewsStats({ propertyId }: { propertyId: string }) {
  const views = await prisma.propertyView.findMany({
    where: { propertyId },
    include: { user: true },
    orderBy: { viewedAt: "desc" },
  });

  return (
    <div>
      {/* <h2>Property Views</h2> */}
      <p className="flex gap-2">
        {" "}
        <Eye />
        {formatNumber(views.length)}
      </p>
      {/* {views.map((view) => (
        <div key={view.id}>
          <p>Viewed at: {view.viewedAt.toLocaleString()}</p>
          <p>Device: {view.deviceType}</p>
          <p>Browser: {view.browser}</p>
          <p>OS: {view.os}</p>
          <p>
            Location: {view.city}, {view.country}
          </p>
        </div>
      ))} */}
    </div>
  );
}

export default PropertyViewsStats;
