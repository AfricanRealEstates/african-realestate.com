import { getUserById } from "@/actions/users";
import VerifyTokenForm from "@/components/auth/verify-token-form";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Verify Account | African Real Estate",
};

export default async function VerifyAccount({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = await getUserById(id);
  const userToken = user?.token;
  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-16 md:px-10 md:py-24 lg:py-32">
      <div className="max-w-xl mx-auto px-8 py-12  bg-gray-200 rounded-lg space-y-6">
        <h2 className="text-3xl font-bold md:text-5xl text-blue-300">
          Create your account
        </h2>
        <VerifyTokenForm userToken={userToken} id={id} />
      </div>
    </section>
  );
}
