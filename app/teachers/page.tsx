import type { Metadata } from 'next';
import { site } from '@/site.config';
import { teachersIntro } from '@/data/content';
import { InnerHero } from '@/components/sections/PageHero';
import { teachers, teacherRanks } from '@/data/teachers';
import { resolveImage } from '@/lib/images';
import { Container, Section } from '@/components/ui/Container';
import { TeachersByRank } from '@/components/sections/TeachersByRank';
import { AdmissionCTA } from '@/components/sections/AdmissionCTA';

export const metadata: Metadata = {
  title: 'Преподаватели',
  description:
    'Педагоги академического лицея имени И.М. Губкина в Ташкенте: преподаватели направлений, подготовка к олимпиадам и поступлению.',
  alternates: { canonical: '/teachers' },
  openGraph: {
    title: `Преподаватели | ${site.name}`,
    description:
      'Педагоги академического лицея имени И.М. Губкина в Ташкенте.',
    url: '/teachers'
  }
};

export default function TeachersPage() {
  const groups = teacherRanks
    .map((rank) => ({
      ...rank,
      cards: teachers
        .filter((teacher) => teacher.rank === rank.id)
        .map((teacher) => ({ teacher, photo: resolveImage(teacher.photo) }))
    }))
    .filter((group) => group.cards.length > 0);

  return (
    <>
      <InnerHero
        title={teachersIntro.heading}
        text={teachersIntro.text}
      />
      <Section id="teachers">
        <Container>
          <TeachersByRank groups={groups} />
        </Container>
      </Section>
      <AdmissionCTA />
    </>
  );
}
