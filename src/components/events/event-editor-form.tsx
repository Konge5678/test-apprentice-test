"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { eventFormSchema, type EventFormValues } from "@/lib/event-form";
import {
	createEventAction,
	deleteEventAction,
	updateEventAction,
} from "@/app/arrangor/arrangementer/actions";
import { TimeSelect } from "./time-select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
	mode: "create" | "edit";
	defaultValues: EventFormValues;
	eventId?: string;
	cancelHref: string;
	submitLabel: string;
};

export function EventEditorForm({
	mode,
	defaultValues,
	eventId,
	cancelHref,
	submitLabel,
}: Props) {
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);
	const [timeValue, setTimeValue] = useState(defaultValues.time || "12:00");
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [deleteText, setDeleteText] = useState("");
	const canDelete = useMemo(
		() => deleteText.trim().toLowerCase() === "slett",
		[deleteText],
	);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<EventFormValues>({
		resolver: zodResolver(eventFormSchema),
		defaultValues,
	});

	useEffect(() => {
		setValue("time", timeValue, { shouldValidate: true });
	}, [setValue, timeValue]);

	async function onValid(values: EventFormValues) {
		setSubmitError(null);
		setPending(true);
		try {
			const formData = new FormData();
			if (mode === "edit") {
				if (!eventId) {
					setSubmitError("Mangler arrangement-ID.");
					return;
				}
				formData.set("event_id", eventId);
			}

			formData.set("title", values.title);
			formData.set("date", values.date);
			formData.set("time", values.time);
			if (values.location) formData.set("location", values.location);
			if (values.category) formData.set("category", values.category);
			if (values.description) formData.set("description", values.description);
			if (values.image_url) formData.set("image_url", values.image_url);

			const result =
				mode === "create"
					? await createEventAction({ error: null }, formData)
					: await updateEventAction({ error: null }, formData);

			if (result?.error) setSubmitError(result.error);
		} finally {
			setPending(false);
		}
	}

	async function onDelete() {
		if (!eventId) {
			setSubmitError("Mangler arrangement-ID.");
			return;
		}
		setSubmitError(null);
		setPending(true);
		try {
			const result = await deleteEventAction(eventId);
			if (result?.error) setSubmitError(result.error);
		} finally {
			setPending(false);
			setDeleteOpen(false);
			setDeleteText("");
		}
	}

	return (
		<div className="space-y-4">
			{submitError ? (
				<Alert variant="destructive">
					<AlertTitle>Noe gikk galt</AlertTitle>
					<AlertDescription>{submitError}</AlertDescription>
				</Alert>
			) : null}

			<Card className="border ring-0">
				<CardHeader>
					<CardTitle>Detaljer</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onValid)} className="space-y-5">
						<div className="space-y-2">
							<Label htmlFor="title">Tittel</Label>
							<Input id="title" required {...register("title")} />
							{errors.title?.message ? (
								<p className="text-xs text-destructive">
									{errors.title.message}
								</p>
							) : null}
						</div>

						<div className="space-y-2">
							<Label>Dato og tid</Label>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="space-y-2">
									<Label
										htmlFor="date"
										className="text-xs text-muted-foreground"
									>
										Dato
									</Label>
									<Input
										id="date"
										type="date"
										required
										lang="nb"
										{...register("date")}
									/>
									{errors.date?.message ? (
										<p className="text-xs text-destructive">
											{errors.date.message}
										</p>
									) : null}
								</div>

								<div className="space-y-2">
									<Label className="text-xs text-muted-foreground">
										Klokkeslett
									</Label>
									<input
										type="hidden"
										value={timeValue}
										{...register("time")}
									/>
									<TimeSelect value={timeValue} onChange={setTimeValue} />
									{errors.time?.message ? (
										<p className="text-xs text-destructive">
											{errors.time.message}
										</p>
									) : null}
								</div>
							</div>
							<p className="text-xs text-muted-foreground">
								Velg tidspunktet arrangementet starter.
							</p>
						</div>

						<div className="grid gap-5 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="location">Sted</Label>
								<Input id="location" {...register("location")} />
							</div>
							<div className="space-y-2">
								<Label htmlFor="category">Kategori</Label>
								<Input
									id="category"
									placeholder="Konsert, kurs, festival ..."
									{...register("category")}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Beskrivelse</Label>
							<Textarea
								id="description"
								rows={6}
								{...register("description")}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="image_url">Bilde-URL (valgfritt)</Label>
							<Input
								id="image_url"
								placeholder="https://..."
								inputMode="url"
								{...register("image_url")}
							/>
							{errors.image_url?.message ? (
								<p className="text-xs text-destructive">
									{errors.image_url.message}
								</p>
							) : null}
						</div>

						<div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
							{mode === "edit" ? (
								<Dialog
									open={deleteOpen}
									onOpenChange={(open) => {
										setDeleteOpen(open);
										if (!open) setDeleteText("");
									}}
								>
									<DialogTrigger asChild>
										<Button
											type="button"
											variant="destructive"
											disabled={pending}
										>
											Slett
										</Button>
									</DialogTrigger>
									<DialogContent className="ring-0 border">
										<DialogHeader>
											<DialogTitle>Slett arrangement</DialogTitle>
											<DialogDescription>
												Denne handlingen kan ikke angres. Skriv{" "}
												<strong>SLETT</strong> for å bekrefte.
											</DialogDescription>
										</DialogHeader>

										<div className="space-y-2">
											<Label htmlFor="delete_confirm">Bekreft</Label>
											<Input
												id="delete_confirm"
												value={deleteText}
												onChange={(e) => setDeleteText(e.target.value)}
												placeholder="SLETT"
												autoComplete="off"
											/>
										</div>

										<DialogFooter>
											<Button
												type="button"
												variant="outline"
												onClick={() => setDeleteOpen(false)}
											>
												Avbryt
											</Button>
											<Button
												type="button"
												variant="destructive"
												disabled={!canDelete || pending}
												onClick={onDelete}
											>
												{pending ? "Sletter..." : "Slett arrangement"}
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							) : null}
							<Button asChild variant="outline">
								<Link href={cancelHref}>Avbryt</Link>
							</Button>
							<Button type="submit" disabled={pending}>
								{pending ? "Lagrer..." : submitLabel}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
