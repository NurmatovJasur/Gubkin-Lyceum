import type { Metadata } from 'next';
import { site } from '@/site.config';
import { administrationIntro } from '@/data/content';
import { InnerHero } from '@/components/sections/PageHero';
import { Administration } from '@/components/sections/Administration';
import { AdmissionCTA } from '@/components/sections/AdmissionCTA';

export const metadata: Metadata = {
  title: 'Администрация',
  description:
    'Администрация академического лицея имени И.М. Губкина в Ташкенте: организация учебного процесса и приёма учащихся.',
  alternates: { canonical: '/administration' },
  openGraph: {
    title: `Администрация | ${site.name}`,
    description: 'Администрация академического лицея имени И.М. Губкина в Ташкенте.',
    url: '/administration'
  }
};

export default function AdministrationPage() {
  return (
    <>
      <InnerHero
        eyebrow={administrationIntro.eyebrow}
        title={administrationIntro.heading}
        text={administrationIntro.text}
      />
      <Administration />
      <AdmissionCTA />
    </>
  );
}
