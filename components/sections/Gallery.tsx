'use client';

import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Keyboard, Navigation } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper/types';
import type { ResolvedImage } from '@/types';
import { Media } from '@/components/ui/Media';
import { SlideArrows } from '@/components/ui/SlideArrows';
import { SlideDots } from '@/components/ui/SlideDots';
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
 * и объявление слайдов для скринридеров (Swiper A11y). Под кадром —
 * точки-индикатор как в Instagram; номер слайда объявляется в aria-live.
 */
export function Gallery({
  images,
  label,
  className,
  sizes = '(max-width: 900px) 100vw, 58vw',
  aspect = 'aspect-16/10'
}: GalleryProps) {
  const [active, setActive] = useState(0);
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <div className={cn('min-w-0', className)}>
      <div className={cn('gallery relative isolate min-w-0 overflow-hidden rounded-media bg-cloud', aspect)}>
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
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => setActive(swiper.realIndex)}
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

        {/* Стрелки поверх кадра — только десктоп, на телефоне листают свайпом. */}
        <SlideArrows prevClass="gallery-prev" nextClass="gallery-next" />
      </div>

      <p aria-live="polite" className="sr-only">
        Фотография {active + 1} из {images.length}
      </p>
      <SlideDots
        count={images.length}
        active={active}
        onSelect={(index) => swiperRef.current?.slideToLoop(index)}
        className="mt-2"
      />
    </div>
  );
}
