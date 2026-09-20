import { teachers } from '@/data/teachers';
import { teachersIntro } from '@/data/content';
import { resolveImage } from '@/lib/images';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TeacherCard } from '@/components/ui/TeacherCard';
import { Reveal } from '@/components/animations/Reveal';
import { TeachersCarousel } from '@/components/sections/TeachersCarousel';

/**
 * Секция «Преподаватели».
 *
 * Desktop — сетка 4×2, мобильные — карусель Swiper: восемь портретов
 * в одну колонку превращали бы экран в бесконечную ленту.
 * [ЗАМЕНИТЬ НА ФАКТИЧЕСКИЕ ДАННЫЕ] — data/teachers.ts
 */
export function Teachers({ withHeading = true }: { withHeading?: boolean }) {
  const cards = teachers.map((teacher) => ({
    teacher,
    photo: resolveImage(teacher.photo)
  }));

  return (
    <Section id="teachers">
      <Container>
        {withHeading ? (
          <SectionHeading
            number={teachersIntro.eyebrow.number}
            label={teachersIntro.eyebrow.label}
            heading={teachersIntro.heading}
            text={teachersIntro.text}
            split
          />
        ) : null}

        {/* Мобильные: карусель */}
        <TeachersCarousel className="lg:hidden">
          {cards.map(({ teacher, photo }) => (
            <TeacherCard key={teacher.id} teacher={teacher} photo={photo} sizes="70vw" />
          ))}
        </TeachersCarousel>

        {/* Desktop: сетка */}
        <Reveal
          as="ul"
          stagger={0.08}
          childSelector=":scope > li"
          className="hidden gap-x-[clamp(14px,1.6vw,28px)] gap-y-[clamp(16px,2vw,34px)] lg:grid lg:grid-cols-4"
        >
          {cards.map(({ teacher, photo }) => (
            <li key={teacher.id}>
              <TeacherCard teacher={teacher} photo={photo} />
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
