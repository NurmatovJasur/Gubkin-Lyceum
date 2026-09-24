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
export function Teachers() {
  const cards = teachers.map((teacher) => ({
    teacher,
    photo: resolveImage(teacher.photo)
  }));

  return (
    <Section id="teachers">
      <Container>
        <SectionHeading
          heading={teachersIntro.heading}
          text={teachersIntro.text}
          split
        />
      </Container>

      <TeachersMarquee cards={cards} />
    </Section>
  );
}
