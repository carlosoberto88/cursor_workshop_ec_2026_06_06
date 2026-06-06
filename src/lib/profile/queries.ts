import type { HeaderProfile } from "@/lib/profile/header-state";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  if (!isSupabaseConfigured) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentUserProfile(): Promise<{
  user: Awaited<ReturnType<typeof getCurrentUser>>;
  profile: HeaderProfile | null;
}> {
  const user = await getCurrentUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const supabase = await createServerSupabaseClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("balance_cents, first_name, last_name")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile };
}
