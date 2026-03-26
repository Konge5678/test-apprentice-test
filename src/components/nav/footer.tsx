export function Footer() {
  return (
    <footer className="border-t mt-10">
      <div className="mx-auto w-full max-w-6xl p-4 text-center my-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Arrangementer Innlandet. Alle
          rettigheter reservert.
        </p>
      </div>
    </footer>
  );
}
