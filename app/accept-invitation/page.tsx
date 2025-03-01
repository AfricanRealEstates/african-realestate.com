import { redirect } from "next/navigation";
import { acceptInvitation } from "../(dashboard)/dashboard/blogs/actions";

export default async function AcceptInvitationPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const { token } = searchParams;

  if (!token) {
    redirect("/");
  }

  try {
    await acceptInvitation(token);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-4">Invitation Accepted</h1>
        <p className="text-xl mb-4">
          You can now contribute to the African Real Estate blog.
        </p>
        <a
          href="/blog"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Go to Blog Dashboard
        </a>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-4">Error</h1>
        <p className="text-xl mb-4">
          {error instanceof Error ? error.message : "An error occurred"}
        </p>
        <a
          href="/"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Go to Home
        </a>
      </div>
    );
  }
}
