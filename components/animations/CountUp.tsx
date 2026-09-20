'use client';

import { useRef } from 'react';
import { gsap, useIsomorphicLayoutEffect } from '@/lib/gsap';
import { cn } from '@/lib/utils';

type CountUpProps = {
  /** Итоговое значение — строка из данных, например «26». */
  value: string;
  className?: string;
};

/**
 * Счётчик статистики: число «набирается» при появлении блока.
 *
 * Значение приходит из data/statistics.ts как строка и выводится
 * в разметке сразу — если JavaScript не выполнится, цифра всё равно видна.
 */
export function CountUp({ value, className }: CountUpProps) {
  const root = useRef<HTMLSpanElement>(null);
  const target = Number.parseFloat(value.replace(/[^\d.]/g, ''));

  useIsomorphicLayoutEffect(() => {
    const element = root.current;
    if (!element || Number.isNaN(target)) return;

    const context = gsap.context(() => {
      const counter = { value: 0 };
      const suffix = value.replace(/[\d.\s]/g, '');

      gsap.to(counter, {
        value: target,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: element, start: 'top 90%', once: true },
        onUpdate: () => {
          element.textContent = `${Math.round(counter.value)}${suffix}`;
        }
      });
    }, root);

    return () => context.revert();
  }, [target, value]);

  return (
    <span ref={root} className={cn(className)}>
      {value}
    </span>
  );
}
