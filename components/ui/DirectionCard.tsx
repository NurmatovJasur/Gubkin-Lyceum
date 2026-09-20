import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Direction, ResolvedImage } from '@/types';
import { Media } from '@/components/ui/Media';

type DirectionCardProps = {
  direction: Direction;
  image: ResolvedImage;
  priority?: boolean;
};

/**
 * Крупная карточка направления: фотография, затемнение и раскрытие описания
 * при наведении. На сенсорных экранах описание видно всегда (hover: none),
 * при навигации с клавиатуры — по focus-visible.
 */
export function DirectionCard({ direction, image, priority = false }: DirectionCardProps) {
  return (
    <Link
      href={`/directions/${direction.slug}`}
      aria-label={`Направление «${direction.title}» — подробнее`}
      className="group relative block aspect-[4/5] isolate overflow-hidden bg-black text-white sm:aspect-[3/2] lg:aspect-[4/3]"
    >
      <span className="absolute inset-0 block">
        <Media
          image={image}
          priority={priority}
          sizes="(max-width: 900px) 100vw, 50vw"
          imageClassName="transition-transform duration-700 ease-out-brand group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10 opacity-90 transition-opacity duration-700 ease-brand group-hover:opacity-100"
        />
      </span>

      <span className="absolute inset-x-0 bottom-0 block p-[clamp(20px,2.4vw,42px)]">
        <span className="mb-[10px] block text-label text-white/65">{direction.number}</span>
        <span className="block text-[clamp(22px,2.7vw,40px)] leading-[1.05] font-bold tracking-[0.01em]">
          {direction.titleUpper}
        </span>

        <span className="grid grid-rows-[1fr] opacity-100 transition-[grid-template-rows,opacity] duration-700 ease-out-brand lg:grid-rows-[0fr] lg:opacity-0 lg:group-hover:grid-rows-[1fr] lg:group-hover:opacity-100 lg:group-focus-visible:grid-rows-[1fr] lg:group-focus-visible:opacity-100">
          <span className="block overflow-hidden">
            <span className="block max-w-[34ch] pt-3 text-[clamp(14px,1.05vw,16.5px)] leading-relaxed text-white/85">
              {direction.description}
            </span>
            <span className="mt-4 inline-flex items-center gap-[10px] border-b border-white/50 pb-[5px] text-sm font-bold lg:translate-y-2 lg:transition-transform lg:duration-700 lg:ease-out-brand lg:group-hover:translate-y-0 lg:group-focus-visible:translate-y-0">
              <span>Узнать больше</span>
              <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
            </span>
          </span>
        </span>
      </span>
    </Link>
  );
}
