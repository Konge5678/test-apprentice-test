import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function AdminHome() {
	return (
		<main>
			<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">Adminpanel</h1>
					<p className="text-sm text-muted-foreground">
						Administrer roller og tilgang i systemet
					</p>
				</div>

				<Button asChild variant="outline" className="w-full sm:w-auto">
					<Link href="/">Til forsiden</Link>
				</Button>
			</div>

			<Card className="border ring-0">
				<CardHeader className="pb-3">
					<CardTitle className="text-base">Brukere og roller</CardTitle>
					<CardDescription>Se alle brukere og oppdater roller</CardDescription>
				</CardHeader>
				<CardContent>
					<Button asChild>
						<Link href="/admin/brukere">Åpne brukeroversikt</Link>
					</Button>
				</CardContent>
			</Card>

			<Card className="mt-4 border ring-0">
				<CardHeader className="pb-3">
					<CardTitle className="text-base">Arrangementer</CardTitle>
					<CardDescription>
						Se alle arrangementer og rediger/slett
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button asChild>
						<Link href="/admin/arrangementer">Åpne arrangementoversikt</Link>
					</Button>
				</CardContent>
			</Card>
		</main>
	);
}
