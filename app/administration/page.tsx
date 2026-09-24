import type { Metadata } from 'next';
import { site } from '@/site.config';
import type { AdminLevel, AdminMember } from '@/types';
import { administrationIntro, administrationLevels, director } from '@/data/administration';
import { resolveImage } from '@/lib/images';
import { InnerHero } from '@/components/sections/PageHero';
import { Container, Section } from '@/components/ui/Container';
import { Media } from '@/components/ui/Media';
import { Reveal } from '@/components/animations/Reveal';
import { AdmissionCTA } from '@/components/sections/AdmissionCTA';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Администрация',
  description:
    'Администрация академического лицея имени И.М. Губкина в Ташкенте: директор, заместители директора, бухгалтерия и отдел кадров — должности и кабинеты.',
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
 * административные службы. Уровни соединены линией, как в оргструктуре.
 * Карточки выводятся целиком, без обрезки.
 */
export default function AdministrationPage() {
  const levels: AdminLevel[] = [
    { id: 'director', number: '01', title: 'Директор', members: [director] },
    ...administrationLevels
  ];

  return (
    <>
      <InnerHero
        title={administrationIntro.heading}
        text={administrationIntro.text}
      />

      <Section className="bg-mist">
        <Container>
          <ol className="grid">
            {levels.map((level, index) => (
              <li key={level.id} className="grid justify-items-center">
                {index > 0 ? <Connector /> : null}

                <Reveal className="mb-[clamp(20px,2.4vw,32px)] text-eyebrow uppercase">
                  <h2 className="text-muted">{level.title}</h2>
                </Reveal>

                <Reveal
                  as="ul"
                  stagger={0.1}
                  className={cn(
                    'grid w-full justify-center gap-[clamp(16px,2vw,28px)]',
                    index === 0
                      ? 'grid-cols-[minmax(0,380px)]'
                      : 'grid-cols-[minmax(0,320px)] sm:grid-cols-[repeat(2,minmax(0,320px))]'
                  )}
                >
                  {level.members.map((member) => (
                    <li key={member.id}>
                      <AdminCard member={member} lead={index === 0} />
                    </li>
                  ))}
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <AdmissionCTA />
    </>
  );
}

/** Вертикальная линия между уровнями схемы. */
function Connector() {
  return (
    <span aria-hidden="true" className="relative my-[clamp(20px,2.4vw,32px)] block h-[clamp(40px,5vw,72px)] w-px bg-line-strong">
      <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-blue" />
    </span>
  );
}

/** Карточка сотрудника целиком — как её предоставила администрация. */
function AdminCard({ member, lead = false }: { member: AdminMember; lead?: boolean }) {
  const photo = resolveImage(member.photo);

  return (
    <figure className="relative isolate aspect-[483/688] w-full overflow-hidden rounded-media border border-line bg-[#eaefef] transition-[transform,box-shadow] duration-500 ease-out-brand hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(10,26,60,0.35)]">
      <Media
        image={photo}
        fit="contain"
        priority={lead}
        sizes={lead ? '(max-width: 640px) 100vw, 380px' : '(max-width: 640px) 100vw, 320px'}
      />
    </figure>
  );
}
