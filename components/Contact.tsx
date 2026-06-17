import BookingEmbed from "./BookingEmbed";
import HireMeButton from "./HireMeButton";

export default function Contact() {
  return (
    <section id="contact" className="pb-32 scroll-mt-24 reveal">
      <div className="bg-primary text-on-primary p-12 md:p-20 rounded-3xl flex flex-col items-center text-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
          <span
            className="material-symbols-outlined text-[200px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            handshake
          </span>
        </div>
        <h2 className="font-display text-display max-w-2xl relative z-10">
          Ready to build the future of your industry?
        </h2>
        <p className="font-body-lg text-body-lg text-on-primary/80 max-w-xl relative z-10">
          Let&apos;s set up a 15-minute call to understand your vision and see how
          I can add real value to your project.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <a
            href="#booking"
            className="bg-surface text-primary px-10 py-4 rounded-full font-label-md text-label-md hover:scale-95 transition-transform"
          >
            Schedule a Call
          </a>
          <HireMeButton
            label="Hire Me"
            className="bg-primary-container border border-on-primary/30 text-on-primary px-10 py-4 rounded-full font-label-md text-label-md hover:bg-on-primary/10 transition-colors cursor-pointer disabled:opacity-70"
          />
        </div>
      </div>

      {/* Booking widget */}
      <div id="booking" className="mt-24 scroll-mt-24 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">
            Booking
          </span>
          <h3 className="font-display text-headline-lg md:text-[48px] text-on-background">
            Pick a time that works for you.
          </h3>
        </div>
        <BookingEmbed />
      </div>
    </section>
  );
}
