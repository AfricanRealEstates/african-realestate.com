import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import { getSEOTags } from "@/lib/seo";

export const metadata = getSEOTags({
  title: "Forgot Password | African Real Estate",
  canonicalUrlRelative: "/forgot-password",
});

export default function ForgotPassword() {
  return (
    <div>
      <ForgotPasswordForm />
    </div>
  );
}
