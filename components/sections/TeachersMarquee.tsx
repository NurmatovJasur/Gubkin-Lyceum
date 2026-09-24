'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ResolvedImage, Teacher } from '@/types';
import { gsap, useIsomorphicLayoutEffect, prefersReducedMotion } from '@/lib/gsap';
import { Media } from '@/components/ui/Media';
import { TeacherModal } from '@/components/ui/TeacherModal';
import { cn } from '@/lib/utils';

type Card = { teacher: Teacher; photo: ResolvedImage };

/** Скорость ленты, px/сек — не зависит от количества карточек. */
const SPEED = 44;

/**
 * Бегущая лента преподавателей (по образцу карусели «События» на
 * inter-nation.uz): карточки едут по кругу слева направо и никогда не
 * останавливаются сами — пока по одной из них не кликнут.
 *
 * Клик ставит ленту на паузу и открывает полную карточку преподавателя
 * (TeacherModal). Лента возобновляется при закрытии карточки.
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
  const [active, setActive] = useState<Card | null>(null);

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

  // Открытая карточка держит ленту на паузе до закрытия.
  useEffect(() => {
    if (active) tweenRef.current?.pause();
    else tweenRef.current?.play();
  }, [active]);

  const pause = () => {
    if (!active) tweenRef.current?.pause();
  };
  const resume = () => {
    if (!active) tweenRef.current?.play();
  };

  const items = running ? loop : cards;

  return (
    <div className="relative overflow-hidden">
      <div
        ref={trackRef}
        className={cn(
          'flex gap-3.5 px-gutter',
          running ? 'w-max' : 'flex-wrap justify-center'
        )}
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        {items.map((card, index) => {
          const duplicate = index >= cards.length;
          return (
            <button
              key={`${card.teacher.id}-${index}`}
              type="button"
              tabIndex={duplicate ? -1 : 0}
              aria-hidden={duplicate}
              aria-label={card.teacher.name}
              onClick={() => setActive(card)}
              onFocus={pause}
              onBlur={resume}
              className="w-[168px] shrink-0 outline-offset-4 sm:w-[204px]"
            >
              {/* Пропорции — как у самих карточек; -inset срезает светлую кайму по краям снимка. */}
              <span className="relative block aspect-[488/688] overflow-hidden bg-cloud">
                <span className="absolute -inset-1 block">
                  <Media image={card.photo} sizes="220px" />
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {active ? (
        <TeacherModal
          teacher={active.teacher}
          photo={active.photo}
          onClose={() => setActive(null)}
        />
      ) : null}
    </div>
  );
}
