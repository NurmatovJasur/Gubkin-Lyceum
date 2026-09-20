import type { MetadataRoute } from 'next';
import { site } from '@/site.config';
import { directions } from '@/data/directions';
import { news } from '@/data/news';

/** Карта сайта: статические маршруты + страницы направлений и новостей. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    { path: '/', priority: 1 },
    { path: '/about', priority: 0.8 },
    { path: '/directions', priority: 0.9 },
    { path: '/admission', priority: 0.9 },
    { path: '/teachers', priority: 0.7 },
    { path: '/news', priority: 0.7 },
    { path: '/contacts', priority: 0.7 },
    { path: '/privacy', priority: 0.2 }
  ];

  return [
    ...routes.map((route) => ({
      url: `${site.origin}${route.path}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: route.priority
    })),
    ...directions.map((direction) => ({
      url: `${site.origin}/directions/${direction.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8
    })),
    ...news.map((article) => ({
      url: `${site.origin}/news/${article.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.5
    }))
  ];
}
