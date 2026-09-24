/**
 * Типы контента сайта.
 *
 * Данные лежат в `data/` и полностью типизированы: любое поле, которое
 * ещё не подтверждено администрацией лицея, имеет тип `null` или содержит
 * видимый placeholder — выдуманные факты в код не попадают.
 */

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

/** Звание для группировки на /teachers — от высшего к младшему, плюс специалисты лицея. */
export type TeacherRank = 'professor' | 'chief' | 'leading' | 'senior' | 'teacher' | 'staff';

export type Teacher = {
  id: string;
  name: string;
  subject: string;
  /** Полная должность — как на карточке, выводится в TeacherModal. */
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
  photo: SiteImage;
};

/** Уровень в структуре администрации: сверху вниз по должностям. */
export type AdminLevel = {
  id: string;
  number: string;
  title: string;
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
};
