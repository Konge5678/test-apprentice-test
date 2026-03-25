import { z } from "zod";

const timeHHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export const eventFormSchema = z.object({
	title: z.string().trim().min(1, "Tittel må fylles ut."),
	date: z.string().trim().min(1, "Dato må fylles ut."),
	time: z
		.string()
		.trim()
		.regex(timeHHMM, "Klokkeslett må være i formatet HH:MM."),
	location: z.string().trim().optional(),
	category: z.string().trim().optional(),
	description: z.string().trim().optional(),
	image_url: z
		.string()
		.trim()
		.optional()
		.refine((v) => !v || v.startsWith("http://") || v.startsWith("https://"), {
			message: "Bilde-URL må starte med http:// eller https://",
		}),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
