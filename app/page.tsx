import { heroImage } from '@/data/gallery';
import { resolveImage, getLogo } from '@/lib/images';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { DirectorWord } from '@/components/sections/DirectorWord';
import { Manifesto } from '@/components/sections/Manifesto';
import { Programs } from '@/components/sections/Programs';
import { ParallaxGallery } from '@/components/sections/ParallaxGallery';
import { CampusLife } from '@/components/sections/CampusLife';
import { NewsFeed } from '@/components/sections/NewsFeed';
import { Teachers } from '@/components/sections/Teachers';
import { FAQ } from '@/components/sections/FAQ';
import { AdmissionCTA } from '@/components/sections/AdmissionCTA';
import { Contacts } from '@/components/sections/Contacts';

export default function HomePage() {
  return (
    <>
      <Hero image={resolveImage(heroImage)} logo={getLogo()} />
      <About />
      <DirectorWord />
      <NewsFeed />
      <Programs />
      <Manifesto />
      <CampusLife />
      <ParallaxGallery />
      <Teachers />
      <FAQ />
      <AdmissionCTA />
      <Contacts />
    </>
  );
}
