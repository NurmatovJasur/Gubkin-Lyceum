import { teachers } from '@/data/teachers';
import { teachersIntro } from '@/data/content';
import { resolveImage } from '@/lib/images';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TeacherCard } from '@/components/ui/TeacherCard';
import { Reveal } from '@/components/animations/Reveal';
import { TeachersMarquee } from '@/components/sections/TeachersMarquee';

/**
 * Секция «Преподаватели»: бесконечная лента портретов (TeachersMarquee),
 * одинаковая на всех экранах — без отдельной мобильной карусели.
 * [ЗАМЕНИТЬ НА ФАКТИЧЕСКИЕ ДАННЫЕ] — data/teachers.ts
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

      <Reveal>
        <TeachersMarquee>
          {cards.map(({ teacher, photo }) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              photo={photo}
              sizes="(max-width: 639px) 70vw, 300px"
            />
          ))}
        </TeachersMarquee>
      </Reveal>
    </Section>
  );
}
