import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/logout/actions";

export async function Header() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<header className="border-b">
			<div className="mx-auto w-full max-w-6xl p-4 md:px-6">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<Link href="/" className="text-base font-semibold sm:text-lg">
						Arrangementer Innlandet
					</Link>

					<nav className="w-full sm:w-auto">
						<div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap text-sm">
							{user ? (
								<>
									<Link
										href="/favoritter"
										className="text-muted-foreground hover:text-foreground"
									>
										Favoritter
									</Link>
									<form action={logout} className="inline">
										<button
											type="submit"
											className="text-muted-foreground hover:text-foreground"
										>
											Logg ut
										</button>
									</form>
								</>
							) : (
								<>
									<Link
										href="/login"
										className="text-muted-foreground hover:text-foreground"
									>
										Logg inn
									</Link>
									<Link
										href="/signup"
										className="text-muted-foreground hover:text-foreground"
									>
										Opprett konto
									</Link>
								</>
							)}
						</div>
					</nav>
				</div>
			</div>
		</header>
	);
}
