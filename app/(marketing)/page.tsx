import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Thermocline from "@/components/Thermocline";
import Expertise from "@/components/Expertise";
import Projects from "@/components/Projects";
import Offer from "@/components/Offer";
import ScorecardTeaser from "@/components/ScorecardTeaser";
import ReversePitch from "@/components/ReversePitch";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import DepthRail from "@/components/dive/DepthRail";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * One dive, top to bottom. Sections are stages of the profile: down to
 * turnaround depth at the pricing, then two ascent stops and back to the
 * surface, where the only action that matters is waiting.
 */
export default function Home() {
  return (
    <div className="water-column relative min-h-screen overflow-x-clip">
      {/* Particulate, rising past you the whole way down. Two layers at
          different rates so the column reads as having depth. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-70"
      >
        <div className="snow-field marine-snow" />
        <div className="snow-field snow-field-far marine-snow marine-snow-far" />
      </div>

      <div className="relative z-10">
        <Nav />
        <DepthRail />

        <main className="mx-auto max-w-container-max px-margin-mobile pb-16 md:px-margin-desktop xl:pl-[248px]">
          <Hero />
          <Thermocline />
          <Expertise />
          <Projects />
          <Offer />
          <ScorecardTeaser />
          <ReversePitch />
          <Contact />
        </main>

        <Footer />
      </div>
    </div>
  );
}
