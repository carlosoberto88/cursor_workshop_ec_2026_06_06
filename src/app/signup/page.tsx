import Link from "next/link";
import { redirect } from "next/navigation";

import { SignUpForm } from "@/components/marketlab/auth-form";
import { getCurrentUser } from "@/lib/profile/queries";

export default async function SignupPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/markets");
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Create account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Start with $1,000 in fake money. Your profile is created
          automatically.
        </p>
      </div>

      <SignUpForm />

      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
