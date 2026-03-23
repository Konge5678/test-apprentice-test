"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const allowedRoles = ["user", "organizer", "admin"] as const;

export async function updateUserRole(formData: FormData) {
  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "");

  if (!userId) redirect("/admin/brukere");

  if (!allowedRoles.includes(role as (typeof allowedRoles)[number])) {
    redirect("/admin/brukere");
  }

  const supabase = await createClient();

  await supabase.from("profiles").update({ role }).eq("id", userId);

  redirect("/admin/brukere");
}