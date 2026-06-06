import Link from "next/link";

import { ThemeToggle } from "@/components/marketlab/theme-toggle";

export function Header() {
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
        <div className="flex items-center gap-3">
          <div
            className="hidden sm:block"
            data-slot="auth-placeholder"
            aria-hidden
          />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
