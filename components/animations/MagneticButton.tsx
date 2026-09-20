'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, useIsomorphicLayoutEffect, DESKTOP_QUERY } from '@/lib/gsap';
import { cn } from '@/lib/utils';

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  /** Максимальное смещение к курсору, px. */
  strength?: number;
};

/**
 * «Магнитная» кнопка: элемент слегка тянется к курсору.
 *
 * Эффект включается только на desktop с мышью — на сенсорных экранах
 * и при prefers-reduced-motion обработчики не навешиваются вовсе.
 * Сам по себе эффект декоративный: кнопка внутри остаётся обычной
 * ссылкой и полностью работает с клавиатуры.
 */
export function MagneticButton({ children, className, strength = 14 }: MagneticButtonProps) {
  const root = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const element = root.current;
    if (!element) return;

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add(
        { isDesktop: `${DESKTOP_QUERY} and (hover: hover) and (pointer: fine)` },
        (ctx) => {
          if (!ctx.conditions?.isDesktop) return;

          const move = gsap.quickTo(element, 'x', { duration: 0.5, ease: 'power3.out' });
          const moveY = gsap.quickTo(element, 'y', { duration: 0.5, ease: 'power3.out' });

          const onMove = (event: PointerEvent) => {
            const rect = element.getBoundingClientRect();
            const relX = (event.clientX - rect.left) / rect.width - 0.5;
            const relY = (event.clientY - rect.top) / rect.height - 0.5;
            move(relX * strength * 2);
            moveY(relY * strength);
          };

          const onLeave = () => {
            move(0);
            moveY(0);
          };

          element.addEventListener('pointermove', onMove);
          element.addEventListener('pointerleave', onLeave);

          return () => {
            element.removeEventListener('pointermove', onMove);
            element.removeEventListener('pointerleave', onLeave);
            gsap.set(element, { x: 0, y: 0 });
          };
        }
      );
    }, root);

    return () => context.revert();
  }, [strength]);

  return (
    <span ref={root} className={cn('inline-flex', className)}>
      {children}
    </span>
  );
}
