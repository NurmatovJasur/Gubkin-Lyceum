import { heroImage } from '@/data/gallery';
import { resolveImage, getLogo } from '@/lib/images';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { DirectorWord } from '@/components/sections/DirectorWord';
import { Programs } from '@/components/sections/Programs';
import { ParallaxGallery } from '@/components/sections/ParallaxGallery';
import { CampusLife } from '@/components/sections/CampusLife';
import { NewsFeed } from '@/components/sections/NewsFeed';
import { Teachers } from '@/components/sections/Teachers';
import { Partners } from '@/components/sections/Partners';
import { FAQ } from '@/components/sections/FAQ';
import { Socials } from '@/components/sections/Socials';

export default function HomePage() {
  return (
    <>
      <Hero image={resolveImage(heroImage)} logo={getLogo()} />
      <DirectorWord />
      <NewsFeed />
      <Programs />
      <About />
      <CampusLife />
      <ParallaxGallery />
      <Teachers />
      <Partners />
      <FAQ />
      <Socials />
    </>
  );
}
