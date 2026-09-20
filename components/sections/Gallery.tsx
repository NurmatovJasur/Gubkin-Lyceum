'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Keyboard, Navigation } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper/types';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { ResolvedImage } from '@/types';
import { Media } from '@/components/ui/Media';
import { cn } from '@/lib/utils';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/a11y';
import 'swiper/css/keyboard';

type GalleryProps = {
  images: ResolvedImage[];
  label: string;
  className?: string;
  sizes?: string;
  /** Пропорции кадра. */
  aspect?: string;
};

/**
 * Карусель фотографий на Swiper.
 *
 * Поддерживает стрелки, свайп, навигацию с клавиатуры (Swiper Keyboard)
 * и объявление слайдов для скринридеров (Swiper A11y). Счётчик слайдов
 * обновляется в aria-live-области.
 */
export function Gallery({
  images,
  label,
  className,
  sizes = '(max-width: 900px) 100vw, 58vw',
  aspect = 'aspect-16/10'
}: GalleryProps) {
  const counter = useRef<HTMLSpanElement>(null);

  const onSlideChange = (swiper: SwiperClass) => {
    if (counter.current) {
      counter.current.textContent = String(swiper.realIndex + 1).padStart(2, '0');
    }
  };

  return (
    <div className={cn('gallery relative min-w-0 bg-cloud', aspect, className)}>
      <Swiper
        modules={[Navigation, Keyboard, A11y]}
        navigation={{ prevEl: '.gallery-prev', nextEl: '.gallery-next' }}
        keyboard={{ enabled: true }}
        a11y={{
          containerMessage: label,
          prevSlideMessage: 'Предыдущая фотография',
          nextSlideMessage: 'Следующая фотография'
        }}
        loop
        speed={700}
        slidesPerView={1}
        onSlideChange={onSlideChange}
        className="size-full"
      >
        {images.map((image) => (
          <SwiperSlide key={image.file} className="relative">
            <div className="relative size-full overflow-hidden">
              <Media image={image} sizes={sizes} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Управление лежит поверх кадра — как в исходном макете. */}
      <div className="absolute right-0 bottom-0 z-10 flex">
        <button
          type="button"
          aria-label="Предыдущая фотография"
          className="gallery-prev flex size-12 items-center justify-center border-l border-line bg-white/95 text-black transition-colors duration-200 ease-brand hover:bg-blue hover:text-white lg:size-14"
        >
          <ArrowLeft aria-hidden="true" strokeWidth={1.5} className="size-[18px]" />
        </button>
        <button
          type="button"
          aria-label="Следующая фотография"
          className="gallery-next flex size-12 items-center justify-center border-l border-line bg-white/95 text-black transition-colors duration-200 ease-brand hover:bg-blue hover:text-white lg:size-14"
        >
          <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-[18px]" />
        </button>
      </div>

      <p
        aria-live="polite"
        className="absolute bottom-0 left-0 z-10 flex items-center gap-1.5 bg-white/95 px-4 py-3 text-xs tracking-[0.12em] text-muted"
      >
        <span ref={counter}>01</span>
        <span aria-hidden="true" className="text-line-strong">
          /
        </span>
        <span>{String(images.length).padStart(2, '0')}</span>
      </p>
    </div>
  );
}
