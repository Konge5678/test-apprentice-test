"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EventEditorForm } from "@/components/events/event-editor-form";
import type { EventFormValues } from "@/lib/event-form";

type EditableEvent = {
	id: string;
	title: string;
	date: string;
	location: string | null;
	category: string | null;
	description: string | null;
	image_url: string | null;
};

function toDateInput(isoOrDate: string) {
	const d = new Date(isoOrDate);
	if (Number.isNaN(d.getTime())) return "";

	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function toTimeInput(isoOrDate: string) {
	const d = new Date(isoOrDate);
	if (Number.isNaN(d.getTime())) return "";

	const pad = (n: number) => String(n).padStart(2, "0");
	return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EditEventForm({ event }: { event: EditableEvent }) {
	const initialTime = toTimeInput(event.date) || "12:00";

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="text-sm font-medium text-muted-foreground">Arrangør</p>
					<h1 className="text-2xl font-semibold">Rediger arrangement</h1>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button asChild variant="outline">
						<Link href="/arrangor/arrangementer">Mine arrangementer</Link>
					</Button>
					<Button asChild variant="ghost">
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
						time: initialTime,
						location: event.location ?? "",
						category: event.category ?? "",
						description: event.description ?? "",
						image_url: event.image_url ?? "",
					} satisfies EventFormValues
				}
				cancelHref="/arrangor/arrangementer"
				submitLabel="Lagre endringer"
			/>
		</div>
	);
}
