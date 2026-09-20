import Link from 'next/link';
import type { NewsArticle, ResolvedImage } from '@/types';
import { formatDate } from '@/data/news';
import { Media } from '@/components/ui/Media';
import { cn } from '@/lib/utils';

type NewsCardProps = {
  article: NewsArticle;
  image: ResolvedImage;
  /** feature — крупная карточка на главной. */
  variant?: 'default' | 'feature';
  sizes?: string;
  priority?: boolean;
};

/** Карточка новости. Ведёт на страницу материала /news/[slug]. */
export function NewsCard({
  article,
  image,
  variant = 'default',
  sizes = '(max-width: 900px) 100vw, 30vw',
  priority = false
}: NewsCardProps) {
  const feature = variant === 'feature';

  return (
    <article className="group">
      <Link href={`/news/${article.slug}`} className="block">
        <div
          className={cn(
            'relative mb-4 overflow-hidden bg-cloud',
            feature ? 'aspect-16/10' : 'aspect-4/3'
          )}
        >
          <Media
            image={image}
            sizes={sizes}
            priority={priority}
            imageClassName="transition-transform duration-700 ease-out-brand group-hover:scale-[1.03]"
          />
        </div>

        <p className="mb-3 flex items-center gap-[10px] text-label text-subtle uppercase">
          <span className={cn(!article.date && 'text-subtle')}>{formatDate(article.date)}</span>
          <span aria-hidden="true" className="size-[3px] rounded-full bg-line-strong" />
          <span className="text-blue">{article.category}</span>
        </p>

        <h3
          className={cn(
            'mb-2.5 font-bold tracking-[-0.02em] transition-colors duration-200 ease-brand group-hover:text-blue',
            feature
              ? 'max-w-[20ch] text-[clamp(23px,2.5vw,36px)] leading-[1.14]'
              : 'text-[clamp(18px,1.5vw,23px)] leading-[1.24]'
          )}
        >
          {article.title}
        </h3>

        <p className="max-w-[48ch] text-[15px] leading-relaxed text-muted">{article.excerpt}</p>
      </Link>
    </article>
  );
}
