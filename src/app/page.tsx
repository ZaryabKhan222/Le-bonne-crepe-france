import Header from "@/components/ui/Header";
import AnnouncementBar from "@/components/ui/AnnouncementBar";
import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import GrandOpening from "@/components/sections/GrandOpening";
import Story from "@/components/sections/Story";
import SignatureCreations from "@/components/sections/SignatureCreations";
import MenuSection from "@/components/sections/MenuSection";
import Gallery from "@/components/sections/Gallery";
import Memberships from "@/components/sections/Memberships";
import Catering from "@/components/sections/Catering";
import FindUs from "@/components/sections/FindUs";
import Press from "@/components/sections/Press";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import { isOpeningLive } from "@/data/site";

export default function Home() {
  // Evaluated at build time; the bar also re-checks in the browser.
  const openingLive = isOpeningLive();

  return (
    <>
      {openingLive && <AnnouncementBar />}
      <Header />
      <main>
        <Hero showOpening={openingLive} />
        <Intro />
        <GrandOpening />
        <Story />
        <SignatureCreations />
        <MenuSection />
        <Gallery />
        <Memberships />
        <Catering />
        <FindUs />
        <Press />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
