import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { EventEditorForm } from "@/components/events/event-editor-form";
import type { EventFormValues } from "@/lib/event-form";

function toDateInput(isoOrDate: string) {
	const d = new Date(isoOrDate);
	if (Number.isNaN(d.getTime())) return "";
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function toTimeInput(isoOrDate: string) {
	const d = new Date(isoOrDate);
	if (Number.isNaN(d.getTime())) return "12:00";
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default async function AdminRedigerArrangementPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const supabase = await createClient();

	const { data: event, error } = await supabase
		.from("events")
		.select("id, title, date, location, category, description, image_url")
		.eq("id", id)
		.maybeSingle();

	if (error || !event) {
		notFound();
	}

	return (
		<main className="space-y-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b pb-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">
						Rediger arrangement
					</h1>
					<p className="text-sm text-muted-foreground">
						Du redigerer som admin (full tilgang)
					</p>
				</div>

				<div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
					<Button asChild variant="outline" className="w-full sm:w-auto">
						<Link href="/admin/arrangementer">Tilbake</Link>
					</Button>
					<Button asChild variant="outline" className="w-full sm:w-auto">
						<Link href={`/arrangementer/${event.id}`}>Vis</Link>
					</Button>
				</div>
			</div>

			<EventEditorForm
				mode="edit"
				eventId={event.id}
				defaultValues={
					{
						title: event.title,
						date: toDateInput(event.date),
						time: toTimeInput(event.date),
						location: event.location ?? "",
						category: event.category ?? "",
						description: event.description ?? "",
						image_url: event.image_url ?? "",
					} satisfies EventFormValues
				}
				cancelHref="/admin/arrangementer"
				submitLabel="Lagre endringer"
			/>
		</main>
	);
}
