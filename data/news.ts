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

// [ЗАМЕНИТЬ НА ФАКТИЧЕСКИЕ ДАННЫЕ]
export const news: NewsArticle[] = [
  article(1, { category: 'Олимпиады', featured: true }),
  article(2, { category: 'Мероприятия' }),
  article(3, { category: 'Проекты' }),
  article(4, { category: 'Конкурсы' }),
  article(5, { category: 'Новости' }),
  article(6, { category: 'Олимпиады' })
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
