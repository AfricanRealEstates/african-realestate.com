import { auth } from "@/auth";
import RoleComboBox from "@/components/crm/role-combobox";
import Logo from "@/components/globals/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/utils/Button";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function Onboarding() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }
  return (
    <section className="max-w-5xl  mx-auto flex-col items-center justify-between gap-4">
      <div>
        <h1 className="text-center text-3xl">
          Welcome, <span className="ml-2 font-bold">{user.name}! 👋️</span>
        </h1>
        <h2 className="mt-4 text-center text-lg text-gray-400">
          Let&apos;s get started by setting up your agency
        </h2>
        <h3 className="mt-2 text-center text-sm text-gray-400">
          You can change these settings at any time.
        </h3>
      </div>
      <Separator className="mt-5" />
      <Card className="w-full my-10">
        <CardHeader>
          <CardTitle>Agent</CardTitle>
          <CardDescription>
            Set your default role as{" "}
            <span className="font-bold text-indigo-500">Agent</span> to create
            listings
          </CardDescription>
        </CardHeader>
        <CardContent>{/* <RoleComboBox /> */}</CardContent>
      </Card>
      <Separator className="my-6" />
      <Button className="w-full" color="blue">
        <Link href="/agent/properties/create-property">
          I&apos;m done! Let&apos;s create a listing
        </Link>
      </Button>
      {/* <div className="mt-8">
        <Logo />
      </div> */}
    </section>
  );
}
