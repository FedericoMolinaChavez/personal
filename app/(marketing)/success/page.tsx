import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="max-w-container-max mx-auto px-margin-desktop min-h-screen flex flex-col items-center justify-center text-center gap-8">
      <span className="material-symbols-outlined text-[64px] text-primary">
        check_circle
      </span>
      <h1 className="font-display text-display text-on-background">
        Payment received — thank you!
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
        Your booking is confirmed. I&apos;ll reach out shortly with next steps.
        If you haven&apos;t already, feel free to book a time on my calendar.
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
