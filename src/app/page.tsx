import Image from "next/image";

export default function Home() {
  return (
    <main className="relative isolate flex-1 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--background)_0%,color-mix(in_oklch,var(--background)_88%,var(--foreground)_12%)_54%,color-mix(in_oklch,var(--background)_92%,var(--primary)_8%)_100%)]" />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 mix-blend-screen pointer-events-none dark:opacity-15"
        style={{ backgroundImage: "url('/hero2-bg.webp')" }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00d395]/60 to-transparent" />

      <section className="relative mx-auto flex min-h-[calc(100svh-6.5rem)] max-w-6xl items-center justify-center px-4 py-14 text-center">
        <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="relative mx-auto mb-8 w-44 sm:w-56">
            <div
              className="absolute inset-0 -z-10 rounded-[1.75rem] bg-foreground/10 blur-3xl scale-125 animate-pulse"
              style={{ animationDuration: "4s" }}
            />

            <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-lg">
              <Image
                alt="Cursor Quito event mark"
                className="h-auto w-full"
                height={1080}
                priority
                src="/quito.png"
                width={1080}
              />
            </div>
          </div>

          <h1 className="mx-auto mt-4 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl animate-shimmer-text">
            MarketLab is ready.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            Welcome to the Cursor workshop in Quito. Your local setup is
            running, and we will build the prediction market from here.
          </p>
        </div>
      </section>
    </main>
  );
}
