import type { CSSProperties } from 'react';
import { director } from '@/data/administration';
import { directorWord } from '@/data/content';
import { resolveImage } from '@/lib/images';
import { Media } from '@/components/ui/Media';
import styles from './DirectorWord.module.css';

/**
 * «Слово директора» — вёрстка секции `.president-section` (`.about-mid`)
 * с newuu.uz, наполненная обращением директора лицея.
 *
 * Разметка повторяет оригинал узел в узел: карточка из трёх колонок —
 * портрет, разделитель в три полосы и плашка с цитатой поверх фонового
 * кадра под синей подложкой.
 *
 * Стили и сверка чисел — DirectorWord.module.css. Анимации в оригинале
 * нет (проверено), поэтому её нет и здесь.
 */
export function DirectorWord() {
  const portrait = resolveImage(director.photo);
  const background = resolveImage(directorWord.background);

  return (
    <section className={styles.section} aria-labelledby="director-word-title">
      <div className={styles.card}>
        <div
          className={styles.image}
          style={
            {
              '--local-bg': `url('${portrait.src}')`,
              '--local-ratio': director.photo.ratio
            } as CSSProperties
          }
        >
          <Media
            image={portrait}
            fit="contain"
            sizes="(max-width: 991px) 100vw, (max-width: 1199px) 400px, (max-width: 1400px) 500px, 664px"
            className={styles.imagePicture}
          />
        </div>

        <div className={styles.divider} aria-hidden="true" />

        <div
          className={styles.banner}
          style={{ '--local-image': `url('${background.src}')` } as CSSProperties}
        >
          <h3 id="director-word-title" className={styles.title}>
            {directorWord.title}
          </h3>
          <p className={styles.text}>&laquo;{directorWord.quote}&raquo;</p>
          <h4 className={styles.name}>
            {director.surname} {director.givenNames}
          </h4>
          <h5 className={styles.position}>{director.position}</h5>
        </div>
      </div>
    </section>
  );
}
