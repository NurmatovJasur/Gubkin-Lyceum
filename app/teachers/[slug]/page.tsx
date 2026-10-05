import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { site } from '@/site.config';
import { teachers, getTeacher, rankLabel } from '@/data/teachers';
import { resolveImage } from '@/lib/images';
import { Container, Section } from '@/components/ui/Container';
import { TextLink } from '@/components/ui/Button';
import { TeacherCard } from '@/components/ui/TeacherCard';
import { TeacherPortrait } from '@/components/ui/TeacherPortrait';
import { Reveal } from '@/components/animations/Reveal';
import { AdmissionCTA } from '@/components/sections/AdmissionCTA';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return teachers.map((teacher) => ({ slug: teacher.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const teacher = getTeacher(slug);

  if (!teacher) return {};

  const description = teacher.bio
    ? teacher.bio
    : `${teacher.role}, ${teacher.subject}. Академический лицей имени И.М. Губкина в Ташкенте.`;

  return {
    title: teacher.name,
    description,
    alternates: { canonical: `/teachers/${teacher.slug}` },
    openGraph: {
      type: 'profile',
      title: `${teacher.name} | ${site.name}`,
      description,
      url: `/teachers/${teacher.slug}`
    }
  };
}

/**
 * Персональная страница преподавателя: портрет без печатного текста с
 * плаката, должность, предмет и полная справка. Сюда ведёт карточка — из
 * ленты на главной и из сетки /teachers, где справка обрезана многоточием.
 * Внизу — коллеги по предмету, чтобы страница не была тупиком.
 */
export default async function TeacherPage({ params }: PageProps) {
  const { slug } = await params;
  const teacher = getTeacher(slug);

  if (!teacher) notFound();

  const photo = resolveImage(teacher.photo);

  // Сначала коллеги по предмету, затем по званию — чтобы ряд не пустовал.
  const others = [
    ...teachers.filter((item) => item.slug !== teacher.slug && item.subject === teacher.subject),
    ...teachers.filter((item) => item.slug !== teacher.slug && item.subject !== teacher.subject && item.rank === teacher.rank)
  ].slice(0, 4);

  return (
    <>
      <Section className="pt-[calc(92px+clamp(32px,4vw,64px))] pb-0">
        <Container>
          <nav
            aria-label="Хлебные крошки"
            className="mb-8 flex items-center gap-2.5 text-[12.5px] text-subtle"
          >
            <Link href="/" className="hover:text-blue">
              Главная
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/teachers" className="hover:text-blue">
              Преподаватели
            </Link>
          </nav>

          <div className="grid gap-[clamp(28px,4vw,64px)] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
            <Reveal>
              <TeacherPortrait
                photo={photo}
                sizes="(max-width: 900px) 100vw, 460px"
                className="aspect-4/5 rounded-media"
                priority
                quality={88}
              />
            </Reveal>

            <Reveal className="lg:pt-4">
              <p className="mb-4 text-label text-blue uppercase">{rankLabel(teacher.rank)}</p>
              <h1 className="text-h1">{teacher.name}</h1>

              <dl className="mt-8 grid gap-px border-t border-line bg-line sm:grid-cols-2">
                <div className="bg-white py-5 pr-5">
                  <dt className="mb-1.5 text-[12.5px] text-subtle">Предмет</dt>
                  <dd className="text-[17px] font-bold">{teacher.subject}</dd>
                </div>
                <div className="bg-white py-5 pr-5 sm:pl-5">
                  <dt className="mb-1.5 text-[12.5px] text-subtle">Должность</dt>
                  <dd className="text-[17px] font-bold">{teacher.role}</dd>
                </div>
              </dl>

              {teacher.bio ? (
                <div className="mt-8 border-t border-line pt-8">
                  <h2 className="mb-4 text-label font-normal text-subtle uppercase">
                    О преподавателе
                  </h2>
                  <p className="max-w-[56ch] text-[clamp(16px,1.15vw,18px)] leading-[1.75] text-muted">
                    {teacher.bio}
                  </p>
                </div>
              ) : null}

              <div className="mt-10">
                <TextLink href="/teachers">Все преподаватели</TextLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {others.length > 0 ? (
        <Section>
          <Container>
            <h2 className="mb-6 text-label font-normal text-subtle uppercase">
              Другие преподаватели
            </h2>
            <Reveal
              stagger={0.09}
              childSelector=":scope > a"
              className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4"
            >
              {others.map((item) => (
                <Link
                  key={item.id}
                  href={`/teachers/${item.slug}`}
                  aria-label={item.name}
                  className="group block h-full outline-offset-4"
                >
                  <TeacherCard
                    teacher={item}
                    photo={resolveImage(item.photo)}
                    sizes="(max-width: 560px) 50vw, (max-width: 900px) 33vw, 300px"
                  />
                </Link>
              ))}
            </Reveal>
          </Container>
        </Section>
      ) : null}

      <AdmissionCTA />
    </>
  );
}
