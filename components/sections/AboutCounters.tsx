'use client';

import { useRef, type ReactNode } from 'react';
import { useIsomorphicLayoutEffect, prefersReducedMotion } from '@/lib/gsap';

/**
 * Счётчики плиток «О лицее» — повторение скрипта оригинала (newuu.uz/en/,
 * инлайновый `<script>` рядом с `#counter`):
 *
 *   var a2 = 0;
 *   $(window).scroll(function () {
 *       var oTop = $('#counter').offset().top - window.innerHeight;
 *       if (a2 === 0 && $(window).scrollTop() > oTop) { … a2 = 1; }
 *   });
 *
 * Совпадает с оригиналом по всем параметрам:
 *   • момент срабатывания — верх блока пересёк низ вьюпорта, строго по
 *     событию scroll и ровно один раз (флаг `a2`);
 *   • duration 2000 мс, easing jQuery `swing` — (1 - cos(pt * π)) / 2;
 *   • во время анимации выводится Math.floor, в конце — точное значение;
 *   • разделитель тысяч — пробел (`formatNumber` оригинала).
 *
 * Разметку компонент не трогает: он лишь находит внутри себя узлы
 * `[data-count]` (аналог `.counter-value`) и пишет в них текст. При
 * prefers-reduced-motion цифры проставляются сразу, без отсчёта.
 */

/** `formatNumber` оригинала: пробел как разделитель тысяч. */
function formatNumber(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/** jQuery easing `swing`. */
function swing(p: number): number {
  return 0.5 - Math.cos(p * Math.PI) / 2;
}

const DURATION = 2000;

/**
 * Компонент занимает место самой колонки (`<div class="col" id="counter">`
 * оригинала) — промежуточной обёртки между колонкой и плиткой быть не должно,
 * иначе у `.cards` рвётся цепочка `height: 100%`.
 */
export function AboutCounters({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const node = root.current;
    if (!node) return;

    const targets = [...node.querySelectorAll<HTMLElement>('[data-count]')].map((el) => ({
      el,
      to: Number.parseInt((el.dataset.count ?? '').replace(/[^0-9]/g, ''), 10)
    }));
    if (targets.length === 0) return;

    if (prefersReducedMotion()) {
      targets.forEach(({ el, to }) => {
        el.textContent = formatNumber(to);
      });
      return;
    }

    let done = false;
    let frame = 0;
    let settle = 0;

    const finish = () => {
      cancelAnimationFrame(frame);
      targets.forEach(({ el, to }) => {
        el.textContent = formatNumber(to);
      });
    };

    const run = () => {
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - start) / DURATION, 1);
        const eased = swing(p);
        targets.forEach(({ el, to }) => {
          el.textContent = formatNumber(p < 1 ? Math.floor(to * eased) : to);
        });
        if (p < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
      /* Страховка: в скрытой вкладке requestAnimationFrame замирает, и отсчёт
         остановился бы на промежуточной цифре. Таймер доводит её до конца. */
      settle = window.setTimeout(finish, DURATION + 100);
    };

    const onScroll = () => {
      if (done) return;
      const top = node.getBoundingClientRect().top + window.scrollY;
      if (window.scrollY > top - window.innerHeight) {
        done = true;
        run();
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
      clearTimeout(settle);
    };
  }, []);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
