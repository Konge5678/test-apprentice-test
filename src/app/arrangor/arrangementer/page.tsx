import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEventDate } from "@/lib/date";
import { createClient } from "@/lib/supabase/server";

export default async function ArrangorArrangementerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: events, error } = await supabase
    .from("events")
    .select("id, title, date, location, category, image_url, organizer_id")
    .eq("organizer_id", user.id)
    .order("date", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Arrangør</p>
          <h1 className="text-2xl font-semibold">Mine arrangementer</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/arrangor/arrangementer/ny">Nytt arrangement</Link>
          </Button>
        </div>
      </div>

      {error ? (
        <Card>
          <CardHeader>
            <CardTitle>Noe gikk galt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Klarte ikke å hente arrangementene dine. Prøv igjen.
            </p>
          </CardContent>
        </Card>
      ) : (events ?? []).length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Ingen arrangementer enda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Når du oppretter et arrangement, vil det dukke opp her.
            </p>
            <Button asChild>
              <Link href="/arrangor/arrangementer/ny">Opprett ditt første</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
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
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={`/arrangor/arrangementer/${event.id}/rediger`}>
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
      )}
    </div>
  );
}
