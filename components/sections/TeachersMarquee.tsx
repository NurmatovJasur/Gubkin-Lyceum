'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { ResolvedImage, Teacher } from '@/types';
import { gsap, useIsomorphicLayoutEffect, prefersReducedMotion } from '@/lib/gsap';
import { TeacherCard } from '@/components/ui/TeacherCard';
import { cn } from '@/lib/utils';

type Card = { teacher: Teacher; photo: ResolvedImage };

/** Скорость ленты, px/сек — не зависит от количества карточек. */
const SPEED = 44;

/**
 * Бегущая лента преподавателей (по образцу карусели «События» на
 * inter-nation.uz): карточки едут по кругу слева направо и
 * останавливаются под курсором или при фокусе с клавиатуры.
 *
 * Карточка — ссылка на персональную страницу преподавателя
 * (/teachers/<slug>), где его справка приведена целиком.
 *
 * Набор карточек продублирован: трек уезжает ровно на половину своей
 * ширины и бесшовно «телепортируется» в начало (repeat: -1) — шва не видно.
 * Дубликат помечен aria-hidden, чтобы скринридер не озвучивал список дважды.
 *
 * Без JS и при prefers-reduced-motion лента остаётся статичной обёрткой:
 * все карточки видны сразу, без анимации и дублей (см. ParallaxComponent
 * — тот же приём «решение до первой отрисовки»).
 */
export function TeachersMarquee({ cards }: { cards: Card[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [running, setRunning] = useState(false);

  const loop = useMemo(() => [...cards, ...cards], [cards]);

  useIsomorphicLayoutEffect(() => {
    setRunning(!prefersReducedMotion());
  }, []);

  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || !running) return;

    const context = gsap.context(() => {
      const distance = track.scrollWidth / 2;
      tweenRef.current = gsap.fromTo(
        track,
        { x: 0 },
        { x: -distance, duration: distance / SPEED, ease: 'none', repeat: -1 }
      );
    }, track);

    return () => context.revert();
  }, [running, cards.length]);

  const pause = () => tweenRef.current?.pause();
  const resume = () => tweenRef.current?.play();

  const items = running ? loop : cards;

  return (
    <div className="relative overflow-hidden">
      <div
        ref={trackRef}
        className={cn(
          'flex items-stretch gap-3.5 px-gutter',
          running ? 'w-max' : 'flex-wrap justify-center'
        )}
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        {items.map((card, index) => {
          const duplicate = index >= cards.length;
          return (
            <Link
              key={`${card.teacher.id}-${index}`}
              href={`/teachers/${card.teacher.slug}`}
              tabIndex={duplicate ? -1 : 0}
              aria-hidden={duplicate}
              aria-label={card.teacher.name}
              onFocus={pause}
              onBlur={resume}
              className="group w-[204px] shrink-0 outline-offset-4 sm:w-[248px]"
            >
              <TeacherCard teacher={card.teacher} photo={card.photo} sizes="250px" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
