import { Suspense } from "react";
import { notFound } from "next/navigation";
import { UserPermissionsForm } from "./permissions-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSupportUser } from "../../actions";

export default async function UserPermissionsPage({
  params,
}: {
  params: { id: string };
}) {
  let user;

  try {
    user = await getSupportUser(params.id);
  } catch (error) {
    notFound();
  }

  return (
    <section className="px-4 pt-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/support">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold text-blue-600">
          Manage User Permissions
        </h1>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-medium">{user.name}</h2>
        <p className="text-muted-foreground">{user.email}</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <UserPermissionsForm user={user} />
      </Suspense>
    </section>
  );
}
