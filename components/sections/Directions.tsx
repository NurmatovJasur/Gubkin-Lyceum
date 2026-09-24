import { directions } from '@/data/directions';
import { directionsIntro } from '@/data/content';
import { resolveImage } from '@/lib/images';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { DirectionCard } from '@/components/ui/DirectionCard';
import { Reveal } from '@/components/animations/Reveal';

/**
 * Секция «Направления»: 2×2 на desktop, одна колонка на мобильном.
 * `withHeading = false` — на странице /directions заголовок свой.
 */
export function Directions({ withHeading = true }: { withHeading?: boolean }) {
  return (
    <Section id="directions">
      <Container>
        {withHeading ? (
          <SectionHeading
            heading={directionsIntro.heading}
            text={directionsIntro.text}
            split
          />
        ) : null}

        <Reveal
          stagger={0.09}
          childSelector=":scope > div"
          className="grid gap-3 lg:grid-cols-2 lg:gap-[clamp(12px,1.5vw,26px)]"
        >
          {directions.map((direction) => (
            <div key={direction.id}>
              <DirectionCard direction={direction} image={resolveImage(direction.image)} />
            </div>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
