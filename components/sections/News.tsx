import { featuredNews } from '@/data/news';
import { newsIntro } from '@/data/content';
import { resolveImage } from '@/lib/images';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { NewsCard } from '@/components/ui/NewsCard';
import { TextLink } from '@/components/ui/Button';
import { Reveal } from '@/components/animations/Reveal';

/**
 * Секция «Жизнь лицея»: одна крупная новость + две обычные.
 * [ЗАМЕНИТЬ НА ФАКТИЧЕСКИЕ ДАННЫЕ] — data/news.ts
 */
export function News() {
  const [feature, ...rest] = featuredNews;

  return (
    <Section id="news">
      <Container>
        <SectionHeading
          heading={newsIntro.heading}
          text={newsIntro.text}
          split
        />

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.22fr)_minmax(0,0.78fr)] lg:gap-[clamp(22px,3vw,54px)]">
          <Reveal>
            <NewsCard
              article={feature}
              image={resolveImage(feature.image)}
              variant="feature"
              sizes="(max-width: 900px) 100vw, 55vw"
            />
          </Reveal>

          <Reveal
            stagger={0.09}
            childSelector=":scope > div"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:gap-[clamp(20px,2.4vw,34px)]"
          >
            {rest.map((article) => (
              <div key={article.id}>
                <NewsCard
                  article={article}
                  image={resolveImage(article.image)}
                  sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 27vw"
                />
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal className="mt-[clamp(32px,4vw,56px)] border-t border-line pt-[clamp(22px,2.6vw,36px)]">
          <TextLink href="/news">Все новости</TextLink>
        </Reveal>
      </Container>
    </Section>
  );
}
