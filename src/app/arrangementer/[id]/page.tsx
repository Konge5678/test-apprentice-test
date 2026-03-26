import Link from "next/link";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/events/favorite-button";
import { Header } from "@/components/nav/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatEventDateDetailed } from "@/lib/date";
import { createClient } from "@/lib/supabase/server";

export default async function ArrangementDetaljPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: event, error } = await supabase
    .from("events")
    .select("id, title, description, date, location, category, image_url")
    .eq("id", id)
    .maybeSingle();

  if (error || !event) {
    notFound();
  }

  let isFavorited = false;
  if (user) {
    const { data: favorite } = await supabase
      .from("favorites")
      .select("event_id")
      .eq("user_id", user.id)
      .eq("event_id", event.id)
      .maybeSingle();
    isFavorited = Boolean(favorite);
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl p-4 md:p-6">
        <div className="mb-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/">Tilbake til oversikt</Link>
          </Button>
        </div>

        <Card className="ring-0 border">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={`Bilde for ${event.title}`}
              className="h-56 w-full object-cover sm:h-72 md:h-80"
            />
          ) : null}

          <CardContent className="space-y-4 pt-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h1 className="text-2xl font-semibold">{event.title}</h1>
              <div className="flex items-center gap-1">
                {event.category ? (
                  <Badge variant="outline">{event.category}</Badge>
                ) : null}
                <FavoriteButton
                  eventId={event.id}
                  isFavorited={isFavorited}
                  isLoggedIn={Boolean(user)}
                />
              </div>
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              <p>{formatEventDateDetailed(event.date)}</p>
              <p>{event.location || "Sted ikke oppgitt"}</p>
            </div>

            <p className="leading-7">
              {event.description || "Ingen beskrivelse tilgjengelig."}
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
