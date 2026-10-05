import Link from 'next/link';
import type { Direction } from '@/types';
import { directions } from '@/data/directions';
import { programsIntro } from '@/data/content';
import { resolveImage } from '@/lib/images';
import { Media } from '@/components/ui/Media';
import { ProgramIcon } from '@/components/ui/ProgramIcon';
import { AosReveal } from '@/components/animations/AosReveal';
import styles from './Programs.module.css';

/**
 * «Направления и программы» — вёрстка секции `#program-section`
 * с newuu.uz/en/, наполненная направлениями лицея из data/directions.ts.
 *
 * Разметка повторяет оригинал узел в узел: заголовок с градиентным вторым
 * словом, ряд карточек, внутри каждой — подложка-фотография, шапка
 * (заголовок + иконка), разделитель и ссылка «Подробнее».
 *
 * Стили — Programs.module.css (там же перечислены отличия от оригинала).
 *
 * Появление при прокрутке — AOS-поведение оригинала: `fade-right`, то есть
 * карточка выезжает слева (`translate3d(-100px, 0, 0)` → 0) и при прокрутке
 * назад уезжает обратно влево (`once: false`). Карточки идут цепочкой —
 * `data-aos-delay` с шагом 100мс, так что вторая строка подхватывает первую.
 * Воспроизведено на GSAP ScrollTrigger — components/animations/AosReveal.tsx.
 */
function ProgramCard({ direction }: { direction: Direction }) {
  const image = resolveImage(direction.image);

  return (
    <Link href={`/directions/${direction.slug}`} className={styles.card}>
      <div className={styles.cardImage}>
        <Media image={image} sizes="(max-width: 767px) 100vw, 410px" />
      </div>

      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{direction.title}</h3>
        <div className={styles.cardIcon}>
          <ProgramIcon id={direction.id} />
        </div>
      </div>

      <div className={styles.cardDivider} />

      <span className={styles.cardLink}>
        Подробнее
        <i className={`${styles.icon} ${styles.iconArrowRight}`} aria-hidden="true" />
      </span>
    </Link>
  );
}

export function Programs() {
  return (
    <section id="directions" className={styles.section}>
      <h2 className={styles.sectionTitle}>
        {programsIntro.heading} <span>{programsIntro.headingAccent}</span>
      </h2>

      <AosReveal className={styles.row}>
        {directions.map((direction, index) => (
          <div
            key={direction.id}
            data-aos="fade-right"
            data-aos-duration="500"
            data-aos-delay={String(index * 100)}
          >
            <ProgramCard direction={direction} />
          </div>
        ))}
      </AosReveal>
    </section>
  );
}
