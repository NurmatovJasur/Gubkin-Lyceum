'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { ResolvedImage } from '@/types';
import { flightGalleryIntro } from '@/data/content';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * «Лицей в кадре» — секция с 3D-галереей фотографий.
 *
 * Сам коридор из кадров рисует components/ui/3d-gallery-photography.tsx
 * (three.js + react-three-fiber). Здесь — обвязка под дизайн-систему сайта:
 * заголовок секции, высота полосы и две оптимизации загрузки.
 *
 *   1. Чанк с three.js подтягивается динамически (`ssr: false`) и только
 *      когда секция подходит к вьюпорту — на остальных экранах сайта этих
 *      ~600 КБ в бандле нет вовсе.
 *
 *   2. Текстуры берутся не из исходных файлов, а через оптимизатор
 *      next/image: тот же кадр отдаётся в AVIF/WebP шириной 1280px
 *      (ширина и качество — из `images` в next.config.ts).
 *
 * Фотографии приходят уже разрешёнными со страницы (resolveImages —
 * серверный модуль). Кадры-заглушки в полёт не отправляются: текстуру
 * из них не сделать, они существуют только как вёрстка.
 */

const InfiniteGallery = dynamic(() => import('@/components/ui/3d-gallery-photography'), {
  ssr: false
});

/** Путь к кадру через оптимизатор next/image — вместо исходного JPEG. */
const textureSrc = (src: string) =>
  `/_next/image?url=${encodeURIComponent(src)}&w=1280&q=82`;

export function PhotoGallery3D({ images }: { images: ResolvedImage[] }) {
  const frames = images.filter((image) => !image.isPlaceholder);
  const root = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      // Чанк и текстуры начинают грузиться за экран до секции.
      { rootMargin: '400px 0px' }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (frames.length === 0) return null;

  return (
    <section
      id="photos"
      aria-label={flightGalleryIntro.heading}
      className="overflow-hidden bg-mist py-section"
    >
      <Container>
        <SectionHeading heading={flightGalleryIntro.heading} text={flightGalleryIntro.text} />
      </Container>

      <div ref={root} className="h-[clamp(380px,74vh,740px)] w-full">
        {near ? (
          <InfiniteGallery
            images={frames.map((image) => ({ src: textureSrc(image.src), alt: image.alt }))}
            speed={1.2}
            /*
             * Плоскостей в полёте больше, чем фотографий: так в полосе
             * всегда несколько кадров, а не один-два. Снимки при этом не
             * задваиваются на экране — повтор одного кадра идёт по коридору
             * дальше, чем видно за раз.
             */
            visibleCount={frames.length + 4}
            className="size-full"
          />
        ) : null}
      </div>

      <Container>
        <p className="mt-[clamp(20px,2.4vw,36px)] text-center text-label text-subtle uppercase">
          Листайте страницу — кадры летят навстречу
        </p>
      </Container>
    </section>
  );
}
