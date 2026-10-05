/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import type { NewsArticle } from '@/types';
import { news, formatDate } from '@/data/news';
import { resolveImage } from '@/lib/images';
import { AosReveal } from '@/components/animations/AosReveal';
import styles from './NewsFeed.module.css';

/**
 * «Новости лицея» — вёрстка секции `.news-section` с newuu.uz/en/,
 * наполненная материалами лицея из data/news.ts.
 *
 * Разметка повторяет оригинал узел в узел, включая порядок дочерних элементов
 * (в карточках `_1`/`_2` дата идёт перед заголовком, в `_3` — после)
 * и дублирование правой колонки для мобильной вёрстки (`d-none` / `d-sm-none`).
 *
 * Стили — NewsFeed.module.css, анимация появления — AosReveal
 * (GSAP ScrollTrigger с параметрами AOS из оригинала).
 */

/** Раскладка оригинала: 1 крупная карточка + 2 средние + остальные справа. */
const feature = news[0];
const middle = news.slice(1, 3);
const aside = news.slice(3);

type CardVariant = 1 | 2 | 3;

type CardProps = {
  article: NewsArticle;
  variant: CardVariant;
  /** `data-aos` оригинала. */
  aos: 'zoom-in' | 'fade-up';
  /** `data-aos-delay` оригинала, мс. */
  delay: number;
};

const variantClass: Record<CardVariant, string> = {
  1: styles.card1,
  2: styles.card2,
  3: styles.card3
};

function NewsCard({ article, variant, aos, delay }: CardProps) {
  const image = resolveImage(article.image);

  /* Дата материала. Для неподтверждённых дат выводится «[ДАТА]» — так же,
     как в остальных блоках сайта (см. data/news.ts). */
  const date = (
    <div className={styles.cardNav}>
      <span className={styles.cardNavItem}>
        <i className={`${styles.icon} ${styles.iconCalendarClock}`} aria-hidden="true" />
        {formatDate(article.date)}
      </span>
    </div>
  );

  const title = <h3 className={styles.cardTitle}>{article.title}</h3>;

  return (
    <Link
      href={`/news/${article.slug}`}
      className={`${styles.card} ${variantClass[variant]}`}
      data-aos={aos}
      data-aos-duration="500"
      data-aos-delay={String(delay)}
    >
      <div className={styles.cardImage}>
        <div className={styles.cardImageWrapper}>
          <img src={image.src} alt={image.alt} />
        </div>
      </div>
      <div className={styles.cardInfo}>
        {/* В `_3` заголовок идёт первым — так в оригинальной разметке. */}
        {variant === 3 ? (
          <>
            {title}
            {date}
          </>
        ) : (
          <>
            {date}
            {title}
          </>
        )}
      </div>
    </Link>
  );
}

export function NewsFeed() {
  return (
    <section id="news" className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          Новости <span>лицея</span>
        </h2>
        <Link href="/news" className={styles.sectionLink}>
          Все новости
          <i className={`${styles.icon} ${styles.iconAngleRight}`} aria-hidden="true" />
        </Link>
      </div>

      <AosReveal className={styles.row}>
        {/* 1 — крупная карточка, прилипает к хедеру при прокрутке */}
        <div>
          <NewsCard article={feature} variant={1} aos="zoom-in" delay={0} />
        </div>

        {/* 2 — средняя колонка */}
        <div>
          {middle.map((article, index) => (
            <NewsCard
              key={article.id}
              article={article}
              variant={2}
              aos="zoom-in"
              delay={200 + index * 200}
            />
          ))}
        </div>

        {/* 3 — правая колонка, от 576px */}
        <div className={`${styles.newsRight} ${styles.dNone} ${styles.dSmBlock}`}>
          {aside.map((article, index) => (
            <NewsCard
              key={article.id}
              article={article}
              variant={3}
              aos="fade-up"
              delay={600 + index * 200}
            />
          ))}
        </div>

        {/* 4 — те же новости для экранов до 576px */}
        <div className={`${styles.dSmNone} ${styles.dBlock}`}>
          {aside.map((article, index) => (
            <NewsCard
              key={article.id}
              article={article}
              variant={2}
              aos="zoom-in"
              delay={200 + index * 200}
            />
          ))}
        </div>
      </AosReveal>
    </section>
  );
}
