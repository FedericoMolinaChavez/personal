import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Approach from "@/components/Approach";
import Expertise from "@/components/Expertise";
import Offer from "@/components/Offer";
import ReversePitch from "@/components/ReversePitch";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <>
      <span id="top" />
      <Nav />
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <Hero />
        <Projects />
        <Approach />
        <Expertise />
        <Offer />
        <ReversePitch />
        <Contact />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
