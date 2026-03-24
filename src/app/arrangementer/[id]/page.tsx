import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/nav/header";
import { formatEventDateDetailed } from "@/lib/date";

export default async function ArrangementDetaljPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event, error } = await supabase
    .from("events")
    .select("id, title, description, date, location, category, image_url")
    .eq("id", id)
    .maybeSingle();

  if (error || !event) {
    notFound();
  }

  return (
    <>
      <Header />
    <main className="mx-auto w-full max-w-3xl p-4 md:p-6">
      <div className="mb-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/">Tilbake til oversikt</Link>
        </Button>
      </div>
      <Card className="ring-0 border">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <CardTitle className="text-2xl">{event.title}</CardTitle>
            {event.category ? <Badge variant="outline">{event.category}</Badge> : null}
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>{formatEventDateDetailed(event.date)}</p>
            <p>{event.location || "Sted ikke oppgitt"}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={`Bilde for ${event.title}`}
              className="w-full rounded-lg border object-cover"
            />
          ) : null}
          <p className="leading-7">{event.description || "Ingen beskrivelse tilgjengelig."}</p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
