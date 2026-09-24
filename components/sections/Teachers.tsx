import { teachers } from '@/data/teachers';
import { teachersIntro } from '@/data/content';
import { resolveImage } from '@/lib/images';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TeachersMarquee } from '@/components/sections/TeachersMarquee';

/**
 * Секция «Преподаватели» — бегущая лента портретов (см. TeachersMarquee):
 * едет сама, останавливается и раскрывает карточку преподавателя по клику.
 */
export function Teachers({ withHeading = true }: { withHeading?: boolean }) {
  const cards = teachers.map((teacher) => ({
    teacher,
    photo: resolveImage(teacher.photo)
  }));

  return (
    <Section id="teachers">
      {withHeading ? (
        <Container>
          <SectionHeading
            number={teachersIntro.eyebrow.number}
            label={teachersIntro.eyebrow.label}
            heading={teachersIntro.heading}
            text={teachersIntro.text}
            split
          />
        </Container>
      ) : null}

      <TeachersMarquee cards={cards} />
    </Section>
  );
}
