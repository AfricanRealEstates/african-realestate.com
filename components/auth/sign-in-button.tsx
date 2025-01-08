import { signIn } from "@/auth";
import React from "react";
import { Button } from "../utils/Button";
import { redirect } from "next/navigation";

export default function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <Button type="submit" color="cyan">
        Sign in
      </Button>
    </form>
  );
}
