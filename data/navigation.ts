import { site } from '@/site.config';
import type { NavItem } from '@/types';

/**
 * Главная навигация — реальные маршруты (next/link).
 *
 * Страницы о самом лицее собраны в один выпадающий пункт: так слева от
 * центрального знака остаётся пять коротких ссылок вместо семи длинных,
 * и шапка не расползается на ширине 1180–1440px. Ни один маршрут при
 * этом не потерян — на мобильной панели список разворачивается обратно
 * в плоский перечень.
 */
export const mainNav: NavItem[] = [
  {
    id: 'about',
    label: 'О лицее',
    href: '/about',
    children: [
      { id: 'about-overview', label: 'О лицее', href: '/about' },
      { id: 'administration', label: 'Администрация', href: '/administration' },
      { id: 'teachers', label: 'Преподаватели', href: '/teachers' }
    ]
  },
  { id: 'directions', label: 'Направления', href: '/directions' },
  { id: 'admission', label: 'Поступление', href: '/admission' },
  { id: 'news', label: 'Новости', href: '/news' },
  { id: 'contacts', label: 'Контакты', href: '/contacts' }
];

/** Колонки подвала. */
export const footerNav = [
  {
    title: 'Лицей',
    links: [
      { label: 'О лицее', href: '/about' },
      { label: 'Администрация', href: '/administration' },
      { label: 'Направления', href: '/directions' },
      { label: 'Преподаватели', href: '/teachers' },
      { label: 'Новости', href: '/news' }
    ]
  },
  {
    title: 'Поступление',
    links: [
      { label: 'Как поступить', href: '/admission' },
      { label: 'Документы', href: '/admission#faq' },
      { label: 'Частые вопросы', href: '/admission#faq' }
    ]
  }
];

/** Иконки соцсетей в шапке: только подтверждённые ссылки из site.config. */
export type SocialId = 'telegram' | 'instagram';

export type SocialLink = {
  id: SocialId;
  /** Подпись для screen reader и атрибута title. */
  label: string;
  href: string;
};

/**
 * Соцсети лицея. Ссылка, которой ещё нет в site.config (null), просто не
 * попадает в список — выдуманные адреса в разметку не уходят.
 */
export const socialLinks: SocialLink[] = [
  site.contacts.telegram && {
    id: 'telegram' as const,
    label: `Telegram — ${site.contacts.telegram.label}`,
    href: site.contacts.telegram.href
  },
  site.contacts.instagram && {
    id: 'instagram' as const,
    label: `Instagram — ${site.contacts.instagram.label}`,
    href: site.contacts.instagram.href
  }
].filter((link): link is SocialLink => link !== null);

/**
 * Языки интерфейса.
 *
 * ВАЖНО: пока это только переключатель в шапке — переводов на сайте нет,
 * выбор запоминается на время сессии и ничего не меняет. Когда появятся
 * локали (next-intl / app-роуты `/[locale]`), сюда добавятся href'ы, а
 * `LangSwitcher` начнёт переключать маршрут.
 */
export type Language = {
  code: 'ru' | 'uz' | 'en';
  /** Короткий код в кнопке: RU, UZ, ENG. */
  short: string;
  label: string;
};

export const languages: Language[] = [
  { code: 'ru', short: 'RU', label: 'Русский' },
  { code: 'uz', short: 'UZ', label: 'Oʻzbekcha' },
  { code: 'en', short: 'ENG', label: 'English' }
];
