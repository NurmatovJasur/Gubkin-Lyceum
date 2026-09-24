import { about } from '@/data/content';
import { aboutImage, aboutGallery } from '@/data/gallery';
import { resolveImage, resolveImages } from '@/lib/images';
import { Container, Section } from '@/components/ui/Container';
import { Lines } from '@/components/ui/SectionHeading';
import { TextLink } from '@/components/ui/Button';
import { Reveal } from '@/components/animations/Reveal';
import { AboutShowcase } from '@/components/sections/AboutShowcase';

/**
 * Секция «О лицее» — асимметричная editorial-композиция:
 * вертикальный портрет со сдвигом вниз + галерея на восемь колонок.
 */
export function About() {
  const portrait = resolveImage(aboutImage);
  const gallery = resolveImages(aboutGallery);

  return (
    <Section id="about">
      <Container>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-[clamp(28px,5vw,110px)]">
          <Reveal>
            <h2 className="text-h2">
              <Lines lines={about.heading} />
            </h2>
          </Reveal>

          <Reveal delay={120} className="grid max-w-[56ch] gap-4 lg:pt-[clamp(4px,2.4vw,46px)]">
            {about.paragraphs.map((text) => (
              <p key={text} className="text-[clamp(15px,1.1vw,17.5px)] leading-[1.7] text-muted">
                {text}
              </p>
            ))}
            <p className="mt-3">
              <TextLink href="/about">Подробнее о лицее</TextLink>
            </p>
          </Reveal>
        </div>

        <AboutShowcase portrait={portrait} images={gallery} label="Фотографии лицея" />
      </Container>
    </Section>
  );
}
