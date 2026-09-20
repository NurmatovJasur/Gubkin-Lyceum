'use client';

import { useRef, useState } from 'react';
import type { ResolvedImage } from '@/types';
import { gsap, useIsomorphicLayoutEffect, prefersReducedMotion } from '@/lib/gsap';
import { Media } from '@/components/ui/Media';
import { cn } from '@/lib/utils';

/**
 * Полноэкранные кадры, наезжающие друг на друга (overlapping reveal).
 *
 * Все снимки лежат стопкой в одной закреплённой рамке высотой в экран:
 * каждый следующий выше предыдущего по z-index и стартует полностью под
 * нижним краем (`yPercent: 100`). При прокрутке он поднимается до
 * `yPercent: 0` и накрывает предыдущий — границы между «секциями» не видно,
 * потому что секций как таковых нет, это слои одного кадра.
 *
 * Прокрутку задаёт внешний контейнер: его высота равна числу кадров,
 * умноженному на высоту экрана, а рамка внутри — `position: sticky`.
 * Sticky вместо `ScrollTrigger.pin` выбран намеренно: нет pin-spacer'а,
 * нет пересчёта отступов при refresh и нет скачка вёрстки.
 *
 * Внутри каждого слоя снимок выше рамки на 20% и дрейфует на ±7% своей
 * высоты — это 8.4% экрана при доступных 10%, поэтому пустые края
 * появиться не могут. Дрейф привязан к тому же таймлайну: кадр «подъезжает»
 * вместе со слоем и продолжает уходить, пока его накрывает следующий.
 *
 * Плавность даёт `scrub: 0.6` — сглаживается только эта анимация,
 * скорость прокрутки страницы остаётся обычной.
 *
 * Без JS (и при `prefers-reduced-motion`) слои остаются в обычном потоке:
 * три кадра высотой в экран друг за другом, без наложения.
 */

/** Дрейф снимка внутри слоя, в процентах его собственной высоты. */
const DRIFT = 7;

type ParallaxComponentProps = {
  images: ResolvedImage[];
  className?: string;
};

export function ParallaxComponent({ images, className }: ParallaxComponentProps) {
  const root = useRef<HTMLDivElement>(null);
  const [stacked, setStacked] = useState(false);

  // Решение принимается до первой отрисовки, поэтому перескока не видно.
  useIsomorphicLayoutEffect(() => {
    setStacked(!prefersReducedMotion());
  }, []);

  useIsomorphicLayoutEffect(() => {
    const element = root.current;
    if (!element || !stacked) return;

    const context = gsap.context(() => {
      const layers = Array.from(element.querySelectorAll<HTMLElement>('[data-layer]'));
      if (layers.length < 2) return;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true
        }
      });

      layers.forEach((layer, index) => {
        const inner = layer.querySelector<HTMLElement>('[data-layer-inner]');

        // Стартовое положение ставим сразу и средствами GSAP: стартовые
        // значения таймлайна применяются только на первом кадре анимации,
        // а до него все слои лежали бы на нуле — и был бы виден верхний
        // снимок вместо нижнего. gsap.set правит ту же величину yPercent,
        // поэтому со стартом fromTo не складывается.
        if (index > 0) {
          gsap.set(layer, { yPercent: 100 });
          if (inner) gsap.set(inner, { yPercent: -DRIFT });
        }

        // Слой поднимается снизу и закрывает предыдущий.
        if (index > 0) {
          timeline.fromTo(
            layer,
            { yPercent: 100 },
            { yPercent: 0, ease: 'none', duration: 1 },
            index - 1
          );
        }

        if (!inner) return;

        // Снимок подтягивается, пока слой заезжает…
        if (index > 0) {
          timeline.fromTo(
            inner,
            { yPercent: -DRIFT },
            { yPercent: 0, ease: 'none', duration: 1 },
            index - 1
          );
        }

        // …и продолжает уходить, пока его накрывает следующий слой.
        if (index < layers.length - 1) {
          timeline.to(inner, { yPercent: DRIFT, ease: 'none', duration: 1 }, index);
        }
      });
    }, root);

    return () => context.revert();
  }, [stacked, images.length]);

  return (
    <div
      ref={root}
      className={cn('relative', className)}
      // Высота контейнера задаёт длину прокрутки: по экрану на каждый кадр.
      style={stacked ? { height: `${images.length * 100}svh` } : undefined}
    >
      <div className={cn(stacked && 'sticky top-0 h-svh w-full overflow-hidden')}>
        {images.map((image, index) => (
          <div
            key={image.file}
            data-layer
            className={cn(
              'w-full overflow-hidden bg-black',
              stacked ? 'absolute inset-0 will-change-transform' : 'relative h-svh'
            )}
            // Никаких стартовых transform в разметке: GSAP принял бы их за
            // базовое смещение и прибавил yPercent сверху. Стартовое положение
            // слоёв задаёт fromTo — он применяет его синхронно, до отрисовки.
            style={stacked ? { zIndex: index + 1 } : undefined}
          >
            <div data-layer-inner className="absolute inset-x-0 -top-[10%] h-[120%]">
              {/*
                Снимок выше рамки и обрезается по ширине, поэтому его реальная
                ширина заметно больше ширины вьюпорта — особенно на вертикальных
                экранах. Проценты описывают её, иначе next/image отдал бы файл
                втрое меньше нужного.
              */}
              <Media
                image={image}
                sizes="(max-width: 480px) 400vw, (max-width: 899px) 250vw, 105vw"
                quality={85}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
