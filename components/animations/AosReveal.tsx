'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect, prefersReducedMotion } from '@/lib/gsap';
import { CustomEase } from 'gsap/CustomEase';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase);
  /*
   * CSS-ключевое слово `ease`, которое AOS ставит по умолчанию
   * (`data-aos-easing="ease"` на <body>), — это cubic-bezier(.25,.1,.25,1).
   */
  CustomEase.create('aosEase', 'M0,0 C0.25,0.1 0.25,1 1,1');
}

/** Начальные состояния из aos.css. */
const STATES = {
  'zoom-in': { opacity: 0, scale: 0.6, x: 0, y: 0 },
  'fade-up': { opacity: 0, scale: 1, x: 0, y: 100 },
  /* aos.css: [data-aos="fade-right"] { transform: translate3d(-100px, 0, 0) } */
  'fade-right': { opacity: 0, scale: 1, x: -100, y: 0 }
} as const;

type AosName = keyof typeof STATES;

/**
 * Ниже этой ширины окна AOS на newuu.uz отключён целиком:
 * `AOS.init({ disable: () => window.innerWidth < 767 })`.
 */
const AOS_DISABLE_BELOW = 767;

/** AOS 2: offset по умолчанию — 120px, anchorPlacement `top-bottom`. */
const AOS_OFFSET = 120;

/** AOS 2: once по умолчанию false, mirror false — значит обратный проигрыш. */
type AosRevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Повторение поведения AOS 2 на GSAP ScrollTrigger.
 *
 * Обрабатывает любые вложенные элементы с атрибутами оригинала:
 * `data-aos` (`zoom-in` | `fade-up` | `fade-right`), `data-aos-duration`,
 * `data-aos-delay`.
 *
 * Совпадает с оригиналом по всем параметрам:
 *   • момент срабатывания — верх элемента на 120px выше низа вьюпорта
 *     (AOS: `scrollTop >= elementTop - windowHeight + offset`);
 *   • duration / delay — из тех же атрибутов, что в разметке;
 *   • easing — cubic-bezier(.25,.1,.25,1) (CSS `ease`);
 *   • `once: false`, `mirror: false` — при прокрутке назад выше точки старта
 *     элемент скрывается обратно, причём без задержки: transition-delay в AOS
 *     висит только на классе `.aos-animate`;
 *   • при ширине окна < 767px анимация выключена, элементы сразу видны.
 *
 * Стартовое `opacity: 0` задано в CSS (см. NewsFeed.module.css), поэтому
 * вспышки контента до инициализации GSAP не происходит — как и в оригинале.
 */
export function AosReveal({ children, className }: AosRevealProps) {
  const root = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const element = root.current;
    if (!element) return;

    const targets = gsap.utils.toArray<HTMLElement>('[data-aos]', element);
    if (!targets.length) return;

    /* AOS вычисляет `disable` один раз при инициализации — повторяем. */
    const disabled = window.innerWidth < AOS_DISABLE_BELOW || prefersReducedMotion();

    if (disabled) {
      gsap.set(targets, { opacity: 1, scale: 1, x: 0, y: 0, clearProps: 'willChange' });
      return;
    }

    const context = gsap.context(() => {
      targets.forEach((target) => {
        const name = target.dataset.aos as AosName;
        const from = STATES[name];
        if (!from) return;

        const duration = Number(target.dataset.aosDuration ?? 400) / 1000;
        const delay = Number(target.dataset.aosDelay ?? 0) / 1000;

        gsap.set(target, from);

        const to = { opacity: 1, scale: 1, x: 0, y: 0 };

        ScrollTrigger.create({
          trigger: target,
          start: `top bottom-=${AOS_OFFSET}px`,
          onEnter: () =>
            gsap.to(target, { ...to, duration, delay, ease: 'aosEase', overwrite: true }),
          onLeaveBack: () =>
            gsap.to(target, { ...from, duration, delay: 0, ease: 'aosEase', overwrite: true })
        });
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
