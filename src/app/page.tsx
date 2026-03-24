import { createClient } from "@/lib/supabase/server";
import { EventsList } from "@/components/events/events-list";
import { Header } from "@/components/nav/header";

export default async function Home() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("id, title, description, date, location, category, image_url")
    .order("date", { ascending: true });

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl p-4 md:p-6">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Kommende arrangementer</h2>
          <EventsList events={events ?? []} />
        </section>
      </main>
    </>
  );
}