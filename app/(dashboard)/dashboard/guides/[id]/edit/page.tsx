import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideForm } from "../../guide-form";
import { getGuideById } from "../../actions";

interface EditGuidePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: EditGuidePageProps): Promise<Metadata> {
  const guide = await getGuideById(params.id);

  if (!guide) {
    return {
      title: "Guide Not Found | African Real Estate",
    };
  }

  return {
    title: `Edit ${guide.title} | African Real Estate`,
    description: `Edit property guide for ${guide.propertyType}`,
  };
}

export default async function EditGuidePage({ params }: EditGuidePageProps) {
  const guide = await getGuideById(params.id);

  if (!guide) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Edit Guide</h1>
      <GuideForm guide={guide} />
    </div>
  );
}
