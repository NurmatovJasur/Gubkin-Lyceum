import type { Metadata } from 'next';
import { site } from '@/site.config';
import { news } from '@/data/news';
import { newsIntro } from '@/data/content';
import { resolveImage } from '@/lib/images';
import { InnerHero } from '@/components/sections/PageHero';
import { Container, Section } from '@/components/ui/Container';
import { NewsCard } from '@/components/ui/NewsCard';
import { Reveal } from '@/components/animations/Reveal';

export const metadata: Metadata = {
  title: 'Новости и события',
  description:
    'Новости, олимпиады, конкурсы, проекты и мероприятия академического лицея имени И.М. Губкина в Ташкенте.',
  alternates: { canonical: '/news' },
  openGraph: {
    title: `Новости и события | ${site.name}`,
    description: 'Олимпиады, конкурсы, проекты и мероприятия академического лицея имени И.М. Губкина.',
    url: '/news'
  }
};

export default function NewsPage() {
  return (
    <>
      <InnerHero
        title={['Новости', 'и события.']}
        text={newsIntro.text}
      />

      <Section>
        <Container>
          {/* [ЗАМЕНИТЬ НА ФАКТИЧЕСКИЕ ДАННЫЕ] — записи новостей в data/news.ts */}
          <Reveal
            stagger={0.09}
            childSelector=":scope > div"
            className="grid gap-x-[clamp(18px,2vw,34px)] gap-y-[clamp(26px,3vw,52px)] sm:grid-cols-2 lg:grid-cols-3"
          >
            {news.map((article, index) => (
              <div key={article.id}>
                <NewsCard
                  article={article}
                  image={resolveImage(article.image)}
                  priority={index === 0}
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
