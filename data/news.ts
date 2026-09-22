import type { NewsArticle } from '@/types';

/**
 * Новости и события.
 *
 * СЕЙЧАС ЗДЕСЬ PLACEHOLDER-ЗАПИСИ. Заголовки, даты и тексты новостей
 * не выдумываются.  Категории соответствуют реальным рубрикам жизни лицея.
 *
 * Как заполнить: заменить title / excerpt / body / date на реальные,
 * положить изображение в public/images/ под именем из image.file.
 */
const article = (
  index: number,
  data: Pick<NewsArticle, 'category'> & { featured?: boolean }
): NewsArticle => ({
  id: `news-${index}`,
  slug: `news-${String(index).padStart(2, '0')}`,
  category: data.category,
  featured: data.featured,
  // date: null → на сайте выводится «[ДАТА]»
  date: null,
  title: '[ЗАГОЛОВОК НОВОСТИ]',
  excerpt: '[ТРЕБУЕТСЯ УТОЧНЕНИЕ] — краткое описание события в 2–3 строки.',
  body: [
    '[ТРЕБУЕТСЯ УТОЧНЕНИЕ] — полный текст новости предоставляется администрацией лицея.',
    'До публикации материал остаётся заготовкой: факты, даты, имена и результаты не выдумываются.'
  ],
  image: {
    file: `news-${String(index).padStart(2, '0')}.jpg`,
    alt: 'Событие академического лицея имени И.М. Губкина',
    note: `Фотография к новости №${index}`,
    ratio: data.featured ? '16/9' : '4/3'
  }
});

/**
 * Гости и партнёры лицея.
 *
 * Имена, должности и фотографии — реальные (предоставлены лицеем).
 * Подробный текст о каждом визите не выдумывается: до уточнения у
 * администрации выводится тот же плейсхолдер, что и в остальных новостях.
 */
const guestArticle = (
  index: number,
  data: { names: string; role: string }
): NewsArticle => ({
  id: `news-guest-${index}`,
  slug: `news-guest-${String(index).padStart(2, '0')}`,
  category: 'Гости',
  date: null,
  title: `Встреча с ${data.names}`,
  excerpt: `${data.names} — ${data.role}. [ТРЕБУЕТСЯ УТОЧНЕНИЕ] — подробности визита предоставляются администрацией лицея.`,
  body: [
    `${data.names} — ${data.role}.`,
    '[ТРЕБУЕТСЯ УТОЧНЕНИЕ] — полный текст о визите предоставляется администрацией лицея.'
  ],
  image: {
    file: `guest-${String(index).padStart(2, '0')}.jpg`,
    alt: `${data.names} — ${data.role}`,
    note: `Фотография визита №${index}`,
    ratio: '4/3'
  }
});

const guests: NewsArticle[] = [
  guestArticle(1, {
    names: 'Верой Чурсиной',
    role: 'член Международного Союза дизайнеров, профессор дизайна одежды'
  }),
  guestArticle(2, {
    names: 'С.Е. Ким, Ч.Х. Рханг и Ж.Х. Сух',
    role: 'профессора университета Seoul National University of Science & Technology (Южная Корея)'
  }),
  guestArticle(3, {
    names: 'Борием Алихановым и Ольгой Литвиновой',
    role: 'депутаты Законодательной палаты Олий Мажлиса Республики Узбекистан'
  }),
  guestArticle(4, {
    names: 'Мариной Пальмтаг',
    role: 'директор подготовительных курсов Управления по обеспечению приёмной кампании Финансового университета при правительстве РФ'
  }),
  guestArticle(5, {
    names: 'Степаном Быковым и Анной Мелентьевой',
    role: 'победитель окружного финала конкурса «Лидеры России»; руководитель дирекции международной деятельности ИРНИТУ'
  }),
  guestArticle(6, {
    names: 'академиком Бобомуротом Ахмедовым',
    role: 'академик Академии наук Республики Узбекистан, академик Всемирной академии наук'
  }),
  guestArticle(7, {
    names: 'профессором Anthony Kim',
    role: 'профессор Kyungbuk College (Республика Корея)'
  }),
  guestArticle(8, {
    names: 'Павлом Пазушкиным',
    role: 'директор Ульяновского государственного технического университета РФ'
  }),
  guestArticle(9, {
    names: 'хакимом Бектемирского района Нуриллой Абдурахмановым',
    role: 'хаким Бектемирского района'
  })
];

/**
 * Мероприятия, лагеря и экскурсии учащихся.
 *
 * Заголовки — те же формулировки, что и на исходных материалах лицея;
 * подробный текст не выдумывается.
 */
const eventArticle = (index: number, title: string): NewsArticle => ({
  id: `news-event-${index}`,
  slug: `news-event-${String(index).padStart(2, '0')}`,
  category: 'Мероприятия',
  date: null,
  title,
  excerpt: `${title}. [ТРЕБУЕТСЯ УТОЧНЕНИЕ] — подробности предоставляются администрацией лицея.`,
  body: [
    `${title}.`,
    '[ТРЕБУЕТСЯ УТОЧНЕНИЕ] — полный текст новости предоставляется администрацией лицея.'
  ],
  image: {
    file: `event-${String(index).padStart(2, '0')}.jpg`,
    alt: title,
    note: `Фотография к мероприятию №${index}`,
    ratio: '4/3'
  }
});

const events: NewsArticle[] = [
  eventArticle(
    1,
    'Научное исследование учащихся с международным центром инновационного и проектного образования Южной Кореи PLUSSED, Valor School, Riverdale Country School, Columbia University Teachers College'
  ),
  eventArticle(2, 'Культурно-образовательный лагерь с технической старшей школой «KUMON» (Республика Корея)'),
  eventArticle(3, 'АО «Узбекнефтегаз»: знакомство с Бухарским нефтеперерабатывающим заводом'),
  eventArticle(4, 'АО «Узбекнефтегаз»: знакомство с заводами ООО «Шуртан ГКМ» и ООО «Uzbekistan GTL»'),
  eventArticle(5, 'АО «Узбекнефтегаз»: экскурсия в центральный аппарат')
];

// [ЗАМЕНИТЬ НА ФАКТИЧЕСКИЕ ДАННЫЕ]
export const news: NewsArticle[] = [
  article(1, { category: 'Олимпиады', featured: true }),
  article(2, { category: 'Мероприятия' }),
  article(3, { category: 'Проекты' }),
  article(4, { category: 'Конкурсы' }),
  article(5, { category: 'Новости' }),
  article(6, { category: 'Олимпиады' }),
  ...guests,
  ...events
];

/** Три материала для главной: один крупный + два обычных. */
export const featuredNews = news.slice(0, 3);

export const getArticle = (slug: string): NewsArticle | undefined =>
  news.find((item) => item.slug === slug);

/** Дата для вывода: если не подтверждена — видимый placeholder. */
export const formatDate = (date: string | null): string => {
  if (!date) return '[ДАТА]';
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(date));
};
