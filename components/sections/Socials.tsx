import { socialNetworks } from '@/data/socials';
import { socialsIntro } from '@/data/content';
import styles from './Socials.module.css';

/**
 * «Подписывайтесь на наши страницы в социальных сетях» — вёрстка секции
 * `footer > .footer-top` с newuu.uz/, наполненная соцсетями лицея.
 *
 * Разметка повторяет оригинал узел в узел:
 *
 *   .footer-top > .container > .row
 *     ├── .col > .footer-info > h2.footer-title + p.footer-text
 *     └── .col > .footer-mockups > a.footer-mockup × N
 *                 └── img + span.footer-mockup__social.button > i + подпись
 *
 * Числа, брейкпоинты и источник каждого правила — в Socials.module.css.
 *
 * Движения в секции нет: `data-aos` на ней в оригинале отсутствует, hover
 * у кнопки ничего не меняет (см. комментарий к `.social`). Поэтому компонент
 * серверный — ни состояния, ни эффектов здесь не нужно.
 *
 * Телефоны видны только шире 1199px; ниже остаются одни кнопки.
 */

/** Классы иконок icomoon — соответствуют `.icon-instagram-1` / `.icon-telegram-1`. */
const ICON_CLASS = {
  instagram: styles.iconInstagram,
  telegram: styles.iconTelegram
} as const;

export function Socials() {
  return (
    <section id="socials" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={`${styles.col} ${styles.colInfo}`}>
            <div className={styles.info}>
              <h2 className={styles.title}>
                {socialsIntro.headingLine1} <br /> {socialsIntro.headingLine2}{' '}
                <span>{socialsIntro.headingAccent}</span>
              </h2>
              <p className={styles.text}>{socialsIntro.text}</p>
            </div>
          </div>

          <div className={`${styles.col} ${styles.colMockups}`}>
            <div className={styles.mockups}>
              {socialNetworks.map((network) => {
                /*
                 * Ссылка без `href`, когда страница ещё не подтверждена
                 * (Instagram в site.config — PLACEHOLDER). Вид и курсор те же,
                 * клик ничего не делает — тот же приём, что в «Партнёрах».
                 */
                const linkProps = network.href
                  ? { href: network.href, target: '_blank', rel: 'noopener noreferrer' }
                  : {};

                return (
                  <a key={network.id} className={styles.mockup} {...linkProps}>
                    {/* Скриншот телефона декоративный — подпись несёт кнопка. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={network.mockup} alt="" loading="lazy" decoding="async" />
                    <span className={styles.social}>
                      <i
                        aria-hidden="true"
                        className={`${styles.icon} ${ICON_CLASS[network.id]}`}
                      />
                      {network.label}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
