'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect, DESKTOP_QUERY } from '@/lib/gsap';
import { cn } from '@/lib/utils';

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Сила эффекта: доля высоты кадра. 0.12 — очень сдержанно. */
  strength?: number;
};

/**
 * Очень сдержанный parallax: изображение движется медленнее контента.
 *
 * На мобильных эффект почти полностью выключен (см. gsap.matchMedia):
 * это заметно дешевле для слабых устройств и не мешает чтению.
 */
export function Parallax({ children, className, strength = 0.12 }: ParallaxProps) {
  const root = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const element = root.current;
    if (!element) return;

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      const animate = (shift: number) => () => {
        const target = element.querySelector('[data-parallax-target]') ?? element.firstElementChild;
        if (!target) return;

        gsap.fromTo(
          target,
          { yPercent: -shift },
          {
            yPercent: shift,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true
            }
          }
        );
      };

      media.add(DESKTOP_QUERY, animate(strength * 100 * 0.5));
      // Мобильные: движение почти незаметное, но кадр не выглядит статичным.
      media.add(`(max-width: 899px)`, animate(strength * 100 * 0.16));
    }, root);

    return () => context.revert();
  }, [strength]);

  return (
    <div ref={root} className={cn('relative min-w-0 overflow-hidden', className)}>
      {children}
    </div>
  );
}

/** Пересчёт триггеров после загрузки шрифтов/изображений. */
export const refreshScrollTriggers = () => ScrollTrigger.refresh();
