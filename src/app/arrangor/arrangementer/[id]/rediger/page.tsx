import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { EditEventForm } from "./edit-form";

export default async function RedigerArrangementPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	const { data: profile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.maybeSingle();

	const { data: event, error } = await supabase
		.from("events")
		.select(
			"id, title, date, location, category, description, image_url, organizer_id",
		)
		.eq("id", id)
		.maybeSingle();

	if (error || !event) {
		notFound();
	}

	const isAdmin = profile?.role === "admin";
	const canEdit = isAdmin || event.organizer_id === user.id;

	if (!canEdit) {
		return (
			<Card className="border ring-0">
				<CardHeader>
					<CardTitle>Ingen tilgang</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						Du har ikke tilgang til å redigere dette arrangementet.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<EditEventForm
			event={{
				id: event.id,
				title: event.title,
				date: event.date,
				location: event.location,
				category: event.category,
				description: event.description,
				image_url: event.image_url,
			}}
		/>
	);
}
