import { createClient } from "@/lib/supabase/server";
import { EventsFilters } from "@/components/events/events-filters";
import { EventsList } from "@/components/events/events-list";
import { Header } from "@/components/nav/header";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kategori?: string }>;
}) {
  const { q = "", kategori = "" } = await searchParams;
  const supabase = await createClient();
  let eventsQuery = supabase
    .from("events")
    .select("id, title, description, date, location, category, image_url")
    .order("date", { ascending: true });

  if (q) {
    eventsQuery = eventsQuery.ilike("title", `%${q}%`);
  }

  if (kategori) {
    eventsQuery = eventsQuery.eq("category", kategori);
  }

  const { data: events } = await eventsQuery;
  const { data: categoryRows } = await supabase
    .from("events")
    .select("category")
    .not("category", "is", null);
  const categories = Array.from(
    new Set((categoryRows ?? []).map((row) => row.category).filter(Boolean)),
  ) as string[];

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl p-4 md:p-6">
        <section className="py-10 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Arrangementer Innlandet
          </h1>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Finn og delta på arrangementer som passer til deg. Fra festivaler og konserter til konferanser og kurs.
          </p>
        </div>
      </section>
        <section className="space-y-4">
          <EventsFilters searchQuery={q} category={kategori} categories={categories} />
          <h2 className="text-xl font-semibold mb-6">Kommende arrangementer</h2>
          <EventsList events={events ?? []} />
        </section>
      </main>
    </>
  );
}