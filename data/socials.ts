import { site } from '@/site.config';

/**
 * Соцсети лицея — данные секции, склонированной с newuu.uz
 * (`footer > .footer-top` на главной).
 *
 * В оригинале пять сетей: Instagram, Telegram, Facebook, YouTube, Linkedin.
 * Здесь по условию задачи оставлены только Instagram и Telegram — порядок
 * тот же, что в оригинальной разметке.
 *
 * Ссылки берутся из site.config. Instagram там пока `null`
 * (PLACEHOLDER — официальная страница не подтверждена), поэтому плитка
 * рисуется без `href`: вид и курсор те же, но клик ничего не делает —
 * тот же приём, что в секции «Партнёры».
 *
 * `mockup` — скриншот телефона, который виден только на ширинах > 1199px.
 * Сейчас это кадры с оригинала, то есть плейсхолдеры: на них аккаунты
 * New Uzbekistan University. Их нужно заменить на скриншоты страниц лицея —
 * размер исходников 908×1856.
 */
export type SocialNetwork = {
  id: 'instagram' | 'telegram';
  /** Подпись на кнопке. */
  label: string;
  /** `null` → ссылка не подтверждена, плитка рисуется без href. */
  href: string | null;
  /** Скриншот телефона 908×1856 в /public/images/socials. */
  mockup: string;
};

export const socialNetworks: SocialNetwork[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    href: site.contacts.instagram?.href ?? null,
    mockup: '/images/socials/mockup-instagram.png'
  },
  {
    id: 'telegram',
    label: 'Telegram',
    href: site.contacts.telegram?.href ?? null,
    mockup: '/images/socials/mockup-telegram.png'
  }
];
