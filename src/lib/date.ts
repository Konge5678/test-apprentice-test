import { format } from "date-fns";
import { nb } from "date-fns/locale";

export function formatEventDate(date: string) {
  return format(new Date(date), "d. MMM yyyy, HH:mm", { locale: nb });
}

export function formatEventDateDetailed(date: string) {
  return format(new Date(date), "EEEE d. MMMM yyyy 'kl.' HH:mm", { locale: nb });
}
