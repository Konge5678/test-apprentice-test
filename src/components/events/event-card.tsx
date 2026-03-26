import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FavoriteButton } from "@/components/events/favorite-button";
import { formatEventDate } from "@/lib/date";

export type EventListItem = {
  id: string;
  title: string;
  date: string;
  location: string | null;
  category: string | null;
  image_url: string | null;
  description?: string | null;
  isFavorited: boolean;
};

export function EventCard({
  event,
  isLoggedIn,
}: {
  event: EventListItem;
  isLoggedIn: boolean;
}) {
  return (
    <Card className="h-full ring-0 border">
      {event.image_url ? (
        <img
          src={event.image_url}
          alt={`Bilde for ${event.title}`}
          className="h-44 w-full object-cover"
        />
      ) : null}

      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-6">{event.title}</CardTitle>
          <div className="flex items-center gap-1">
            {event.category ? (
              <Badge variant="outline">{event.category}</Badge>
            ) : null}
            <FavoriteButton
              eventId={event.id}
              isFavorited={event.isFavorited}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
        <CardDescription>{formatEventDate(event.date)}</CardDescription>
      </CardHeader>

      <CardContent className="flex h-full flex-col justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {event.location || "Sted ikke oppgitt"}
          </p>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {event.description || "Ingen beskrivelse tilgjengelig."}
          </p>
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link href={`/arrangementer/${event.id}`}>Les mer</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
