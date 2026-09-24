import type { ReactNode } from 'react';
import type { ResolvedImage } from '@/types';
import { Media } from '@/components/ui/Media';
import { cn } from '@/lib/utils';

type ParallaxSectionProps = {
  image: ResolvedImage;
  /** Сила затемнения у нижнего края: 0.4–0.6. */
  overlay?: number;
  /** Первая такая секция на странице — фото грузится сразу. */
  eager?: boolean;
  className?: string;
  children?: ReactNode;
};

/**
 * Секция с «фиксированным» фоном, как обложка Tilda в режиме Fixed.
 *
 * Фото стоит неподвижно относительно окна, а секция прокручивается поверх
 * него, как окно. Никаких transform и JS: фон — `position: fixed`, а
 * `clip-path: inset(0)` у секции обрезает его её границами. Голый
 * `background-attachment: fixed` не используется — в iOS Safari он не работает.
 *
 * Фиксированный слой высотой `100lvh` (большой вьюпорт), а не `inset: 0`:
 * на телефоне высота окна меняется, когда прячется панель адреса, и фон
 * пересчитывал бы размер и дёргался. У предков секции не должно быть
 * transform/filter — иначе `fixed` станет относительным им.
 */
export function ParallaxSection({
  image,
  overlay = 0.5,
  eager = false,
  className,
  children
}: ParallaxSectionProps) {
  return (
    <section
      className={cn(
        'relative flex min-h-svh items-center justify-center overflow-hidden [clip-path:inset(0)]',
        className
      )}
    >
      <div className="fixed inset-x-0 top-0 h-lvh will-change-transform">
        <Media image={image} sizes="100vw" quality={80} priority={eager} />
      </div>

      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,${overlay}) 100%)` }}
      />

      {children ? (
        <div className="relative z-1 max-w-[760px] px-5 text-center text-[19px] leading-[1.55] font-light text-white sm:text-2xl">
          {children}
        </div>
      ) : null}
    </section>
  );
}
