import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { news, getArticle, formatDate } from '@/data/news';
import { site } from '@/site.config';
import { resolveImage } from '@/lib/images';
import { Container, Section } from '@/components/ui/Container';
import { TextLink } from '@/components/ui/Button';
import { NewsCard } from '@/components/ui/NewsCard';
import { Media } from '@/components/ui/Media';
import { Reveal } from '@/components/animations/Reveal';
import { ImageReveal } from '@/components/animations/ImageReveal';
import Link from 'next/link';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return news.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) return {};

  // Заголовки новостей — placeholder'ы до заполнения данных администрацией.
  const title = article.title.startsWith('[')
    ? `Новость лицея — ${article.category}`
    : article.title;

  return {
    title,
    description: article.excerpt.startsWith('[')
      ? `Материал рубрики «${article.category}» академического лицея имени И.М. Губкина в Ташкенте.`
      : article.excerpt,
    alternates: { canonical: `/news/${article.slug}` },
    openGraph: {
      type: 'article',
      title: `${title} | ${site.name}`,
      url: `/news/${article.slug}`
    }
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) notFound();

  const image = resolveImage(article.image);
  const related = news.filter((item) => item.slug !== article.slug).slice(0, 3);
  const pending = article.title.startsWith('[');

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
            <Link href="/news" className="hover:text-blue">
              Новости
            </Link>
          </nav>

          <Reveal className="max-w-[24ch]">
            <p className="mb-4 flex items-center gap-[10px] text-label text-subtle uppercase">
              <span>{formatDate(article.date)}</span>
              <span aria-hidden="true" className="size-[3px] rounded-full bg-line-strong" />
              <span className="text-blue">{article.category}</span>
            </p>
            <h1 className={pending ? 'text-h1 text-subtle' : 'text-h1'}>{article.title}</h1>
          </Reveal>

          <ImageReveal className="mt-10 aspect-16/9">
            <Media image={image} sizes="(max-width: 1440px) 100vw, 1440px" priority quality={85} />
          </ImageReveal>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal className="grid max-w-[64ch] gap-5 text-[clamp(16px,1.15vw,18px)] leading-[1.75] text-muted">
            <p className="text-[clamp(19px,1.6vw,24px)] leading-[1.5] text-black">
              {article.excerpt}
            </p>
            {/* [ЗАМЕНИТЬ НА ФАКТИЧЕСКИЕ ДАННЫЕ] — текст новости в data/news.ts */}
            {article.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>

          <Reveal className="mt-12 border-t border-line pt-6">
            <TextLink href="/news">Все новости</TextLink>
          </Reveal>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <h2 className="mb-6 text-label font-normal text-subtle uppercase">Читайте также</h2>
          <Reveal
            stagger={0.09}
            childSelector=":scope > div"
            className="grid gap-x-[clamp(18px,2vw,34px)] gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {related.map((item) => (
              <div key={item.id}>
                <NewsCard
                  article={item}
                  image={resolveImage(item.image)}
                  sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 30vw"
                />
              </div>
            ))}
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
