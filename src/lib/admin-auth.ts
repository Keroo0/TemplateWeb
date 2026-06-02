import { redirect } from "next/navigation";

import { getAdminEmails } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AdminUser = {
  id: string;
  email?: string;
};

export function isAdminEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  return getAdminEmails().includes(email.trim().toLowerCase());
}

export async function requireAdminUser(): Promise<AdminUser> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user || !isAdminEmail(user.email)) {
    redirect("/login?next=/admin");
  }

  return {
    id: user.id,
    email: user.email
  };
}
