"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const signInSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

const signUpSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required."),
  last_name: z.string().trim().min(1, "Last name is required."),
  email: z.email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export type AuthActionState = {
  error?: string;
  status?: "check_email";
};

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseConfigured) {
    return { error: "Supabase is not configured." };
  }

  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/markets");
}

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseConfigured) {
    return { error: "Supabase is not configured." };
  }

  const parsed = signUpSchema.safeParse({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const { first_name, last_name, email, password } = parsed.data;
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name,
        last_name,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/markets");
  }

  return { status: "check_email" };
}

export async function signOut() {
  if (!isSupabaseConfigured) {
    redirect("/");
  }

  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
