"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "event-images";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

export type EventFormState = {
	error: string | null;
};

function toOptionalString(value: FormDataEntryValue | null) {
	const s = String(value ?? "").trim();
	return s.length ? s : null;
}

function safeFileExt(filename: string | null) {
	const name = String(filename ?? "");
	const parts = name.split(".");
	if (parts.length < 2) return "jpg";
	const ext = parts.at(-1)?.toLowerCase() ?? "jpg";
	if (ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "webp")
		return ext;
	return "jpg";
}

async function uploadEventImage(params: {
	supabase: Awaited<ReturnType<typeof createClient>>;
	eventId: string;
	file: File;
}) {
	const { supabase, eventId, file } = params;

	if (!file.type.startsWith("image/")) {
		return { error: "Filen må være et bilde." as const, url: null };
	}
	if (file.size > MAX_IMAGE_BYTES) {
		return { error: "Bildet er for stort (maks 5MB)." as const, url: null };
	}

	const ext = safeFileExt(file.name);
	const objectPath = `events/${eventId}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
	const bytes = new Uint8Array(await file.arrayBuffer());

	const { error: uploadError } = await supabase.storage
		.from(BUCKET)
		.upload(objectPath, bytes, {
			contentType: file.type,
			upsert: false,
		});

	if (uploadError) {
		return {
			error: "Kunne ikke laste opp bilde. Prøv igjen.",
			url: null as string | null,
		};
	}

	const { data } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
	return { error: null as string | null, url: data.publicUrl };
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

	const initialImageUrl = toOptionalString(formData.get("image_url"));
	const { data: inserted, error } = await supabase
		.from("events")
		.insert({
			title,
			date: date.toISOString(),
			location: toOptionalString(formData.get("location")),
			category: toOptionalString(formData.get("category")),
			description: toOptionalString(formData.get("description")),
			image_url: initialImageUrl,
			organizer_id: user.id,
		})
		.select("id")
		.single();

	if (error || !inserted?.id) {
		return { error: "Kunne ikke opprette arrangement. Prøv igjen." };
	}

	const file = formData.get("image");
	if (file instanceof File && file.size > 0) {
		const uploaded = await uploadEventImage({
			supabase,
			eventId: inserted.id,
			file,
		});
		if (uploaded.error) return { error: uploaded.error };

		const { error: updateError } = await supabase
			.from("events")
			.update({ image_url: uploaded.url })
			.eq("id", inserted.id);

		if (updateError) {
			return {
				error: "Bildet ble lastet opp, men kunne ikke lagres på arrangementet.",
			};
		}
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

	let imageUrl = toOptionalString(formData.get("image_url"));
	const file = formData.get("image");
	if (file instanceof File && file.size > 0) {
		const uploaded = await uploadEventImage({ supabase, eventId, file });
		if (uploaded.error) return { error: uploaded.error };
		imageUrl = uploaded.url;
	}

	const { error } = await supabase
		.from("events")
		.update({
			title,
			date: date.toISOString(),
			location: toOptionalString(formData.get("location")),
			category: toOptionalString(formData.get("category")),
			description: toOptionalString(formData.get("description")),
			image_url: imageUrl,
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
