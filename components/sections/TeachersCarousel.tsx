'use client';

import { Children, type ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Keyboard, Navigation } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/a11y';
import 'swiper/css/keyboard';

/**
 * Мобильная карусель преподавателей.
 *
 * Карточки приходят с сервера как children — клиентский код отвечает
 * только за прокрутку, стрелки и клавиатуру.
 */
export function TeachersCarousel({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  const slides = Children.toArray(children);

  return (
    <div className={cn('gallery relative min-w-0', className)}>
      <Swiper
        modules={[Navigation, Keyboard, A11y]}
        navigation={{ prevEl: '.teachers-prev', nextEl: '.teachers-next' }}
        keyboard={{ enabled: true }}
        a11y={{
          containerMessage: 'Преподаватели лицея',
          prevSlideMessage: 'Предыдущий преподаватель',
          nextSlideMessage: 'Следующий преподаватель'
        }}
        spaceBetween={16}
        breakpoints={{
          0: { slidesPerView: 1.25 },
          560: { slidesPerView: 2.2 },
          768: { slidesPerView: 3 }
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>{slide}</SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          aria-label="Предыдущий преподаватель"
          className="teachers-prev flex size-12 items-center justify-center border border-line-strong text-black transition-colors duration-200 ease-brand hover:border-black hover:bg-black hover:text-white"
        >
          <ArrowLeft aria-hidden="true" strokeWidth={1.5} className="size-[18px]" />
        </button>
        <button
          type="button"
          aria-label="Следующий преподаватель"
          className="teachers-next flex size-12 items-center justify-center border border-line-strong text-black transition-colors duration-200 ease-brand hover:border-black hover:bg-black hover:text-white"
        >
          <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-[18px]" />
        </button>
      </div>
    </div>
  );
}
