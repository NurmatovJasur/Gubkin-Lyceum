'use client';

import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, Keyboard, Navigation } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper/types';
import type { ResolvedImage } from '@/types';
import { Media } from '@/components/ui/Media';
import { SlideArrows } from '@/components/ui/SlideArrows';
import { SlideDots } from '@/components/ui/SlideDots';
import { ImageReveal } from '@/components/animations/ImageReveal';
import { DESKTOP_QUERY } from '@/lib/gsap';
import { cn } from '@/lib/utils';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/a11y';

const AUTOPLAY_MS = 5500;

type AboutShowcaseProps = {
  portrait: ResolvedImage;
  images: ResolvedImage[];
  label: string;
};

/**
 * Фотоблок секции «О лицее».
 *
 * Мобильные: портрет + карусель со свайпом и точками под кадром.
 * Десктоп: над смещённым вниз портретом — крупный «перелистывающийся» номер
 * кадра; под каруселью — полоса автопрокрутки, подпись и точки.
 * Автопрокрутка только на десктопе, встаёт на паузу под курсором и
 * отключается при prefers-reduced-motion.
 */
export function AboutShowcase({ portrait, images, label }: AboutShowcaseProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const swiperRef = useRef<SwiperClass | null>(null);
  const total = pad(images.length);

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setAutoplay(desktop.matches && !reduced.matches);
    sync();
    desktop.addEventListener('change', sync);
    reduced.addEventListener('change', sync);
    return () => {
      desktop.removeEventListener('change', sync);
      reduced.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper?.autoplay) return;
    if (autoplay && !paused) swiper.autoplay.start();
    else swiper.autoplay.stop();
  }, [autoplay, paused]);

  const running = autoplay && !paused;

  return (
    <div className="mt-[clamp(48px,7vw,120px)] grid items-start gap-3.5 lg:grid-cols-12 lg:gap-[clamp(14px,1.8vw,30px)]">
      <div className="lg:col-span-4">
        {/* Номер кадра и подпись — только десктоп, заполняют отступ над портретом. */}
        <div
          aria-hidden="true"
          className="hidden h-[clamp(40px,9vw,150px)] flex-col justify-between lg:flex"
        >
          <div className="flex items-end gap-3 leading-none">
            <span className="relative block h-[clamp(52px,6vw,92px)] overflow-hidden text-[clamp(52px,6vw,92px)] font-bold tracking-[-0.05em] text-blue">
              <span
                className="block transition-transform duration-700 ease-out-brand"
                style={{ transform: `translateY(-${(active * 100) / images.length}%)` }}
              >
                {images.map((_, index) => (
                  <span key={index} className="block h-[clamp(52px,6vw,92px)]">
                    {pad(index + 1)}
                  </span>
                ))}
              </span>
            </span>
            <span className="pb-[0.6em] text-label text-subtle">/ {total}</span>
          </div>
        </div>

        <ImageReveal className="aspect-4/3 lg:mt-[clamp(20px,2vw,32px)] lg:aspect-4/5">
          <Media image={portrait} sizes="(max-width: 900px) 100vw, 32vw" />
        </ImageReveal>
      </div>

      <div
        className="min-w-0 lg:col-span-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="gallery relative isolate aspect-16/10 min-w-0 overflow-hidden rounded-media bg-cloud">
          <Swiper
            modules={[Navigation, Keyboard, A11y, Autoplay]}
            navigation={{ prevEl: '.showcase-prev', nextEl: '.showcase-next' }}
            keyboard={{ enabled: true }}
            a11y={{
              containerMessage: label,
              prevSlideMessage: 'Предыдущая фотография',
              nextSlideMessage: 'Следующая фотография'
            }}
            autoplay={{ delay: AUTOPLAY_MS, disableOnInteraction: false }}
            loop
            speed={900}
            slidesPerView={1}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              swiper.autoplay?.stop();
            }}
            onSlideChange={(swiper) => setActive(swiper.realIndex)}
            className="size-full"
          >
            {images.map((image, index) => (
              <SwiperSlide key={image.file} className="relative">
                <div className="relative size-full overflow-hidden">
                  {/* Медленный «кен бёрнс» на активном кадре — только десктоп. */}
                  <div
                    className={cn(
                      'absolute inset-0 transition-transform ease-linear motion-reduce:transition-none',
                      running && index === active
                        ? 'lg:scale-[1.06] lg:duration-[6s]'
                        : 'scale-100 duration-700'
                    )}
                  >
                    <Media image={image} sizes="(max-width: 900px) 100vw, 58vw" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Стрелки только на десктопе — на телефоне листают свайпом. */}
          <SlideArrows prevClass="showcase-prev" nextClass="showcase-next" />

        </div>

        {/* Полоса автопрокрутки — только десктоп. */}
        <div className="relative mt-3 hidden h-px bg-line lg:block">
          <span
            key={`${active}-${running}`}
            className="absolute inset-y-0 left-0 bg-blue"
            style={{
              width: running ? undefined : '0%',
              animation: running ? `showcase-progress ${AUTOPLAY_MS}ms linear forwards` : undefined
            }}
          />
        </div>

        <p aria-live="polite" className="sr-only lg:hidden">
          Фотография {active + 1} из {images.length}
        </p>

        {/* Мобильные: точки по центру. Десктоп: подпись слева, точки справа. */}
        <div className="lg:mt-4 lg:flex lg:items-start lg:justify-between lg:gap-8">
          <p
            key={active}
            aria-live="polite"
            className="hidden max-w-[46ch] animate-[showcase-caption_600ms_var(--ease-out-brand)_both] text-[14px] leading-[1.55] text-muted lg:block"
          >
            {images[active]?.alt}
          </p>

          <SlideDots
            count={images.length}
            active={active}
            onSelect={(index) => swiperRef.current?.slideToLoop(index)}
            className="mt-2 shrink-0 lg:mt-0 lg:-mr-2"
          />
        </div>
      </div>
    </div>
  );
}

const pad = (value: number) => String(value).padStart(2, '0');
