import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/nav/header";
import { EventsList } from "@/components/events/events-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function FavoritesPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) redirect("/login");

	const { data: favorites } = await supabase
		.from("favorites")
		.select(`
      event_id,
      events (
        id,
        title,
        description,
        date,
        location,
        category,
        image_url
      )
    `)
		.eq("user_id", user.id);

	const events = (favorites ?? [])
		.map((f) => f.events)
		.filter(Boolean)
		.map((event: any) => ({
			...event,
			isFavorited: true,
		}));

	return (
		<>
			<Header />
			<main className="mx-auto w-full max-w-6xl p-4 md:p-6">
				<div className="mb-4">
					<Button asChild variant="outline" size="sm">
						<Link href="/">Tilbake til oversikt</Link>
					</Button>
				</div>
				<section className="space-y-4">
					<h1 className="text-2xl font-semibold">Dine favoritter</h1>
					<EventsList events={events} isLoggedIn />
				</section>
			</main>
		</>
	);
}
