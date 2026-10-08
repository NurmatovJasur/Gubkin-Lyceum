import type { Metadata } from 'next';
import { site } from '@/site.config';
import {
  administrationIntro,
  administrationLevels,
  director
} from '@/data/administration';
import { resolveImage } from '@/lib/images';
import { InnerHero } from '@/components/sections/PageHero';
import { AdminChart, type ChartLevel } from '@/components/sections/AdminChart';
import { AdmissionCTA } from '@/components/sections/AdmissionCTA';
import { Container, Section } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Администрация',
  description:
    'Администрация академического лицея имени И.М. Губкина в Ташкенте: директор, заместители директора, бухгалтерия, отдел кадров и специалисты лицея.',
  alternates: { canonical: '/administration' },
  openGraph: {
    title: `Администрация | ${site.name}`,
    description: 'Руководство академического лицея имени И.М. Губкина в Ташкенте.',
    url: '/administration'
  }
};

/**
 * Страница «Администрация».
 *
 * Схема подчинения сверху вниз: директор, под ним заместители, ниже —
 * административные службы и специалисты лицея (психолог, руководитель
 * физического воспитания, руководитель информационно-ресурсного центра).
 * Связи между уровнями прочерчиваются по мере прокрутки
 * (см. components/sections/AdminChart.tsx).
 *
 * Фотографии из `public/images/admin-NN.jpg` — печатные карточки, поэтому
 * здесь выводится только кадр портрета, а ФИО и должность набираются
 * вёрсткой из data/administration.ts: такой текст переводится,
 * индексируется и читается экранными дикторами.
 */
export default function AdministrationPage() {
  const levels: ChartLevel[] = [
    { id: 'director', number: '01', title: 'Директор', caption: 'Руководство лицеем', members: [director] },
    ...administrationLevels
  ].map((level) => ({
    ...level,
    members: level.members.map((member) => ({
      ...member,
      image: resolveImage(member.photo)
    }))
  }));

  return (
    <>
      <InnerHero
        eyebrow={administrationIntro.eyebrow}
        title={administrationIntro.heading}
        text={administrationIntro.text}
      />

      <Section className="relative overflow-hidden bg-mist">
        {/* Фон схемы: сетка точек, растворяющаяся к краям. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 text-line-strong"
          style={{
            backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.45,
            maskImage: 'radial-gradient(68% 52% at 50% 38%, #000, transparent)',
            WebkitMaskImage: 'radial-gradient(68% 52% at 50% 38%, #000, transparent)'
          }}
        />

        <Container className="relative">
          <AdminChart levels={levels} />
        </Container>
      </Section>

      <AdmissionCTA />
    </>
  );
}
