import { signOut } from "@/auth";
import { Button } from "../utils/Button";

export function SignOut() {
  return (
    <main className="px-3 py-10">
      <section className="mx-auto max-w-7xl space-y-6">
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button variant="solid" color="gray" type="submit">
            Sign Out
          </Button>
        </form>
      </section>
    </main>
  );
}
