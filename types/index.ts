/**
 * Типы контента сайта.
 *
 * Данные лежат в `data/` и полностью типизированы: любое поле, которое
 * ещё не подтверждено администрацией лицея, имеет тип `null` или содержит
 * видимый placeholder — выдуманные факты в код не попадают.
 */

import type { ComponentType, ReactNode, Ref } from 'react';

/**
 * Тег-обёртка для компонентов со свойством `as` (Container, Section, Reveal).
 *
 * Снаружи такие компоненты по-прежнему принимают обычный `React.ElementType`
 * («любой тег или компонент»), а внутри тег приводится к этому типу.
 * Причина: @react-three/fiber (3D-галерея на странице «О лицее») дописывает
 * в глобальный JSX свои элементы — `mesh`, `planeGeometry` и ещё сотни
 * других. После этого `ElementType` означает «в том числе и они», и общий
 * для всех вариантов тип пропа `className` схлопывается в `never` —
 * TypeScript перестаёт принимать `<Tag className=…>`. Здесь перечислено
 * ровно то, что такие обёртки на тег действительно ставят.
 */
export type PolymorphicTag<E extends HTMLElement = HTMLElement> = ComponentType<{
  children?: ReactNode;
  className?: string;
  id?: string;
  ref?: Ref<E>;
  'aria-label'?: string;
  'data-reveal'?: boolean;
}>;

/** Соотношение сторон фотографии — используется и для placeholder'а. */
export type AspectRatio = '16/9' | '16/10' | '21/9' | '4/3' | '4/5' | '3/4' | '1/1';

/** Описание фотографии в данных: файл + альт + подсказка для съёмки. */
export type SiteImage = {
  /** Имя файла в `public/images/` (например `hero.jpg`). */
  file: string;
  /** Альтернативный текст: доступность и SEO. */
  alt: string;
  /** Что именно нужно снять — печатается на заглушке. */
  note: string;
  ratio: AspectRatio;
};

/** Фотография, готовая к выводу: путь разрешён, известно, заглушка это или нет. */
export type ResolvedImage = SiteImage & {
  src: string;
  /** true → настоящего файла ещё нет, показывается сгенерированная заглушка. */
  isPlaceholder: boolean;
};

export type Direction = {
  id: string;
  slug: string;
  /** Порядковый номер для editorial-нумерации: «01», «02»… */
  number: string;
  title: string;
  titleUpper: string;
  /** Короткое описание для карточки. */
  description: string;
  intro: string;
  image: SiteImage;
  hero: SiteImage;
  study: string[];
  subjects: string[];
  skills: string[];
  activities: string[];
  next: string[];
};

/** Звание для группировки на /teachers — от высшего к младшему. */
export type TeacherRank = 'professor' | 'chief' | 'senior' | 'leading';

export type Teacher = {
  id: string;
  /** Адрес персональной страницы: /teachers/<slug>. */
  slug: string;
  name: string;
  subject: string;
  /** Полная должность — как на печатной карточке лицея. */
  role: string;
  rank: TeacherRank;
  bio: string | null;
  photo: SiteImage;
};

/** Сотрудник администрации лицея. */
export type AdminMember = {
  id: string;
  /** Фамилия — первой строкой в карточке. */
  surname: string;
  /** Имя и отчество. */
  givenNames: string;
  position: string;
  /** Учёная степень, если есть. */
  degree: string | null;
  /** Номер кабинета или null, если не указан. */
  cabinet: string | null;
  /**
   * Круг вопросов, с которыми обращаются к сотруднику: 2–4 коротких
   * пункта для карточки и справочника кабинетов.
   */
  scope: string[];
  photo: SiteImage;
};

/** Уровень в структуре администрации: сверху вниз по должностям. */
export type AdminLevel = {
  id: string;
  number: string;
  title: string;
  /** Одна строка под заголовком уровня — что это за звено структуры. */
  caption?: string;
  members: AdminMember[];
};

export type NewsArticle = {
  id: string;
  slug: string;
  category: string;
  /** ISO-дата (YYYY-MM-DD) или null, если дата не подтверждена. */
  date: string | null;
  title: string;
  excerpt: string;
  /** Абзацы полного текста новости. */
  body: string[];
  image: SiteImage;
  featured?: boolean;
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export type Contact = {
  addressLines: string[];
  addressFull: string;
  city: string;
  phone: string;
  phoneHref: string;
  telegram: { label: string; href: string } | null;
  /** null → официальная страница не подтверждена, иконка не выводится. */
  instagram: { label: string; href: string } | null;
  email: string | null;
  mapQuery: string;
};

export type Statistic = {
  id: string;
  /** null → цифра не подтверждена администрацией, выводится «[УТОЧНИТЬ]». */
  value: string | null;
  label: string;
};

export type Advantage = {
  number: string;
  title: string;
  lead: string;
  text: string;
};

export type NavItem = {
  id: string;
  label: string;
  href: string;
  /**
   * Вложенные разделы выпадающего списка в шапке.
   * Пункт с таким списком раскрывается по наведению и с клавиатуры,
   * а своя страница пункта идёт первой строкой списка.
   */
  children?: NavItem[];
};

/**
 * «Оконце» в секции «Жизнь в лицее»: фотография в арке + подпись.
 *
 * `href: null` — отдельной страницы по теме на сайте пока нет, карточка
 * выводится без ссылки (выдуманные маршруты не создаём).
 */
export type CampusWindow = {
  id: string;
  title: string;
  href: string | null;
  image: SiteImage;
};
