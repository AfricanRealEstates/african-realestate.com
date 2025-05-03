import type { Metadata } from "next";
import { GuideForm } from "../guide-form";

export const metadata: Metadata = {
  title: "Create Guide | African Real Estate",
  description: "Create a new property guide for African Real Estate",
};

export default function NewGuidePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Create New Guide
      </h1>
      <GuideForm />
    </div>
  );
}
