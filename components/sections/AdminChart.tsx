'use client';

import { useRef } from 'react';
import type { AdminMember, ResolvedImage } from '@/types';
import { gsap, useIsomorphicLayoutEffect, prefersReducedMotion } from '@/lib/gsap';
import { PersonCard } from '@/components/ui/PersonCard';
import { cn } from '@/lib/utils';

/** Сотрудник с уже разрешённым путём к фотографии (resolveImage — серверный). */
export type ChartMember = AdminMember & { image: ResolvedImage };

export type ChartLevel = {
  id: string;
  number: string;
  title: string;
  caption?: string;
  members: ChartMember[];
};

/**
 * Схема руководства лицея.
 *
 * Страница устроена как настоящая организационная диаграмма: директор, под
 * ним заместители, ниже — административные службы и специалисты лицея.
 * Уровень вмещает до трёх карточек (см. `gridFor`). Связи между уровнями не
 * нарисованы заранее — они **прочерчиваются по мере прокрутки** (scrub),
 * поэтому структура собирается у читателя на глазах, а не просто всплывает.
 *
 * Сами карточки — общий для сайта `PersonCard`: сотрудник администрации
 * выглядит ровно так же, как преподаватель на /teachers, и имеет те же
 * размеры. Шире только карточка директора (см. `gridFor`).
 *
 * Все движения живут в одном `gsap.context` и снимаются в cleanup, чтобы
 * ScrollTrigger не «залипал» при навигации App Router.
 *
 * Движение:
 *   1. номер уровня (фоновая цифра)  — медленный parallax;
 *   2. заголовок уровня               — короткое появление, один раз;
 *   3. линии схемы                    — рисуются scrub'ом вслед за скроллом;
 *   4. карточки                       — поднимаются из плоскости (rotateX).
 *
 * Наведение на карточку — такое же, как у преподавателей, и живёт в CSS
 * внутри `PersonCard`, поэтому здесь его нет.
 *
 * При `prefers-reduced-motion` не навешивается ничего: стартовое
 * `opacity: 0` снимается правилом `[data-reveal]` в globals.css.
 */
export function AdminChart({ levels }: { levels: ChartLevel[] }) {
  const root = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const element = root.current;
    if (!element || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      /* --- 1–2. Заголовки уровней ------------------------------------- */
      gsap.utils.toArray<HTMLElement>('[data-level-head]').forEach((head) => {
        gsap.fromTo(
          head.querySelectorAll('[data-reveal]'),
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: head, start: 'top 88%', once: true }
          }
        );

        const ghost = head.querySelector('[data-ghost]');
        if (ghost) {
          gsap.fromTo(
            ghost,
            { yPercent: 14 },
            {
              yPercent: -14,
              ease: 'none',
              scrollTrigger: {
                trigger: head,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
              }
            }
          );
        }
      });

      /* --- 3. Линии схемы --------------------------------------------- */
      gsap.utils.toArray<HTMLElement>('[data-connector]').forEach((node) => {
        const stem = node.querySelector('[data-line="stem"]');
        const dot = node.querySelector('[data-node]');
        const bars = node.querySelectorAll('[data-line="bar"]');
        const drops = node.querySelectorAll('[data-line="drop"]');

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: node,
            start: 'top 92%',
            end: 'bottom 60%',
            scrub: 0.5
          }
        });

        timeline
          .fromTo(stem, { scaleY: 0 }, { scaleY: 1, ease: 'none', duration: 1 })
          .fromTo(dot, { scale: 0 }, { scale: 1, ease: 'back.out(2.4)', duration: 0.35 })
          .fromTo(bars, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 0.5 }, '<')
          .fromTo(drops, { scaleY: 0 }, { scaleY: 1, ease: 'none', duration: 0.9 }, '>-0.1');
      });

      /* --- 4. Карточки ------------------------------------------------- */
      gsap.utils.toArray<HTMLElement>('[data-cards]').forEach((group) => {
        gsap.fromTo(
          group.querySelectorAll('[data-card]'),
          {
            opacity: 0,
            y: 46,
            rotateX: -9,
            transformOrigin: 'center bottom',
            transformPerspective: 900
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.95,
            stagger: 0.14,
            ease: 'power3.out',
            scrollTrigger: { trigger: group, start: 'top 85%', once: true }
          }
        );
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <div ref={root} className="relative [--admin-card:317px] [--admin-gap:14px]">
      <ol className="grid justify-items-center">
        {levels.map((level, index) => (
          <li key={level.id} className="grid w-full justify-items-center">
            {index > 0 ? <Connector columns={level.members.length} /> : null}

            <LevelHead level={level} />

            <ul
              data-cards
              className={cn(
                'grid w-full justify-center gap-[var(--admin-gap)]',
                gridFor(level.members.length)
              )}
            >
              {level.members.map((member) => (
                <li key={member.id} className="min-w-0">
                  <AdminCard member={member} lead={index === 0} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Сетка уровня.
 *
 * Ширина карточки и зазор повторяют сетку преподавателей на /teachers
 * (`--admin-card` и `--admin-gap` заданы в корне компонента): на мобильных —
 * две колонки, на десктопе карточка той же ширины, что и у преподавателя.
 * Исключение — директор: единственная карточка уровня в полтора раза шире
 * остальных, а на узких экранах занимает всю ширину.
 *
 * Колонки объявлены через `minmax(0, …)`, поэтому ряд сжимается по ширине
 * контейнера, а не вылезает за него. Классы перечислены статически:
 * Tailwind собирает только то, что видит в коде.
 *
 * Эту же сетку берёт ветвление (`Connector`) — число колонок и контрольная
 * точка обязаны совпадать, иначе линии разъедутся с карточками.
 */
const gridFor = (count: number): string => {
  if (count === 1) {
    return 'grid-cols-[minmax(0,calc(var(--admin-card)*1.5))]';
  }

  if (count === 2) {
    return 'grid-cols-[repeat(2,minmax(0,var(--admin-card)))]';
  }

  return 'grid-cols-[repeat(2,minmax(0,var(--admin-card)))] sm:grid-cols-[repeat(3,minmax(0,var(--admin-card)))]';
};

/** Заголовок уровня: крупный номер фоном и подпись поверх него. */
function LevelHead({ level }: { level: ChartLevel }) {
  return (
    <header
      data-level-head
      className="relative mb-[clamp(26px,3vw,44px)] grid w-full justify-items-center pt-[clamp(14px,2.4vw,34px)]"
    >
      <span
        data-ghost
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-[clamp(14px,2.6vw,38px)] block text-center text-[clamp(76px,11vw,168px)] leading-none font-bold tracking-[-0.05em] text-black/[0.045] select-none"
      >
        {level.number}
      </span>

      <h2 data-reveal className="relative text-eyebrow text-muted uppercase">
        {level.title}
      </h2>

      {level.caption ? (
        <p data-reveal className="relative mt-2.5 text-center text-[13px] text-subtle">
          {level.caption}
        </p>
      ) : null}
    </header>
  );
}

/**
 * Связь между уровнями схемы.
 *
 * Ветвление собрано на той же сетке, что и карточки: каждая колонка рисует
 * свою половину горизонтальной перекладины (до середины зазора) и вертикаль
 * вниз. Поэтому линии всегда попадают ровно в центры карточек при любой
 * ширине экрана — без замеров в JavaScript.
 *
 * Уровень из трёх карточек ниже `sm` переносится в две колонки — ветвиться
 * там не на что, поэтому такой уровень получает один вертикальный отвод по
 * центру, а перекладина появляется только с `sm`.
 *
 * Трансформации здесь задаёт GSAP, поэтому на анимируемых элементах нет
 * ни одной Tailwind-утилиты трансформации: GSAP переписывает `transform`
 * целиком и класс вроде `-translate-x-1/2` был бы потерян. Центрирование
 * сделано отрицательными отступами и `mx-auto`.
 */
function Connector({ columns }: { columns: number }) {
  const branch = 'h-[clamp(32px,3.6vw,58px)]';
  const wraps = columns > 2;

  return (
    <div data-connector aria-hidden="true" className="w-full">
      {/* Ствол от предыдущего уровня. */}
      <div className="relative mx-auto h-[clamp(28px,3.2vw,52px)] w-px">
        <span
          data-line="stem"
          className="absolute inset-x-0 top-0 block h-full origin-top bg-line-strong"
        />
      </div>

      {/* Узел ветвления — на стыке ствола и перекладины. */}
      <div className="relative mx-auto h-0 w-px">
        <span
          data-node
          className="absolute top-0 left-0 -mt-[4.5px] -ml-[4px] block size-[9px] rounded-full border-2 border-mist bg-blue"
        />
      </div>

      {columns > 1 ? (
        <>
          <div
            className={cn(
              'w-full justify-center gap-[var(--admin-gap)]',
              wraps ? 'hidden sm:grid' : 'grid',
              branch,
              gridFor(columns)
            )}
          >
            {Array.from({ length: columns }, (_, column) => (
              <span key={column} className="relative block min-w-0">
                {column > 0 ? (
                  <span
                    data-line="bar"
                    className="absolute top-0 right-1/2 block h-px w-[calc(50%+var(--admin-gap)/2)] origin-right bg-line-strong"
                  />
                ) : null}

                {column < columns - 1 ? (
                  <span
                    data-line="bar"
                    className="absolute top-0 left-1/2 block h-px w-[calc(50%+var(--admin-gap)/2)] origin-left bg-line-strong"
                  />
                ) : null}

                <span
                  data-line="drop"
                  className="absolute top-0 left-1/2 -ml-[0.5px] block h-full w-px origin-top bg-line-strong"
                />
              </span>
            ))}
          </div>

          {/* Мобильные: три карточки переносятся в две колонки — ветвиться некуда. */}
          {wraps ? (
            <div className={cn('relative mx-auto w-px sm:hidden', branch)}>
              <span
                data-line="drop"
                className="absolute inset-x-0 top-0 block h-full origin-top bg-line-strong"
              />
            </div>
          ) : null}
        </>
      ) : (
        <div className={cn('relative mx-auto w-px', branch)}>
          <span
            data-line="drop"
            className="absolute inset-x-0 top-0 block h-full origin-top bg-line-strong"
          />
        </div>
      )}
    </div>
  );
}

/**
 * Карточка сотрудника — тот же `PersonCard`, что и у преподавателей.
 *
 * Поля ложатся на общий дизайн так: справка — учёная степень, а если её нет,
 * круг вопросов сотрудника; ФИО; должность строкой градиентом.
 *
 * `data-card` — цель появления при скролле, `data-reveal` снимает стартовую
 * прозрачность при `prefers-reduced-motion`.
 */
function AdminCard({ member, lead = false }: { member: ChartMember; lead?: boolean }) {
  const sizes = lead
    ? '(max-width: 640px) 100vw, 480px'
    : '(max-width: 640px) 50vw, 320px';

  return (
    <article data-card data-reveal className="group h-full">
      <PersonCard
        photo={member.image}
        sizes={sizes}
        priority={lead}
        note={member.degree ?? member.scope.join(' · ')}
        name={`${member.surname} ${member.givenNames}`}
        meta={member.position}
      />
    </article>
  );
}
