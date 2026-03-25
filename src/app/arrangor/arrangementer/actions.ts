"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type EventFormState = {
	error: string | null;
};

function toOptionalString(value: FormDataEntryValue | null) {
	const s = String(value ?? "").trim();
	return s.length ? s : null;
}

export async function createEventAction(
	_prevState: EventFormState,
	formData: FormData,
): Promise<EventFormState> {
	const title = toOptionalString(formData.get("title"));
	const datePart = toOptionalString(formData.get("date"));
	const timePart = toOptionalString(formData.get("time"));

	if (!title || !datePart || !timePart) {
		return { error: "Tittel, dato og klokkeslett må fylles ut." };
	}

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { error: "Du må være logget inn for å opprette arrangementer." };
	}

	const date = new Date(`${datePart}T${timePart}`);
	if (Number.isNaN(date.getTime())) {
		return { error: "Ugyldig dato/klokkeslett. Prøv igjen." };
	}

	const { error } = await supabase.from("events").insert({
		title,
		date: date.toISOString(),
		location: toOptionalString(formData.get("location")),
		category: toOptionalString(formData.get("category")),
		description: toOptionalString(formData.get("description")),
		image_url: toOptionalString(formData.get("image_url")),
		organizer_id: user.id,
	});

	if (error) {
		return { error: "Kunne ikke opprette arrangement. Prøv igjen." };
	}

	redirect("/arrangor/arrangementer");
}

export async function updateEventAction(
	_prevState: EventFormState,
	formData: FormData,
): Promise<EventFormState> {
	const eventId = toOptionalString(formData.get("event_id"));
	const title = toOptionalString(formData.get("title"));
	const datePart = toOptionalString(formData.get("date"));
	const timePart = toOptionalString(formData.get("time"));

	if (!eventId) {
		return { error: "Mangler arrangement-ID." };
	}

	if (!title || !datePart || !timePart) {
		return { error: "Tittel, dato og klokkeslett må fylles ut." };
	}

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { error: "Du må være logget inn for å redigere arrangementer." };
	}

	const date = new Date(`${datePart}T${timePart}`);
	if (Number.isNaN(date.getTime())) {
		return { error: "Ugyldig dato/klokkeslett. Prøv igjen." };
	}

	const { error } = await supabase
		.from("events")
		.update({
			title,
			date: date.toISOString(),
			location: toOptionalString(formData.get("location")),
			category: toOptionalString(formData.get("category")),
			description: toOptionalString(formData.get("description")),
			image_url: toOptionalString(formData.get("image_url")),
		})
		.eq("id", eventId);

	if (error) {
		return { error: "Kunne ikke lagre endringer. Prøv igjen." };
	}

	redirect("/arrangor/arrangementer");
}

export async function deleteEventAction(
	eventId: string,
): Promise<EventFormState> {
	const id = String(eventId ?? "").trim();
	if (!id) {
		return { error: "Mangler arrangement-ID." };
	}

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { error: "Du må være logget inn for å slette arrangementer." };
	}

	const { error } = await supabase.from("events").delete().eq("id", id);
	if (error) {
		return { error: "Kunne ikke slette arrangementet. Prøv igjen." };
	}

	redirect("/arrangor/arrangementer");
}
