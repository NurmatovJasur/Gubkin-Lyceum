import { about } from '@/data/content';
import { aboutImage, aboutGallery } from '@/data/gallery';
import { resolveImage, resolveImages } from '@/lib/images';
import { Container, Section } from '@/components/ui/Container';
import { Eyebrow, Lines } from '@/components/ui/SectionHeading';
import { TextLink } from '@/components/ui/Button';
import { Media } from '@/components/ui/Media';
import { Reveal } from '@/components/animations/Reveal';
import { ImageReveal } from '@/components/animations/ImageReveal';
import { Gallery } from '@/components/sections/Gallery';

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
            <Eyebrow
              number={about.eyebrow.number}
              label={about.eyebrow.label}
              className="mb-[clamp(24px,3vw,40px)]"
            />
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

        <div className="mt-[clamp(48px,7vw,120px)] grid items-start gap-3.5 lg:grid-cols-12 lg:gap-[clamp(14px,1.8vw,30px)]">
          <ImageReveal className="aspect-4/3 lg:col-span-4 lg:mt-[clamp(40px,9vw,150px)] lg:aspect-4/5">
            <Media image={portrait} sizes="(max-width: 900px) 100vw, 32vw" />
          </ImageReveal>

          <Gallery
            images={gallery}
            label="Фотографии лицея"
            className="lg:col-span-8"
            sizes="(max-width: 900px) 100vw, 58vw"
          />
        </div>
      </Container>
    </Section>
  );
}
