import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type EventsFiltersProps = {
  searchQuery: string;
  category: string;
  categories: string[];
};

export function EventsFilters({
  searchQuery,
  category,
  categories,
}: EventsFiltersProps) {
  return (
    <form
      key={`${searchQuery}-${category}`}
      className="grid gap-3 rounded-lg mb-4 md:grid-cols-[1fr_220px_auto_auto] md:items-end">
      <div className="space-y-1">
        <Input
          id="q"
          name="q"
          className="focus-visible:ring-0"
          defaultValue={searchQuery}
          placeholder="Søk etter arrangement..."
        />
      </div>

      <div className="space-y-1">
        <select
          id="kategori"
          name="kategori"
          defaultValue={category}
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
          <option value="">Alle kategorier</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <Button type="submit">Filtrer</Button>
        <Button asChild type="button" variant="outline">
          <Link href="/">Nullstill</Link>
        </Button>
      </div>
    </form>
  );
}
