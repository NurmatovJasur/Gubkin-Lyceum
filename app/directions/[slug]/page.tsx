import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { directions, getDirection } from '@/data/directions';
import { site } from '@/site.config';
import { resolveImage } from '@/lib/images';
import { Container, Section } from '@/components/ui/Container';
import { Button, TextLink } from '@/components/ui/Button';
import { PageHero } from '@/components/sections/PageHero';
import { Reveal } from '@/components/animations/Reveal';
import { MagneticButton } from '@/components/animations/MagneticButton';
import { cn } from '@/lib/utils';

type PageProps = { params: Promise<{ slug: string }> };

/**
 * Страницы направлений строятся из данных (data/directions.ts) —
 * один шаблон вместо четырёх почти одинаковых файлов. Все четыре URL
 * (/directions/economics, /technology, /finance, /it) генерируются
 * статически на этапе сборки.
 */
export function generateStaticParams() {
  return directions.map((direction) => ({ slug: direction.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const direction = getDirection(slug);

  if (!direction) return {};

  const title = `${direction.title} — направление обучения`;
  const description = `Направление «${direction.title}» в академическом лицее имени И.М. Губкина в Ташкенте: что изучают, какие навыки получают учащиеся и как поступить.`;

  return {
    title,
    description,
    alternates: { canonical: `/directions/${direction.slug}` },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: `/directions/${direction.slug}`
    }
  };
}

/** Блок «характеристики направления»: подпись слева, список справа. */
function Spec({
  label,
  items,
  note
}: {
  label: string;
  items: string[];
  note?: string;
}) {
  return (
    <Reveal className="grid items-start gap-4 border-t border-line py-[clamp(28px,3.4vw,52px)] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-[clamp(14px,3vw,70px)]">
      <h2 className="text-[clamp(17px,1.5vw,23px)] leading-tight font-bold tracking-[-0.02em]">
        {label}
      </h2>

      <div>
        <ul className="grid max-w-[56ch] gap-3">
          {items.map((item) => (
            <li
              key={item}
              className={cn(
                'relative pl-[26px] text-[clamp(15px,1.1vw,17px)] leading-relaxed',
                item.startsWith('[') ? 'text-subtle' : 'text-muted',
                'before:absolute before:top-[0.75em] before:left-0 before:h-px before:w-3 before:bg-blue before:content-[""]'
              )}
            >
              {item}
            </li>
          ))}
        </ul>
        {note ? <p className="mt-4 max-w-[48ch] text-[13.5px] text-subtle">{note}</p> : null}
      </div>
    </Reveal>
  );
}

export default async function DirectionPage({ params }: PageProps) {
  const { slug } = await params;
  const direction = getDirection(slug);

  if (!direction) notFound();

  const others = directions.filter((item) => item.slug !== direction.slug);

  return (
    <>
      <PageHero
        image={resolveImage(direction.hero)}
        title={direction.title}
        intro={direction.description}
        eyebrow={{ number: direction.number, label: 'Направление' }}
        breadcrumb={{ label: 'Направления', href: '/directions' }}
      />

      <Section>
        <Container>
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-[clamp(28px,4vw,90px)]">
            <Reveal>
              <p className="max-w-[24ch] text-[clamp(20px,2.2vw,34px)] leading-[1.34] tracking-[-0.022em]">
                {direction.intro}
              </p>
            </Reveal>

            <Reveal delay={120} className="grid gap-4.5 lg:pt-2">
              <p className="max-w-[38ch] text-[15px] text-muted">
                Программа направления формируется лицеем. Точный перечень предметов уточняйте
                у приёмной комиссии.
              </p>
              <p>
                <TextLink href="/admission">Узнать о поступлении</TextLink>
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="border-b border-line">
            <Spec label="Что изучают" items={direction.study} />
            {/* [ПРЕДМЕТЫ НАПРАВЛЕНИЯ] — заполняется администрацией в data/directions.ts */}
            <Spec
              label="Основные предметы"
              items={direction.subjects}
              note="Перечень предметов предоставляется администрацией лицея."
            />
            <Spec label="Какие навыки получают учащиеся" items={direction.skills} />
            {/* [ТРЕБУЕТСЯ УТОЧНЕНИЕ] — проекты, олимпиады и мероприятия направления */}
            <Spec
              label="Проекты, олимпиады, мероприятия"
              items={direction.activities}
              note="Список мероприятий уточняется у администрации лицея."
            />
            {/* [ТРЕБУЕТСЯ УТОЧНЕНИЕ] — вузы и специальности для продолжения обучения */}
            <Spec
              label="Куда можно поступать дальше"
              items={direction.next}
              note="Направления дальнейшего обучения уточняются у администрации лицея."
            />
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <Reveal className="flex flex-wrap items-end justify-between gap-6 border-b border-line py-[clamp(36px,4.5vw,72px)]">
            <h2 className="max-w-[18ch] text-[clamp(25px,3.2vw,46px)] leading-[1.04] font-bold tracking-[-0.032em]">
              <span className="block">Хотите учиться{' '}</span>
              <span className="block">на направлении «{direction.title}»?</span>
            </h2>

            <div className="flex flex-wrap gap-3.5 max-sm:w-full">
              <MagneticButton className="max-sm:w-full">
                <Button href="/admission" size="lg" className="max-sm:w-full">
                  Узнать о поступлении
                </Button>
              </MagneticButton>
              <Button
                href={site.contacts.phoneHref}
                variant="ghost"
                size="lg"
                arrow={false}
                className="max-sm:w-full"
              >
                {site.contacts.phone}
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <h2 className="mb-6 text-label font-normal text-subtle uppercase">Другие направления</h2>
          <ul className="border-t border-line">
            {others.map((other) => (
              <Reveal as="li" key={other.id}>
                <Link
                  href={`/directions/${other.slug}`}
                  className="group grid grid-cols-[44px_minmax(0,1fr)_30px] items-center gap-x-3 gap-y-1 border-b border-line py-[clamp(20px,2.2vw,30px)] transition-colors duration-200 ease-brand hover:text-blue lg:grid-cols-[56px_minmax(0,0.6fr)_minmax(0,1fr)_40px] lg:gap-[clamp(12px,2vw,32px)]"
                >
                  <span aria-hidden="true" className="text-label text-subtle">
                    {other.number}
                  </span>
                  <span className="text-[clamp(18px,1.8vw,26px)] font-bold tracking-[0.01em]">
                    {other.titleUpper}
                  </span>
                  <span className="col-start-2 text-sm text-muted lg:col-start-3 lg:text-[15px]">
                    {other.description}
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="col-start-3 size-5 justify-self-end transition-transform duration-500 ease-out-brand group-hover:translate-x-[5px] lg:col-start-4"
                  />
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
