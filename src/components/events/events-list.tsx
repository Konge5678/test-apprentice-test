import { EventCard, type EventListItem } from "@/components/events/event-card";

export function EventsList({ events }: { events: EventListItem[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        Ingen arrangementer funnet.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
