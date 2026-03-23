import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/logout/actions";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-semibold">Innlandet Arrangementer</h1>

      {data.user ? (
        <>
          <p className="text-sm text-muted-foreground">
            Logget inn som {data.user.email}
          </p>

          <div className="flex gap-2">
            <Button asChild variant="default">
              <Link href="/favorites">Gå til favoritter</Link>
            </Button>

            <form action={logout}>
              <Button type="submit" variant="secondary">
                Logg ut
              </Button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex gap-2">
          <Button asChild variant="default">
            <Link href="/login">Logg inn</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/signup">Opprett konto</Link>
          </Button>
        </div>
      )}
    </div>
  );
}