import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";

import { Header } from "@/components/marketlab/header";
import { ThemeProvider } from "@/components/marketlab/theme-provider";
import type { ThemePreference } from "@/lib/theme";
import { cn } from "@/lib/utils";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MarketLab",
  description: "Fake-money prediction markets for a Cursor workshop.",
  icons: {
    icon: "/logo/iso-marketlab.webp",
  },
};

function readServerTheme(value: string | undefined): ThemePreference | null {
  if (value === "light" || value === "dark") {
    return value;
  }

  return null;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const serverTheme = readServerTheme(cookieStore.get("theme")?.value);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        geistSans.variable,
        geistMono.variable,
        "h-full antialiased",
        serverTheme === "dark" && "dark",
      )}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider serverTheme={serverTheme}>
          <Header />
          <div className="flex-1">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
