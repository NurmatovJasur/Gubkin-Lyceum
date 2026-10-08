'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect, prefersReducedMotion } from '@/lib/gsap';
import { cn } from '@/lib/utils';

type CountUpProps = {
  /** Итоговое значение — строка из данных, например «26». */
  value: string;
  className?: string;
};

/**
 * Счётчик статистики: число «набирается» при появлении блока.
 *
 * Значение приходит из данных как строка и выводится в разметке сразу —
 * если JavaScript не выполнится, цифра всё равно видна.
 *
 * Анимация запускается из `onEnter` отдельного ScrollTrigger, а не через
 * `scrollTrigger` внутри `gsap.to`. Во втором случае твин создаётся сразу и
 * его `onUpdate` успевает записать в элемент ноль ещё до того, как блок
 * появится на экране; если дальше твин не доигрывал, на странице навсегда
 * оставался «0» вместо настоящей цифры.
 *
 * По завершении в элемент возвращается ровно исходная строка: промежуточные
 * кадры округляются, а разделители (пробел в «1 200», знак «%») живут
 * только в ней.
 */
export function CountUp({ value, className }: CountUpProps) {
  const root = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const element = root.current;
    const target = Number.parseFloat(value.replace(/[^\d.]/g, ''));
    if (!element || Number.isNaN(target) || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      const counter = { value: 0 };
      const suffix = value.replace(/[\d.\s]/g, '');

      const trigger = ScrollTrigger.create({
        trigger: element,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(counter, {
            value: target,
            duration: 1.4,
            ease: 'power2.out',
            onUpdate: () => {
              element.textContent = `${Math.round(counter.value)}${suffix}`;
            },
            onComplete: () => {
              element.textContent = value;
            }
          });
        }
      });

      return () => trigger.kill();
    }, root);

    return () => context.revert();
  }, [value]);

  return (
    <span ref={root} className={cn(className)}>
      {value}
    </span>
  );
}
