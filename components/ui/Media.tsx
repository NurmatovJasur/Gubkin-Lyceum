import Image from 'next/image';
import type { ResolvedImage } from '@/types';
import { cn } from '@/lib/utils';

type MediaProps = {
  image: ResolvedImage;
  /** Значение атрибута sizes — обязательно для корректной раздачи next/image. */
  sizes: string;
  /** Hero и первый экран: грузим сразу, без lazy loading. */
  priority?: boolean;
  quality?: number;
  className?: string;
  /** Дополнительные классы для самого <img>. */
  imageClassName?: string;
};

/**
 * Фотография сайта.
 *
 * Настоящие снимки выводятся через next/image (AVIF/WebP, responsive srcset,
 * lazy loading ниже первого экрана). Пока файла нет — вместо картинки
 * рисуется нейтральная заглушка с подписью, какой кадр нужен: стоковые
 * и сгенерированные изображения на сайте не используются.
 *
 * Компонент не обращается к файловой системе и поэтому одинаково работает
 * и в Server, и в Client Components.
 */
export function Media({
  image,
  sizes,
  priority = false,
  quality = 82,
  className,
  imageClassName
}: MediaProps) {
  if (image.isPlaceholder) {
    return <MediaPlaceholder image={image} className={className} />;
  }

  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      quality={quality}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      className={cn('object-cover object-center', className, imageClassName)}
    />
  );
}

/**
 * Заглушка вместо фотографии. Сразу показывает, какой файл нужно положить
 * в `public/images/` — чтобы администрация видела это прямо на сайте.
 */
function MediaPlaceholder({ image, className }: { image: ResolvedImage; className?: string }) {
  return (
    <div
      role="img"
      aria-label={image.alt}
      className={cn(
        'absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#1c1c1c] p-6 text-center',
        className
      )}
    >
      <span className="text-[10px] tracking-[0.24em] text-[#5a5a5a] uppercase">
        Фотография лицея
      </span>
      <span className="max-w-[34ch] text-[13px] leading-snug text-[#7a7a7a] sm:text-[15px]">
        {image.note}
      </span>
      <span className="text-[11px] text-[#4f4f4f]">public/images/{image.file}</span>
    </div>
  );
}
