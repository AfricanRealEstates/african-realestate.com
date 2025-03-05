import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserById } from "./use-actions";
import ProfileForm from "./components/profile-form";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await getUserById(session.user.id!);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and profile information
        </p>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}
