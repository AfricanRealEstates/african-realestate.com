import { Metadata } from "next";
import DiscountsManager from "./DiscountManager";

export const metadata: Metadata = {
  title: "Manage Discounts",
  description: "Admin panel for managing discount codes",
};

export default function DiscountsPage() {
  return (
    <div className="container mx-auto py-10 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">
        Manage Discounts
      </h1>
      <DiscountsManager />
    </div>
  );
}
