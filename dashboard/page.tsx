import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getSEOTags } from "@/lib/seo";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = getSEOTags({
  title: "Dashboard | African Real Estate",
  canonicalUrlRelative: "/",
});

export default async function Dashboard() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }
  // fetch all users from database
  const users = await prisma.user.findMany({});
  return (
    <main className="p-2">
      <p>main dashboard</p>
      <h2>users</h2>
    </main>

    // <div className="grid h-screen place-content-center">
    //   {users.map((user) => {
    //     return (
    //       <Link href={`/dashboard/users/${user.id}`} key={user.id}>
    //         {user.name || `User ${user.id}`}
    //       </Link>
    //     );
    //   })}
    // </div>
  );
}
