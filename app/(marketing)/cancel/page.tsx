import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="max-w-container-max mx-auto px-margin-desktop min-h-screen flex flex-col items-center justify-center text-center gap-8">
      <span className="material-symbols-outlined text-[64px] text-on-surface-variant">
        info
      </span>
      <h1 className="font-display text-display text-on-background">
        Checkout cancelled
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
        No charge was made. Whenever you&apos;re ready, you can start again or
        book a quick call to talk things through first.
      </p>
      <Link
        href="/"
        className="bg-primary text-on-primary px-10 py-4 rounded-full font-label-md text-label-md hover:scale-95 transition-transform"
      >
        Back to home
      </Link>
    </main>
  );
}
