import type { Metadata } from 'next';
import { site } from '@/site.config';
import { directionsIntro } from '@/data/content';
import { Directions } from '@/components/sections/Directions';
import { InnerHero } from '@/components/sections/PageHero';
import { AdmissionCTA } from '@/components/sections/AdmissionCTA';

export const metadata: Metadata = {
  title: 'Направления обучения',
  description:
    'Четыре направления обучения академического лицея имени И.М. Губкина в Ташкенте: экономика, техника, финансы и IT.',
  alternates: { canonical: '/directions' },
  openGraph: {
    title: `Направления обучения | ${site.name}`,
    description:
      'Экономика, техника, финансы и IT — направления подготовки академического лицея имени И.М. Губкина.',
    url: '/directions'
  }
};

export default function DirectionsPage() {
  return (
    <>
      <InnerHero
        title={directionsIntro.heading}
        text={directionsIntro.text}
      />
      <Directions withHeading={false} />
      <AdmissionCTA />
    </>
  );
}
