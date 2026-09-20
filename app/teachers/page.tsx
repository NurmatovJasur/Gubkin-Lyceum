import type { Metadata } from 'next';
import { site } from '@/site.config';
import { teachersIntro } from '@/data/content';
import { InnerHero } from '@/components/sections/PageHero';
import { Teachers } from '@/components/sections/Teachers';
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
  return (
    <>
      <InnerHero
        eyebrow={teachersIntro.eyebrow}
        title={teachersIntro.heading}
        text={teachersIntro.text}
      />
      <Teachers withHeading={false} />
      <AdmissionCTA />
    </>
  );
}
