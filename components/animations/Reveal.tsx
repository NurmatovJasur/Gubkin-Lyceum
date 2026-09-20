'use client';

import { useRef, type ElementType, type ReactNode } from 'react';
import { gsap, useIsomorphicLayoutEffect } from '@/lib/gsap';

type RevealProps = {
  children: ReactNode;
  /** HTML-тег обёртки: чтобы не ломать семантику списков и секций. */
  as?: ElementType;
  className?: string;
  /** Задержка появления, мс. */
  delay?: number;
  /** Появление дочерних элементов по очереди (stagger), сек. */
  stagger?: number;
  /** Селектор дочерних элементов для stagger. По умолчанию — прямые дети. */
  childSelector?: string;
  /** Смещение снизу, px. */
  y?: number;
};

/**
 * Спокойное появление блока при скролле.
 *
 * Заменяет прежний IntersectionObserver: та же сдержанная анимация,
 * но на ScrollTrigger — с общим таймлайном и корректным cleanup.
 * Стартовое `opacity: 0` задано в CSS (`[data-reveal]`), поэтому вспышки
 * контента до инициализации GSAP не происходит.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  className,
  delay = 0,
  stagger,
  childSelector,
  y = 18
}: RevealProps) {
  const root = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const element = root.current;
    if (!element) return;

    const context = gsap.context(() => {
      const targets = stagger
        ? gsap.utils.toArray<HTMLElement>(childSelector ?? ':scope > *', element)
        : [element];

      if (!targets.length) {
        gsap.set(element, { opacity: 1 });
        return;
      }

      // При stagger анимируются дети — саму обёртку показываем сразу.
      if (stagger) gsap.set(element, { opacity: 1 });

      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: delay / 1000,
          stagger: stagger ?? 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            once: true
          }
        }
      );
    }, root);

    return () => context.revert();
  }, [delay, stagger, childSelector, y]);

  return (
    <Tag ref={root} data-reveal className={className}>
      {children}
    </Tag>
  );
}
