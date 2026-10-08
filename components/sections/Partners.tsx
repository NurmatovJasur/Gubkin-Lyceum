import { partnerLogos } from '@/data/partners';
import { partnersIntro } from '@/data/content';
import { AosReveal } from '@/components/animations/AosReveal';
import styles from './Partners.module.css';

/**
 * «Партнёры лицея» — вёрстка секции `section.partners-section` с newuu.uz/.
 *
 * Разметка повторяет оригинал узел в узел, минус вкладки: заголовок с
 * градиентным вторым словом, затем `div.row` с колонками
 * `col-lg-2 col-md-3 col-sm-4 col-6`, внутри каждой — плитка `a.partners-item`
 * с логотипом. Вкладок (`ul.nav.tab` и `div.tab-content` с панелями
 * `tab-pane.fade`) здесь нет — логотипы идут одним списком.
 *
 * Стили — Partners.module.css (там же перечислены источники всех чисел).
 *
 * Появление при прокрутке — AOS-поведение оригинала, снятое с живой страницы:
 * на каждой плитке `data-aos="flip-right"` и `data-aos-duration="500"`, а
 * задержки идут цепочкой с шагом 200мс. То есть плитки не появляются разом, а
 * разворачиваются слева направо: каждая поворачивается с `rotateY(100deg)`
 * в `0` за 500мс, следующая стартует на 200мс позже. При шести логотипах
 * цепочка идёт 0…1000мс, вся секция доигрывает к 1500мс.
 *
 * Цепочка считается по строкам сетки: на каждой строке она начинается заново,
 * когда эта строка доезжает до порога. Поэтому логотипы можно добавлять
 * сколько угодно — вторая и третья строки отыграют так же, как первая.
 * В оригинале счётчик задержек сквозной по всему списку, из-за чего во второй
 * строке задержки уже в несколько секунд, а всё, что больше 3000мс, aos.css
 * не обрабатывает вовсе и такие плитки вылетают без задержки разом.
 *
 * Воспроизведено на GSAP ScrollTrigger — components/animations/AosReveal.tsx;
 * там же повторены момент старта (верх плитки на 120px выше низа вьюпорта),
 * easing `ease`, `once: false` (при прокрутке назад плитки сворачиваются
 * обратно) и отключение анимации при ширине окна меньше 767px.
 */

/** Шаг цепочки: `data-aos-delay` в оригинале растёт на 200мс на каждой плитке. */
const REVEAL_STAGGER_MS = 200;

/** `data-aos-duration` оригинала. */
const REVEAL_DURATION_MS = 500;

export function Partners() {
  return (
    <section id="partners" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          {partnersIntro.heading} <span>{partnersIntro.headingAccent}</span>
        </h2>

        <AosReveal className={styles.row}>
          {partnerLogos.map((src) => (
            <div key={src} className={styles.col}>
              {/* В оригинале это `<a href="">` с `alt=""` — логотип
                  декоративный, ссылка ведёт на текущую страницу.
                  Здесь ссылка без href: вид тот же, клик ничего не делает. */}
              <a
                className={styles.item}
                data-aos="flip-right"
                data-aos-duration={REVEAL_DURATION_MS}
                data-aos-delay-step={REVEAL_STAGGER_MS}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" decoding="async" />
              </a>
            </div>
          ))}
        </AosReveal>
      </div>
    </section>
  );
}
