import Link from "next/link";
import { redirect } from "next/navigation";

import { SignInForm } from "@/components/marketlab/auth-form";
import { getCurrentUser } from "@/lib/profile/queries";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/markets");
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Use your workshop account to trade fake money on MarketLab.
        </p>
      </div>

      <SignInForm />

      <p className="text-sm text-muted-foreground">
        Need an account?{" "}
        <Link href="/signup" className="font-medium text-foreground underline">
          Sign up
        </Link>
      </p>
    </main>
  );
}
