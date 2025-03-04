import LoginForm from "@/components/auth/login-form";
import { getSEOTags } from "@/lib/seo";
import { Suspense } from "react";

export const metadata = getSEOTags({
  title: "Login | African Real Estate",
  canonicalUrlRelative: "/login",
});

export default function Login() {
  return (
    <div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
