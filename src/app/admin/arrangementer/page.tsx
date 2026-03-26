import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatEventDate } from "@/lib/date";
import { createClient } from "@/lib/supabase/server";

export default async function AdminArrangementerPage() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("id, title, date, location, category, organizer_id")
    .order("date", { ascending: true });

  return (
    <main>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Arrangementer
          </h1>
          <p className="text-sm text-muted-foreground">
            Se og rediger alle arrangementer i systemet
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
          <CardDescription>
            {events?.length ?? 0} arrangement funnet
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4">
            {(events ?? []).map((event) => (
              <Card key={event.id} className="border ring-0">
                <CardContent className="py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-lg font-semibold">
                          {event.title}
                        </h2>
                        {event.category ? (
                          <Badge variant="outline">{event.category}</Badge>
                        ) : null}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatEventDate(event.date)}
                        {event.location ? ` • ${event.location}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Arrangør: {event.organizer_id}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/arrangementer/${event.id}/rediger`}>
                          Rediger
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/arrangementer/${event.id}`}>Vis</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
