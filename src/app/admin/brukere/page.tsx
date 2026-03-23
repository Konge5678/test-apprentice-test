import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateUserRole } from "@/app/admin/brukere/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const roleOptions = [
  { value: "user", label: "Bruker" },
  { value: "organizer", label: "Arrangør" },
  { value: "admin", label: "Admin" },
] as const;

function roleBadge(role: string) {
  if (role === "admin") {
    return (
      <Badge className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100">
        Admin
      </Badge>
    );
  }

  if (role === "organizer") {
    return (
      <Badge className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">
        Arrangør
      </Badge>
    );
  }

  return (
    <Badge className="border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100">
      Bruker
    </Badge>
  );
}

function maskId(id: string) {
  if (id.length < 8) return id;
  return `${id.slice(0, 4)}...${id.slice(-4)}`;
}

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .order("full_name", { ascending: true });

  return (
    <main>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Brukere og roller</h1>
          <p className="text-sm text-muted-foreground">
            Oppdater rolle for brukere i systemet
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/admin">Adminpanel</Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/">Forside</Link>
          </Button>
        </div>
      </div>

      <Card className="ring-0">
        <CardHeader>
          <CardTitle>Oversikt</CardTitle>
          <CardDescription>{profiles?.length ?? 0} bruker(e) funnet</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="border-b border-border/70">
                  <th scope="col" className="px-4 py-3 text-left font-medium">
                    Navn
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">
                    E-post
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">
                    Nåværende rolle
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">
                    Endre rolle
                  </th>
                </tr>
              </thead>

              <tbody>
                {profiles?.map((p) => (
                  <tr key={p.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium">{p.full_name || "Uten navn"}</div>
                      <div className="text-xs text-muted-foreground" title={p.id}>
                        {maskId(p.id)}
                      </div>
                    </td>

                    <td className="px-4 py-3 align-top">{p.email}</td>

                    <td className="px-4 py-3 align-top">{roleBadge(p.role)}</td>

                    <td className="px-4 py-3 align-top">
                      <form
                        action={updateUserRole}
                        className="flex flex-col gap-2 sm:flex-row sm:items-center"
                      >
                        <input type="hidden" name="userId" value={p.id} />
                        <select
                          name="role"
                          defaultValue={p.role}
                          aria-label={`Velg ny rolle for ${p.full_name || "bruker"}`}
                          className="h-9 min-w-40 rounded-md border border-input bg-background px-3 text-sm"
                        >
                          {roleOptions.map((r) => (
                            <option key={r.value} value={r.value}>
                              {r.label}
                            </option>
                          ))}
                        </select>
                        <Button type="submit" size="sm">
                          Lagre
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}