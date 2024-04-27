import { auth } from "@/auth";
import { SignOut } from "@/components/auth/signout-button";
import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminPage() {
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    redirect("/api/auth/signin?callbackUrl=/dashboard/admin");
  }

  if (user.role !== "ADMIN") {
    return (
      <main className="mx-auto my-10">
        <p className="text-center">You are not authorized to view this page.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto my-10 space-y-3">
      <h2 className="text-center text-xl font-bold">Admin page</h2>
      <p className="text-center">Welcome, admin!</p>
      <SignOut />
    </main>
  );
}
