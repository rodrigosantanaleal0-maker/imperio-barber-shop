import { Navigation } from "@/presentation/components/ui/Navigation";
import { Hero } from "@/presentation/components/sections/Hero";
import { Manifesto } from "@/presentation/components/sections/Manifesto";
import { Services } from "@/presentation/components/sections/Services";
import { Barbers } from "@/presentation/components/sections/Barbers";
import { Experience } from "@/presentation/components/sections/Experience";
import { Transformation } from "@/presentation/components/sections/Transformation";
import { Testimonials } from "@/presentation/components/sections/Testimonials";
import { Instagram } from "@/presentation/components/sections/Instagram";
import { Location } from "@/presentation/components/sections/Location";
import { FinalCta } from "@/presentation/components/sections/FinalCta";
import { Footer } from "@/presentation/components/sections/Footer";

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="flex-1">
        <Hero />
        <Manifesto />
        <Services />
        <Barbers />
        <Experience />
        <Transformation />
        <Testimonials />
        <Instagram />
        <Location />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
