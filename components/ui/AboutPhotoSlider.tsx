'use client';

import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, Keyboard } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper/types';
import type { ResolvedImage } from '@/types';
import { Media } from '@/components/ui/Media';
import { SlideDots } from '@/components/ui/SlideDots';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/a11y';
import 'swiper/css/keyboard';

/** Шаг автопрокрутки — 5 секунд, как просили. */
const AUTOPLAY_MS = 5000;

/**
 * Карусель снимков в рамке секции «О лицее».
 *
 * В оригинале (newuu.uz/en/) в средней колонке стоит одна статичная
 * фотография. Здесь её место занимает карусель того же устройства, что и
 * галерея на странице «О лицее»: листается свайпом, клавишами и точками —
 * и сама переключает кадр каждые 5 секунд.
 *
 * Геометрия рамки не меняется: Swiper занимает её целиком, точки лежат
 * поверх кадра, поэтому высота блока остаётся ровно такой же, как у
 * `.about-image` оригинала.
 *
 * Автопрокрутка встаёт на паузу под курсором и при prefers-reduced-motion
 * не запускается вовсе.
 */
export function AboutPhotoSlider({ images, label }: { images: ResolvedImage[]; label: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const swiperRef = useRef<SwiperClass | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setAutoplay(!reduced.matches && images.length > 1);
    sync();
    reduced.addEventListener('change', sync);
    return () => reduced.removeEventListener('change', sync);
  }, [images.length]);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper?.autoplay) return;
    if (autoplay && !paused) swiper.autoplay.start();
    else swiper.autoplay.stop();
  }, [autoplay, paused]);

  return (
    <div
      className="gallery size-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Swiper
        modules={[Keyboard, A11y, Autoplay]}
        keyboard={{ enabled: true }}
        a11y={{ containerMessage: label }}
        autoplay={{ delay: AUTOPLAY_MS, disableOnInteraction: false }}
        loop
        speed={700}
        slidesPerView={1}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          swiper.autoplay?.stop();
        }}
        onSlideChange={(swiper) => setActive(swiper.realIndex)}
        className="size-full"
      >
        {images.map((image) => (
          <SwiperSlide key={image.file} className="relative">
            <div className="relative size-full overflow-hidden">
              <Media image={image} sizes="(max-width: 768px) 100vw, 30vw" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Точки лежат поверх кадра — высоту рамки не меняют. Стрелок нет:
          листают свайпом, клавишами и точками. */}
      <div className="absolute bottom-3 left-3 z-10 rounded-full bg-white/70 px-1 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] ring-1 ring-white/60 backdrop-blur-md">
        <SlideDots
          count={images.length}
          active={active}
          onSelect={(index) => swiperRef.current?.slideToLoop(index)}
        />
      </div>

      <p aria-live="polite" className="sr-only">
        Фотография {active + 1} из {images.length}
      </p>
    </div>
  );
}
