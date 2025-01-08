"use client";
import React from "react";
import LoginForm from "./login-form";
import Image from "next/image";

export default function AuthContent() {
  return (
    <section className="flex flex-col">
      <LoginForm />
    </section>
  );
}
