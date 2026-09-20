import type { Metadata } from 'next';
import { site } from '@/site.config';
import { directions } from '@/data/directions';
import { InnerHero } from '@/components/sections/PageHero';
import { Container, Section } from '@/components/ui/Container';
import { TextLink } from '@/components/ui/Button';
import { Reveal } from '@/components/animations/Reveal';
import { FAQ } from '@/components/sections/FAQ';
import { AdmissionCTA } from '@/components/sections/AdmissionCTA';

export const metadata: Metadata = {
  title: 'Поступление',
  description:
    'Поступление в академический лицей имени И.М. Губкина в Ташкенте: направления обучения, порядок приёма и контакты приёмной комиссии.',
  alternates: { canonical: '/admission' },
  openGraph: {
    title: `Поступление | ${site.name}`,
    description:
      'Направления обучения, порядок приёма и контакты приёмной комиссии академического лицея имени И.М. Губкина.',
    url: '/admission'
  }
};

/**
 * Страница «Поступление».
 *
 * Порядок подачи документов, сроки и требования — [ОТВЕТ АДМИНИСТРАЦИИ]:
 * до подтверждения они не публикуются. Страница даёт то, что подтверждено:
 * список направлений, ответы на частые вопросы и контакты.
 */
export default function AdmissionPage() {
  return (
    <>
      <InnerHero
        eyebrow={{ number: '06', label: 'Поступление' }}
        title={['Как поступить', 'в лицей.']}
        text="Расскажем о направлениях, порядке поступления и ответим на вопросы родителей и будущих учеников."
      />

      <Section>
        <Container>
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-[clamp(28px,5vw,100px)]">
            <Reveal>
              <h2 className="text-h2">
                <span className="block">Шаг первый —{' '}</span>
                <span className="block">выбрать направление.</span>
              </h2>
            </Reveal>

            <Reveal delay={120}>
              <ul className="border-t border-line">
                {directions.map((direction) => (
                  <li key={direction.id} className="border-b border-line">
                    <div className="grid gap-1 py-5 sm:grid-cols-[56px_minmax(0,1fr)] sm:items-baseline sm:gap-4">
                      <span aria-hidden="true" className="text-label text-subtle">
                        {direction.number}
                      </span>
                      <div>
                        <h3 className="mb-1 text-[clamp(18px,1.5vw,23px)] font-bold tracking-[-0.02em]">
                          {direction.title}
                        </h3>
                        <p className="mb-2.5 text-[15px] text-muted">{direction.description}</p>
                        <TextLink href={`/directions/${direction.slug}`}>
                          О направлении
                        </TextLink>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* [ОТВЕТ АДМИНИСТРАЦИИ] — сроки приёма, документы, вступительные испытания */}
              <p className="mt-8 max-w-[52ch] text-[15px] text-subtle">
                Порядок подачи документов, сроки приёма и формат вступительных испытаний
                публикуются после подтверждения администрацией лицея. Актуальную информацию
                можно получить в приёмной комиссии по телефону {site.contacts.phone}.
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <FAQ />
      <AdmissionCTA />
    </>
  );
}
