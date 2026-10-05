import { campusIntro, campusWindows } from '@/data/campus';
import { getLogo, resolveImage } from '@/lib/images';
import { CampusWindows } from '@/components/ui/CampusWindows';
import styles from './CampusLife.module.css';

/**
 * «Жизнь в лицее».
 *
 * Разметка и оформление повторяют секцию `.campus-section` с newuu.uz/en/:
 * силуэт здания фоном, логотип, заголовок с градиентным окончанием,
 * подпись и карусель «оконец» с арочными рамками. Все числа — в
 * CampusLife.module.css, там же ссылки на исходные правила оригинала.
 */
export function CampusLife() {
  const logo = getLogo();
  const items = campusWindows.map((item) => ({ ...item, photo: resolveImage(item.image) }));

  /*
   * В оригинале лента склеена из двух одинаковых половин, чтобы на широком
   * экране все шесть мест были заняты и карусель оставалась прокручиваемой.
   * Повторяем приём: разделов пять, видно до шести.
   */
  const track = [...items, ...items];

  return (
    <section id="campus-life" aria-label={campusIntro.heading} className={styles.section}>
      <div className={styles.header}>
        {logo ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img className={styles.logo} src={logo} alt="" width={70} height={70} />
        ) : null}

        <h2 className={styles.title}>
          {campusIntro.lead}
          <span>{campusIntro.accent}</span>
        </h2>

        <p className={styles.text}>{campusIntro.text}</p>
      </div>

      <CampusWindows items={track} />
    </section>
  );
}
