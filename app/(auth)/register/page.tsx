import RegisterForm from "@/components/auth/register-form";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Register | African Real Estate",
};

export default function Register() {
  return (
    <div className="">
      <RegisterForm />
    </div>
  );
}
