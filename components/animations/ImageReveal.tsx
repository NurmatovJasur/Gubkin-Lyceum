'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, useIsomorphicLayoutEffect } from '@/lib/gsap';
import { cn } from '@/lib/utils';

type ImageRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Раскрытие фотографии: кадр «открывается» снизу вверх, изображение
 * одновременно возвращается из лёгкого приближения. Сдержанно и без
 * резких движений — в духе editorial-вёрстки сайта.
 */
export function ImageReveal({ children, className, delay = 0 }: ImageRevealProps) {
  const root = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const element = root.current;
    if (!element) return;

    const context = gsap.context(() => {
      const image = element.querySelector('img');

      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: delay / 1000,
        scrollTrigger: { trigger: element, start: 'top 85%', once: true }
      });

      timeline.fromTo(
        element,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1 }
      );

      if (image) {
        timeline.fromTo(image, { scale: 1.12 }, { scale: 1, duration: 1.3 }, 0);
      }
    }, root);

    return () => context.revert();
  }, [delay]);

  return (
    <div ref={root} className={cn('relative min-w-0 overflow-hidden bg-cloud', className)}>
      {children}
    </div>
  );
}
