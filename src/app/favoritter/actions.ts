"use server";

import { createClient } from "@/lib/supabase/server";

type ToggleFavoriteResult = {
  ok: boolean;
  requiresAuth?: boolean;
};

export async function toggleFavoriteAction(
  eventId: string,
  isFavorited: boolean,
): Promise<ToggleFavoriteResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, requiresAuth: true };
  }

  if (isFavorited) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("event_id", eventId);

    if (error) return { ok: false };
    return { ok: true };
  }

  const { error } = await supabase.from("favorites").insert({
    user_id: user.id,
    event_id: eventId,
  });

  if (error) return { ok: false };
  return { ok: true };
}
