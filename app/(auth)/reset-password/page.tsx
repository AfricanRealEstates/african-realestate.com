import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ResetPasswordForm from "./ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const { token } = searchParams;

  if (!token) {
    redirect("/forgot-password");
  }

  // Verify token
  const resetRequest = await prisma.passwordReset.findUnique({
    where: { token },
  });

  if (!resetRequest || resetRequest.expires < new Date()) {
    redirect("/reset-password-invalid");
  }

  return <ResetPasswordForm token={token} />;
}
