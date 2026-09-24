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
  data: Pick<NewsArticle, 'category'> &
    Partial<Pick<NewsArticle, 'date' | 'title' | 'excerpt'>> & { featured?: boolean; alt?: string }
): NewsArticle => ({
  id: `news-${index}`,
  slug: `news-${String(index).padStart(2, '0')}`,
  category: data.category,
  featured: data.featured,
  // date: null → на сайте выводится «[ДАТА]»
  date: data.date ?? null,
  title: data.title ?? '[ЗАГОЛОВОК НОВОСТИ]',
  excerpt:
    data.excerpt ?? '[ТРЕБУЕТСЯ УТОЧНЕНИЕ] — краткое описание события в 2–3 строки.',
  body: [],
  image: {
    file: `news-${String(index).padStart(2, '0')}.jpg`,
    alt: data.alt ?? 'Событие академического лицея имени И.М. Губкина',
    note: `Фотография к новости №${index}`,
    ratio: data.featured ? '16/9' : '4/3'
  }
});

// [ЗАМЕНИТЬ НА ФАКТИЧЕСКИЕ ДАННЫЕ]
export const news: NewsArticle[] = [
  article(1, {
    category: 'Международное сотрудничество',
    featured: true,
    date: '2025-07-28',
    title: 'Культурно-образовательный лагерь с технической старшей школой KUMOH',
    excerpt:
      'Лицеисты и учащиеся технической старшей школы «KUMOH» (Республика Корея) приняли участие в совместном культурно-образовательном лагере.',
    alt: 'Лицеисты и корейские школьники KUMOH с баннером лагеря в холле лицея'
  }),
  article(2, {
    category: 'Экскурсии',
    title: 'Знакомство с Бухарским нефтеперерабатывающим заводом',
    excerpt:
      'Учащиеся лицея посетили Бухарский НПЗ АО «Узбекнефтегаз» и познакомились с работой предприятия.',
    alt: 'Лицеисты в спецодежде и касках на территории Бухарского НПЗ'
  }),
  article(3, {
    category: 'Проекты',
    title: 'Научное исследование с международным центром PLUSSED',
    excerpt:
      'Совместная исследовательская работа учащихся с центром инновационного и проектного образования Южной Кореи PLUSSED, VALOR School, Riverdale Country School и Columbia University — Teachers College.',
    alt: 'Участники совместного исследовательского проекта с PLUSSED'
  }),
  article(4, {
    category: 'Экскурсии',
    title: 'Экскурсия в Центральный аппарат АО «Узбекнефтегаз»',
    excerpt:
      'Учащиеся лицея побывали в Центральном аппарате АО «Узбекнефтегаз» и познакомились с работой компании.',
    alt: 'Лицеисты в диспетчерском центре АО «Узбекнефтегаз»'
  }),
  article(5, {
    category: 'Международное сотрудничество',
    title: 'Визит профессоров Seoul National University of Science & Technology',
    excerpt:
      'Лицей посетили профессора С.Е. Ким, Ч.Х. Рханг и Ж.Х. Сух из Seoul National University of Science & Technology (Южная Корея).',
    alt: 'Профессора из Южной Кореи у портрета академика И.М. Губкина в лицее'
  }),
  article(6, {
    category: 'Встречи',
    title: 'Встреча с академиком Бобомуротом Ахмедовым',
    excerpt:
      'Перед лицеистами выступил Ахмедов Бобомурот Жураевич — академик Академии наук Республики Узбекистан и Всемирной академии наук.',
    alt: 'Академик Б.Ж. Ахмедов выступает перед лицеистами'
  })
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
