import { Header } from "@/components/nav/header";
import { createClient } from "@/lib/supabase/server";
import { EventsList } from "@/components/events/events-list";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

type FavoriteEvent = {
	id: string;
	title: string;
	description: string | null;
	date: string;
	location: string | null;
	category: string | null;
	image_url: string | null;
};

type FavoriteRow = {
	event_id: string;
	events: FavoriteEvent | null;
};

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

	const rows = (favorites ?? []) as unknown as FavoriteRow[];

	const events = rows
		.map((f) => f.events)
		.filter((e): e is FavoriteEvent => Boolean(e))
		.map((event) => ({
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
