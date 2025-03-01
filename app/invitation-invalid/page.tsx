import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function InvitationInvalidPage() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Invalid Invitation</h1>
        <p className="mb-6 text-gray-600">
          The invitation link you used is invalid, expired, or has already been
          used.
        </p>
        <p className="mb-8 text-gray-600">
          Please contact our support team for assistance.
        </p>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
}
