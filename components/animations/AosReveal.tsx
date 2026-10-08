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

/**
 * Начальные и конечные состояния из aos.css.
 *
 * Для `fade-*` и `zoom-in` анимируются opacity и transform, для `flip-*` —
 * только transform: в aos.css у них `transition-property: transform`, и
 * прозрачность не участвует вовсе.
 */
const STATES = {
  'zoom-in': {
    from: { opacity: 0, scale: 0.6, x: 0, y: 0 },
    to: { opacity: 1, scale: 1, x: 0, y: 0 }
  },
  'fade-up': {
    from: { opacity: 0, scale: 1, x: 0, y: 100 },
    to: { opacity: 1, scale: 1, x: 0, y: 0 }
  },
  /* aos.css: [data-aos="fade-right"] { transform: translate3d(-100px, 0, 0) } */
  'fade-right': {
    from: { opacity: 0, scale: 1, x: -100, y: 0 },
    to: { opacity: 1, scale: 1, x: 0, y: 0 }
  },
  /*
   * aos.css:
   *   [data-aos^="flip"][data-aos^="flip"] { backface-visibility: hidden;
   *                                          transition-property: transform }
   *   [data-aos="flip-right"]              { transform: perspective(2500px) rotateY(100deg) }
   *   [data-aos="flip-right"].aos-animate  { transform: perspective(2500px) rotateY(0deg) }
   */
  'flip-right': {
    from: { transformPerspective: 2500, rotationY: 100 },
    to: { transformPerspective: 2500, rotationY: 0 }
  }
} as const;

type AosName = keyof typeof STATES;

/**
 * aos.css генерирует правила задержки шагом 50мс только до 3000мс
 * включительно. Для `data-aos-delay` больше 3000 подходящего правила нет,
 * `transition-delay` остаётся нулевым и элемент стартует без задержки.
 * Повторяем это поведение, чтобы длинные цепочки вели себя как в оригинале.
 */
const AOS_MAX_DELAY = 3000;

/**
 * Ниже этой ширины окна AOS на newuu.uz отключён целиком:
 * `AOS.init({ disable: () => window.innerWidth < 767 })`.
 */
const AOS_DISABLE_BELOW = 767;

/** AOS 2: offset по умолчанию — 120px, anchorPlacement `top-bottom`. */
const AOS_OFFSET = 120;

/**
 * Позиция прокрутки, на которой AOS считает элемент показанным.
 *
 * AOS берёт `offsetTop` по цепочке `offsetParent` (utils/offset.js) и для
 * `anchorPlacement: 'top-bottom'` возвращает
 * `elementTop + offset - windowHeight`.
 *
 * Важно, что это именно `offsetTop`, а не `getBoundingClientRect()`:
 * на offsetTop не влияет transform. У `flip-*` стартовое состояние —
 * `rotateY(100deg)`, то есть повёрнутая плитка, и её клиентский бокс
 * схлопывается почти в ноль; если считать порог по нему, ScrollTrigger
 * промахивается и анимация не стартует вовсе. По той же причине у `fade-up`
 * порог по клиентскому боксу уезжал бы на 100px вниз против оригинала.
 */
const docTop = (el: HTMLElement) => {
  let top = 0;
  for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) {
    top += node.offsetTop;
  }
  return top;
};

const aosTriggerPoint = (el: HTMLElement) => docTop(el) + AOS_OFFSET - window.innerHeight;

/**
 * Номер элемента в своей визуальной строке — для цепочки, которая начинается
 * заново на каждой строке сетки.
 *
 * В оригинале шаблон печатает `data-aos-delay` сквозным счётчиком по всему
 * списку, и на длинных списках цепочка расползается: во второй строке
 * задержки уже по несколько секунд, а всё, что больше 3000мс, aos.css вообще
 * не обрабатывает и такие плитки стартуют без задержки. Поэтому вместо
 * сквозного номера считаем номер внутри строки: каждая строка отыгрывает
 * свою цепочку слева направо, когда доезжает до порога.
 *
 * Строка определяется по `offsetTop` (на него не влияет transform), поэтому
 * при смене ширины окна состав строк пересчитывается сам.
 */
const rowIndex = (el: HTMLElement, group: HTMLElement[]) => {
  const top = docTop(el);
  let index = 0;
  for (const other of group) {
    if (other === el) break;
    if (Math.abs(docTop(other) - top) <= 1) index += 1;
  }
  return index;
};

/**
 * Пересчёт порогов, когда высота документа доезжает до финальной.
 *
 * ScrollTrigger считает `start` только на refresh, а refresh по умолчанию
 * случается на `load` и `resize`. Картинки на главной грузятся лениво и уже
 * после `load`, поэтому высота блоков выше секции меняется позже — и
 * посчитанный порог устаревает. На «Партнёрах» он уезжал почти на 2500px,
 * так что прокрутка до секции порога уже не переходила и цепочка не
 * стартовала вообще.
 *
 * Наблюдатель один на все экземпляры: `ScrollTrigger.refresh()` глобальный.
 */
let layoutWatchers = 0;
let layoutObserver: ResizeObserver | null = null;
let layoutTimer: ReturnType<typeof setTimeout> | undefined;
let lastDocHeight = 0;

const watchLayout = () => {
  layoutWatchers += 1;
  if (layoutObserver) return;

  lastDocHeight = document.documentElement.scrollHeight;
  layoutObserver = new ResizeObserver(() => {
    const height = document.documentElement.scrollHeight;
    if (height === lastDocHeight) return;
    lastDocHeight = height;
    clearTimeout(layoutTimer);
    layoutTimer = setTimeout(() => ScrollTrigger.refresh(), 120);
  });
  layoutObserver.observe(document.documentElement);
};

const unwatchLayout = () => {
  layoutWatchers = Math.max(0, layoutWatchers - 1);
  if (layoutWatchers > 0 || !layoutObserver) return;

  clearTimeout(layoutTimer);
  layoutObserver.disconnect();
  layoutObserver = null;
};

/** AOS 2: once по умолчанию false, mirror false — значит обратный проигрыш. */
type AosRevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Повторение поведения AOS 2 на GSAP ScrollTrigger.
 *
 * Обрабатывает любые вложенные элементы с атрибутами оригинала:
 * `data-aos` (`zoom-in` | `fade-up` | `fade-right` | `flip-right`),
 * `data-aos-duration`, `data-aos-delay`.
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
      targets.forEach((target) => {
        const state = STATES[target.dataset.aos as AosName];
        if (state) gsap.set(target, { ...state.to, clearProps: 'willChange' });
      });
      return;
    }

    const context = gsap.context(() => {
      targets.forEach((target) => {
        const name = target.dataset.aos as AosName;
        const state = STATES[name];
        if (!state) return;
        const { from, to } = state;

        const duration = Number(target.dataset.aosDuration ?? 400) / 1000;

        /*
         * Задержка: либо фиксированная из `data-aos-delay`, как в оригинале,
         * либо шаг цепочки из `data-aos-delay-step` — тогда она считается от
         * номера плитки в её строке и пересчитывается при смене ширины.
         */
        const step = Number(target.dataset.aosDelayStep ?? 0);
        const fixed = Number(target.dataset.aosDelay ?? 0);
        const delayMs = () =>
          step > 0 ? step * rowIndex(target, targets) : fixed > AOS_MAX_DELAY ? 0 : fixed;

        gsap.set(target, from);

        /*
         * AOS сверяет условие состоянием, а не событием: показан элемент или
         * нет, определяется сравнением `scrollTop` с порогом, и класс
         * `aos-animate` навешивается или снимается по результату. Повторяем
         * это, запоминая текущее состояние, — иначе пересчёт порогов
         * (`onRefresh`) дёргал бы анимацию у уже показанных плиток.
         */
        let revealed: boolean | null = null;
        const sync = (shouldReveal: boolean, animate: boolean) => {
          if (revealed === shouldReveal) return;
          revealed = shouldReveal;
          const vars = shouldReveal ? to : from;
          if (animate) {
            gsap.to(target, {
              ...vars,
              duration,
              /* transition-delay в AOS висит только на `.aos-animate`,
                 поэтому обратный проигрыш идёт без задержки. */
              delay: shouldReveal ? delayMs() / 1000 : 0,
              ease: 'aosEase',
              overwrite: true
            });
          } else {
            gsap.set(target, vars);
          }
        };

        ScrollTrigger.create({
          trigger: target,
          start: () => aosTriggerPoint(target),
          onEnter: () => sync(true, true),
          onLeaveBack: () => sync(false, true),
          /*
           * Первый вызов приходит при создании триггера: если страница уже
           * проскроллена ниже порога, элемент доигрывает, как в AOS; если нет —
           * просто встаёт в стартовое состояние без твина.
           */
          onRefresh: (self) => {
            const shouldReveal = self.scroll() >= self.start;
            sync(shouldReveal, revealed !== null || shouldReveal);
          }
        });
      });
    }, root);

    watchLayout();

    return () => {
      unwatchLayout();
      context.revert();
    };
  }, []);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
