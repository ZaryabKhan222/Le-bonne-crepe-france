import Header from "@/components/ui/Header";
import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import Story from "@/components/sections/Story";
import MenuSection from "@/components/sections/MenuSection";
import Gallery from "@/components/sections/Gallery";
import Catering from "@/components/sections/Catering";
import FindUs from "@/components/sections/FindUs";
import Press from "@/components/sections/Press";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Intro />
        <Story />
        <MenuSection />
        <Gallery />
        <Catering />
        <FindUs />
        <Press />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
