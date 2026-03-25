"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EventEditorForm } from "@/components/events/event-editor-form";
import type { EventFormValues } from "@/lib/event-form";

export default function NyttArrangementPage() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="text-sm font-medium text-muted-foreground">Arrangør</p>
					<h1 className="text-2xl font-semibold">Nytt arrangement</h1>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button asChild variant="outline">
						<Link href="/arrangor/arrangementer">Mine arrangementer</Link>
					</Button>
				</div>
			</div>

			<EventEditorForm
				mode="create"
				defaultValues={
					{
						title: "",
						date: "",
						time: "12:00",
						location: "",
						category: "",
						description: "",
						image_url: "",
					} satisfies EventFormValues
				}
				cancelHref="/arrangor/arrangementer"
				submitLabel="Opprett arrangement"
			/>
		</div>
	);
}
