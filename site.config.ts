import type { Contact } from '@/types';

/**
 * Единый источник правды по контактам, SEO и общим настройкам сайта.
 *
 * ВАЖНО: значения, помеченные PLACEHOLDER, должны быть подтверждены
 * администрацией лицея перед публикацией. Не заменять их на выдуманные данные.
 */

const contacts: Contact = {
  addressLines: ['Бектемирский район,', 'м-в Водник, 84'],
  addressFull: 'Ташкент, Бектемирский район, м-в Водник, 84',
  city: 'Ташкент, Узбекистан',
  phone: '+998 (71) 295-77-31',
  phoneHref: 'tel:+998712957731',

  /** PLACEHOLDER — уточнить официальный Telegram лицея. */
  telegram: null,

  /** PLACEHOLDER — уточнить официальный e-mail лицея. */
  email: null,

  /**
   * Карта. Точные координаты не подтверждены — используется поиск по адресу.
   * [ТРЕБУЕТСЯ УТОЧНЕНИЕ] точных координат для более точной метки.
   */
  mapQuery:
    'Академический лицей имени И.М. Губкина, Бектемирский район, Водник 84, Ташкент'
};

/** PLACEHOLDER — заменить на подтверждённый домен лицея. */
const FALLBACK_ORIGIN = 'https://example.uz';

/**
 * Канонический домен. Задаётся переменной окружения NEXT_PUBLIC_SITE_URL
 * (см. .env.example).
 *
 * Оператор `??` здесь не подходит: на хостинге переменная может быть
 * объявлена, но пустой, и тогда `new URL('')` роняет сборку с ERR_INVALID_URL.
 * Поэтому пустая строка считается «не задано».
 */
function resolveOrigin(): string {
  const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '');

  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return stripTrailingSlash(fromEnv);

  // Preview-деплои на Vercel: домен известен только во время сборки.
  const fromVercel = (
    process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL
  )?.trim();
  if (fromVercel) {
    return stripTrailingSlash(`https://${fromVercel.replace(/^https?:\/\//, '')}`);
  }

  return FALLBACK_ORIGIN;
}

export const site = {
  origin: resolveOrigin(),

  name: 'Академический лицей имени И.М. Губкина',
  fullName:
    'Академический лицей при филиале РГУ нефти и газа имени И.М. Губкина в Ташкенте',
  nameLines: ['Академический лицей', 'имени И.М. Губкина'] as const,

  seo: {
    title: 'Академический лицей имени И.М. Губкина в Ташкенте',
    description:
      'Академический лицей при филиале РГУ нефти и газа имени И.М. Губкина в Ташкенте. Направления обучения, поступление, преподаватели, новости и контакты.',
    locale: 'ru_RU'
  },

  contacts,

  /** Год в подвале. */
  copyrightYear: 2026
} as const;

/** Ссылка на карту в новой вкладке. */
export const mapLink = () =>
  `https://yandex.uz/maps/?text=${encodeURIComponent(site.contacts.mapQuery)}`;

/** Встраиваемая карта — подгружается только по клику пользователя. */
export const mapEmbed = () =>
  `https://yandex.uz/map-widget/v1/?text=${encodeURIComponent(site.contacts.mapQuery)}&z=16`;
