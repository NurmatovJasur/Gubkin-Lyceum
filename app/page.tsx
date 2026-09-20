import { heroImage } from '@/data/gallery';
import { resolveImage } from '@/lib/images';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Statistics } from '@/components/sections/Statistics';
import { WhyGubkin } from '@/components/sections/WhyGubkin';
import { Advantages } from '@/components/sections/Advantages';
import { Manifesto } from '@/components/sections/Manifesto';
import { Directions } from '@/components/sections/Directions';
import { ParallaxGallery } from '@/components/sections/ParallaxGallery';
import { Teachers } from '@/components/sections/Teachers';
import { News } from '@/components/sections/News';
import { FAQ } from '@/components/sections/FAQ';
import { AdmissionCTA } from '@/components/sections/AdmissionCTA';
import { Contacts } from '@/components/sections/Contacts';

export default function HomePage() {
  return (
    <>
      <Hero image={resolveImage(heroImage)} />
      <About />
      <Statistics />
      <WhyGubkin />
      <Advantages />
      <Manifesto />
      <Directions />
      <ParallaxGallery />
      <Teachers />
      <News />
      <FAQ />
      <AdmissionCTA />
      <Contacts />
    </>
  );
}
