import Link from "next/link";

import { signOut } from "@/app/actions/auth";
import { ThemeToggle } from "@/components/marketlab/theme-toggle";
import { Button } from "@/components/ui/button";
import { getHeaderAuthState } from "@/lib/profile/header-state";
import { getCurrentUserProfile } from "@/lib/profile/queries";

function BalanceBadge({ label }: { label: string }) {
  return (
    <div className="rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-foreground">
      {label}
    </div>
  );
}

export async function Header() {
  const { user, profile } = await getCurrentUserProfile();
  const authState = getHeaderAuthState({ user, profile });

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-6">
          <Link
            href="/markets"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            MarketLab
          </Link>
          <nav>
            <Link
              href="/markets"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Markets
            </Link>
          </nav>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {authState.showBalance ? (
            <BalanceBadge
              label={authState.balanceLabel ?? "Balance unavailable"}
            />
          ) : null}

          {authState.showSignIn ? (
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          ) : null}

          {authState.showSignUp ? (
            <Button asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          ) : null}

          {authState.showSignOut ? (
            <form action={signOut}>
              <Button type="submit" variant="outline">
                Sign out
              </Button>
            </form>
          ) : null}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
