import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RegisterForm from "@/components/auth/register-form";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const { token } = searchParams;

  // If token is provided, verify it's valid
  if (token) {
    const invitation = await prisma.invitation.findUnique({
      where: { token },
    });

    if (
      !invitation ||
      invitation.acceptedAt ||
      invitation.revokedAt ||
      invitation.expiresAt < new Date()
    ) {
      redirect("/invitation-invalid");
    }

    // Pass the invitation details to the form
    return <RegisterForm invitationEmail={invitation.email} token={token} />;
  }

  // Regular registration without invitation
  return <RegisterForm />;
}
