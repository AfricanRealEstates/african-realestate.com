import React from "react";
import LoginForm from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | African Real Estate",
};
export default function Login() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}
