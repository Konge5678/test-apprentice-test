"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavoriteAction } from "@/app/favoritter/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type FavoriteButtonProps = {
  eventId: string;
  isFavorited: boolean;
  isLoggedIn: boolean;
};

export function FavoriteButton({
  eventId,
  isFavorited,
  isLoggedIn,
}: FavoriteButtonProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [optimisticFavorited, setOptimisticFavorited] = useState(isFavorited);

  useEffect(() => {
    setOptimisticFavorited(isFavorited);
  }, [isFavorited]);

  function onClickFavorite() {
    if (!isLoggedIn) {
      setOpen(true);
      return;
    }

    const previous = optimisticFavorited;
    setOptimisticFavorited(!previous);

    startTransition(async () => {
      const result = await toggleFavoriteAction(eventId, previous);
      if (result.requiresAuth) {
        setOptimisticFavorited(previous);
        setOpen(true);
        return;
      }
      if (!result.ok) {
        setOptimisticFavorited(previous);
        return;
      }
      router.refresh();
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={
          optimisticFavorited ? "Fjern fra favoritter" : "Legg til i favoritter"
        }
        onClick={onClickFavorite}
        className={pending ? "pointer-events-none opacity-100" : "opacity-100"}>
        <Heart
          className={
            optimisticFavorited
              ? "fill-current text-red-600"
              : "text-muted-foreground"
          }
        />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Du må være logget inn</DialogTitle>
            <DialogDescription>
              Logg inn for å kunne lagre favoritter.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button asChild>
              <Link href={`/login?next=${encodeURIComponent(pathname)}`}>
                Logg inn
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
