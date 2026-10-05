import Link from 'next/link';
import { about } from '@/data/content';
import { aboutCards } from '@/data/statistics';
import { aboutGallery } from '@/data/gallery';
import { resolveImages } from '@/lib/images';
import { AboutPhotoSlider } from '@/components/ui/AboutPhotoSlider';
import { AboutCardIcon, AboutCardBack } from '@/components/sections/AboutIcons';
import { AboutCounters } from '@/components/sections/AboutCounters';
import styles from './About.module.css';

/**
 * «О лицее» — вёрстка секции `.about-section` с newuu.uz/en/,
 * наполненная материалами лицея.
 *
 * Разметка повторяет оригинал узел в узел: три колонки (текст 33.3333% /
 * фотография 29.1667% / плитка счётчиков 37.5%), плитка — вложенный `.row`
 * с градиентной подложкой и белыми перемычками из border + ::after.
 *
 * Отличие одно и оно заказано: вместо единственного статичного снимка в
 * средней колонке стоит карусель (AboutPhotoSlider) — листается руками и
 * сама меняет кадр каждые 5 секунд. Рамка под неё сохраняет геометрию
 * `.about-image` без изменений.
 *
 * Стили — About.module.css, счётчики — AboutCounters (скрипт оригинала).
 */
export function About() {
  const gallery = resolveImages(aboutGallery);

  return (
    <section id="about" className={styles.section}>
      <div className={styles.row}>
        <div className={styles.colInfo}>
          <div className={styles.info}>
            <h2 className={styles.title}>
              О лицее <span>имени И.М. Губкина</span>
            </h2>
            <p className={styles.text}>{about.paragraphs[0]}</p>
            <Link href="/about" className={styles.btn}>
              Подробнее о лицее
              <i className={styles.btnIcon} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className={styles.colImage}>
          <div className={styles.image}>
            <AboutPhotoSlider images={gallery} label="Фотографии лицея" />
          </div>
        </div>

        <AboutCounters className={styles.colCards}>
          <div className={styles.cards}>
            {aboutCards.map((card) => {
              const gradientId = `about-card-${card.id}`;
              return (
                <div key={card.id} className={styles.cardCell}>
                  <div className={styles.card}>
                    <div className={styles.cardIcon}>
                      <AboutCardIcon icon={card.icon} gradientId={gradientId} />
                    </div>
                    {/* Пустой при загрузке — заполняет счётчик, как в оригинале.
                        Неподтверждённая цифра остаётся видимым «[УТОЧНИТЬ]». */}
                    {card.value ? (
                      <span className={styles.cardCount} data-count={card.value}>
                        {card.value}
                      </span>
                    ) : (
                      <span className={styles.cardCount} data-pending="true">
                        [УТОЧНИТЬ]
                      </span>
                    )}
                    <h3 className={styles.cardTitle}>{card.label}</h3>
                    <div className={styles.cardBack}>
                      <AboutCardBack icon={card.icon} gradientId={gradientId} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </AboutCounters>
      </div>
    </section>
  );
}
