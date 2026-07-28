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
        Your strategy session is booked. I&apos;ll email you within one business
        day to schedule the 90 minutes and ask what you want to put them
        against. The written summary follows within 48 hours of the session.
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
