import type { NavItem } from '@/types';

/** Главная навигация — реальные маршруты (next/link). */
export const mainNav: NavItem[] = [
  { id: 'about', label: 'О лицее', href: '/about' },
  { id: 'directions', label: 'Направления', href: '/directions' },
  { id: 'teachers', label: 'Преподаватели', href: '/teachers' },
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
