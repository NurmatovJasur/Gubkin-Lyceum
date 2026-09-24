import type { Metadata } from 'next';
import { site } from '@/site.config';
import { about, why } from '@/data/content';
import { aboutImage, aboutGallery } from '@/data/gallery';
import { resolveImage, resolveImages } from '@/lib/images';
import { InnerHero } from '@/components/sections/PageHero';
import { Container, Section } from '@/components/ui/Container';
import { Media } from '@/components/ui/Media';
import { Reveal } from '@/components/animations/Reveal';
import { ImageReveal } from '@/components/animations/ImageReveal';
import { Gallery } from '@/components/sections/Gallery';
import { Statistics } from '@/components/sections/Statistics';
import { Advantages } from '@/components/sections/Advantages';
import { WhyGubkin } from '@/components/sections/WhyGubkin';
import { AdmissionCTA } from '@/components/sections/AdmissionCTA';

export const metadata: Metadata = {
  title: 'О лицее',
  description:
    'Академический лицей при филиале РГУ нефти и газа имени И.М. Губкина в Ташкенте: академическая среда, небольшие группы, четыре направления обучения и подготовка к поступлению.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: `О лицее | ${site.name}`,
    description:
      'Академическая среда, небольшие группы и четыре направления обучения — о лицее имени И.М. Губкина в Ташкенте.',
    url: '/about'
  }
};

export default function AboutPage() {
  const portrait = resolveImage(aboutImage);
  const gallery = resolveImages(aboutGallery);

  return (
    <>
      <InnerHero
        title={about.heading}
        text={why.paragraphs[0]}
      />

      <Section>
        <Container>
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-[clamp(32px,5vw,110px)]">
            <Reveal className="grid max-w-[60ch] gap-5">
              {about.paragraphs.map((text, index) => (
                <p
                  key={text}
                  className={
                    index === 0
                      ? 'text-[clamp(19px,1.85vw,28px)] leading-[1.4] tracking-[-0.015em]'
                      : 'text-[clamp(15px,1.1vw,17.5px)] leading-[1.7] text-muted'
                  }
                >
                  {text}
                </p>
              ))}
            </Reveal>

            <ImageReveal className="aspect-4/3 lg:aspect-4/5">
              <Media image={portrait} sizes="(max-width: 900px) 100vw, 45vw" />
            </ImageReveal>
          </div>

          <Reveal className="mt-[clamp(48px,7vw,110px)]">
            <Gallery images={gallery} label="Фотографии лицея" sizes="(max-width: 900px) 100vw, 90vw" />
          </Reveal>
        </Container>
      </Section>

      <Statistics />
      <WhyGubkin />
      <Advantages />
      <AdmissionCTA />
    </>
  );
}
