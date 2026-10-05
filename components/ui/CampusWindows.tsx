'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import type { CampusWindow, ResolvedImage } from '@/types';
import { Media } from '@/components/ui/Media';
import styles from '@/components/sections/CampusLife.module.css';

type Item = CampusWindow & { photo: ResolvedImage };

/**
 * Карусель «оконец» — повторение Owl Carousel 2 с настройками `CCampus`
 * из оригинала (assets/public/js/carousels.js):
 *
 *   margin: 105, items: 6, smartSpeed: 800, autoplay: false,
 *   nav: false, dots: true, loop: false,
 *   responsive: 0→{2,12}, 575→{3,16}, 768→{4,24}, 992→{5,32},
 *               1200→{6,32}, 1400→{margin:105}
 *
 * Owl определяет число карточек по `window.innerWidth`, а не по медиазапросам,
 * поэтому после гидратации значения приходят инлайном и перекрывают CSS —
 * иначе на границах брейкпоинтов расходимся на шаг.
 *
 * Геометрию (ширину карточки и шаг прокрутки) целиком считает CSS — см.
 * CampusLife.module.css. JS нужен только для индекса, точек и перетаскивания.
 */

/** Owl.responsive: минимальная ширина окна → сколько карточек видно. */
const BREAKPOINTS: { min: number; items: number; margin: number }[] = [
  { min: 1200, items: 6, margin: 32 },
  { min: 992, items: 5, margin: 32 },
  { min: 768, items: 4, margin: 24 },
  { min: 575, items: 3, margin: 16 },
  { min: 0, items: 2, margin: 12 }
];

/** Просвет между карточками: с 1400px Owl берёт 105px вместо значения брейкпоинта. */
const marginFor = (width: number, fallback: number) => (width >= 1400 ? 105 : fallback);

const viewFor = (width: number) => {
  const bp = BREAKPOINTS.find((item) => width >= item.min) ?? BREAKPOINTS[BREAKPOINTS.length - 1];
  return { items: bp.items, margin: marginFor(width, bp.margin) };
};

/**
 * Страницы точек по алгоритму Owl (Navigation.prototype.update): страницы
 * идут через `items` карточек, последняя прижимается к максимуму прокрутки.
 */
const buildPages = (count: number, items: number) => {
  const maximum = Math.max(0, count - items);
  const pages: { start: number; end: number }[] = [];

  for (let i = 0; ; i += items) {
    const start = Math.min(maximum, i);
    pages.push({ start, end: i + items - 1 });
    if (start === maximum) break;
  }

  return pages;
};

/** Owl.closest: протяжка больше 30px всегда переводит на соседнюю карточку. */
const DRAG_PULL = 30;

/** Шаг задержки появления между карточками, мс (`data-aos-delay` оригинала). */
const AOS_STAGGER = 200;

/** Порог срабатывания появления, px (`offset` по умолчанию у AOS). */
const AOS_OFFSET = 120;

export function CampusWindows({ items }: { items: Item[] }) {
  const [index, setIndex] = useState(0);
  const [view, setView] = useState<{ items: number; margin: number; width: number } | null>(null);
  const [instant, setInstant] = useState(false);
  const [shown, setShown] = useState(false);
  const [drag, setDrag] = useState(0);

  const viewportRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<{ items: number; margin: number; width: number } | null>(null);
  const dragRef = useRef<{ id: number; x: number; index: number; pitch: number } | null>(null);
  const movedRef = useRef(false);

  const count = items.length;
  /* Задержки идут по разделам: 0, 200, 400… и повторяются на второй половине
     ленты — ровно как `data-aos-delay` у оригинала. */
  const unique = new Set(items.map((item) => item.id)).size;
  /* До гидратации число карточек задаётся медиазапросами (см. CSS). */
  const perView = view?.items ?? 6;
  const maximum = Math.max(0, count - perView);
  const pages = buildPages(count, perView);
  /* После расширения окна видимых карточек больше — подрезаем сдвиг прямо
     при отрисовке, без лишнего прохода через состояние. */
  const current = Math.min(index, maximum);
  /* Owl берёт последнюю подходящую страницу — так активной становится вторая
     точка, как только лента упирается в правый край. */
  const page = pages.reduce(
    (found, item, at) => (item.start <= current && item.end >= current ? at : found),
    0
  );

  const goTo = useCallback(
    (next: number) => setIndex(Math.min(Math.max(next, 0), maximum)),
    [maximum]
  );

  /*
   * Число карточек и просвет берём из `window.innerWidth`, как Owl.
   * Заодно Owl при изменении ширины переставляет ленту мгновенно, без
   * анимации, поэтому на один кадр отключаем переход.
   */
  useEffect(() => {
    const sync = () => {
      const next = {
        ...viewFor(window.innerWidth),
        width: viewportRef.current?.getBoundingClientRect().width ?? 0
      };

      /* Пустые срабатывания наблюдателя не должны гасить переход. */
      const prev = viewRef.current;
      if (prev && prev.items === next.items && prev.margin === next.margin && prev.width === next.width) {
        return;
      }

      viewRef.current = next;
      setView(next);
      setInstant(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setInstant(false)));
    };

    sync();
    window.addEventListener('resize', sync);

    /* resize не всегда долетает (эмуляция, изменение размера контейнера). */
    const observer = new ResizeObserver(sync);
    if (viewportRef.current) observer.observe(viewportRef.current);

    return () => {
      window.removeEventListener('resize', sync);
      observer.disconnect();
    };
  }, []);

  /*
   * Появление карточек — порт обработчика AOS, а не IntersectionObserver:
   * оригинал считает точку срабатывания сам, на событии прокрутки.
   *
   * AOS (offset.js + handleScroll, настройки по умолчанию, anchorPlacement
   * `top-bottom`, offset 120):
   *   точка = верх элемента − высота окна + 120
   *   показан, когда pageYOffset >= точки, иначе класс снимается (`once: false`)
   *
   * Из этого следует и поведение при обратной прокрутке: уехав вверх за
   * пределы экрана, карточки остаются видимыми, и прячутся только когда
   * вернёшься выше точки срабатывания.
   */
  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;

    const check = () => {
      const top = node.getBoundingClientRect().top + window.scrollY;
      setShown(window.scrollY >= top - window.innerHeight + AOS_OFFSET);
    };

    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);

    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  /*
   * Шаг прокрутки — ровно как у Owl: (ширина ленты + margin) / items.
   * Сдвиг задаётся готовым значением в пикселях, а не через CSS-переменную:
   * переход на `transform`, собранный из `var()`, Chrome не перезапускает
   * при смене переменной, и лента замирает на первом шаге.
   */
  const pitch = view ? (view.width + view.margin) / view.items : 0;

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      index: current,
      pitch
    };
    movedRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = dragRef.current;
    if (!state || state.id !== event.pointerId) return;

    const dx = event.clientX - state.x;
    if (Math.abs(dx) > 3) movedRef.current = true;
    setInstant(true);
    setDrag(dx);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = dragRef.current;
    if (!state || state.id !== event.pointerId) return;

    const dx = event.clientX - state.x;
    let next = Math.round(state.index - dx / state.pitch);
    if (next === state.index && Math.abs(dx) > DRAG_PULL) next = state.index + (dx < 0 ? 1 : -1);

    dragRef.current = null;
    setDrag(0);
    setInstant(false);
    goTo(next);
  };

  const trackStyle = (
    view ? { transform: `translate3d(${drag - current * pitch}px, 0, 0)` } : undefined
  ) as CSSProperties | undefined;

  /* Инлайн-переменные появляются только после гидратации (см. комментарий выше). */
  const carouselStyle = (
    view ? { '--items': view.items, '--margin': `${view.margin}px` } : undefined
  ) as CSSProperties | undefined;

  return (
    <div className={styles.carousel} style={carouselStyle}>
      <div className={styles.navigation}>
        <button
          type="button"
          aria-label="Предыдущие разделы"
          className={`${styles.navButton} ${styles.prev}`}
          onClick={() => goTo(current - 1)}
        >
          <ArrowIcon direction="left" />
        </button>
        <button
          type="button"
          aria-label="Следующие разделы"
          className={`${styles.navButton} ${styles.next}`}
          onClick={() => goTo(current + 1)}
        >
          <ArrowIcon direction="right" />
        </button>
      </div>

      <div
        ref={viewportRef}
        className={styles.viewport}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className={styles.track}
          style={trackStyle}
          data-instant={instant || undefined}
          onClickCapture={(event) => {
            /* После протяжки клик по ссылке не должен срабатывать. */
            if (movedRef.current) {
              event.preventDefault();
              event.stopPropagation();
              movedRef.current = false;
            }
          }}
        >
          {items.map((item, at) => (
            <div key={`${item.id}-${at}`} className={styles.slide}>
              <Card item={item} shown={shown} delay={(at % unique) * AOS_STAGGER} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.dots}>
        {pages.map((item, at) => (
          <button
            key={item.start}
            type="button"
            aria-label={`Показать разделы ${item.start + 1}–${Math.min(item.end + 1, count)}`}
            aria-current={at === page || undefined}
            className={styles.dot}
            data-active={at === page}
            onClick={() => goTo(item.start)}
          />
        ))}
      </div>
    </div>
  );
}

/** Одно «оконце»: фото в арке и подпись. Без страницы по теме — не ссылка. */
function Card({ item, shown, delay }: { item: Item; shown: boolean; delay: number }) {
  const reveal = {
    'data-shown': shown,
    style: { '--aos-delay': `${delay}ms` } as CSSProperties
  };

  const inner = (
    <>
      <div className={styles.itemImage}>
        <Media image={item.photo} sizes="(max-width: 991px) 25vw, 16vw" />
      </div>
      <h3 className={styles.itemTitle}>{item.title}</h3>
    </>
  );

  if (!item.href) {
    return (
      <div className={styles.item} {...reveal}>
        {inner}
      </div>
    );
  }

  return (
    <Link href={item.href} className={styles.item} draggable={false} {...reveal}>
      {inner}
    </Link>
  );
}

/**
 * Стрелка из иконочного шрифта оригинала (icomoon, `icon-arrow-left` —
 * \e905, `icon-arrow-right` — \e906). Контур взят из icomoon.svg: шрифт
 * с units-per-em 1024 и ascent 960, поэтому глиф развёрнут по вертикали.
 */
function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  const d =
    direction === 'left'
      ? 'M334.019 490.673l228.864 228.863-60.342 60.34-331.868-331.87 331.868-331.864 60.342 60.337-228.864 228.859h519.322v85.336h-519.322z'
      : 'M689.988 490.671l-228.864 228.864 60.339 60.34 331.87-331.871-331.87-331.866-60.339 60.339 228.864 228.86h-519.322v85.333h519.322z';

  return (
    <svg viewBox="0 0 1024 1024" aria-hidden="true" focusable="false">
      <path transform="translate(0 960) scale(1 -1)" d={d} />
    </svg>
  );
}
