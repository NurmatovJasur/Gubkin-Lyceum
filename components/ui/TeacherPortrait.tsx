import type { ResolvedImage } from '@/types';
import { Media } from '@/components/ui/Media';
import { cn } from '@/lib/utils';

/**
 * Кадрирование портретов преподавателей.
 *
 * Снимки в `public/images/teacher-NN.jpg` — это не фотографии, а готовые
 * плакаты: сам портрет занимает верхние ~60% листа, ниже напечатаны ФИО,
 * должность, кабинет и справка. Поэтому ни один кадр нельзя выводить
 * целиком — печатный текст дублировал бы подписи вёрстки.
 *
 * Оба компонента вырезают нужный участок плаката: увеличенное изображение
 * лежит абсолютом внутри окна с `overflow-hidden`, проценты считаются от
 * размеров окна. Пропорции листа — 488×688.
 */

type Props = {
  photo: ResolvedImage;
  /** Значение sizes для next/image — ширина окна кадра, не плаката. */
  sizes: string;
  /** Пропорции окна: по умолчанию 4/5 (портрет) и 7/6 (лицо). */
  className?: string;
  priority?: boolean;
  quality?: number;
};

/**
 * Лицо крупным планом: видно голову и плечи (по плакату — 10…90% ширины
 * и 1,5…50% высоты). Используется на карточках, где текст набран вёрсткой.
 */
export function TeacherFace({ photo, sizes, className, priority, quality }: Props) {
  return (
    <span className={cn('relative block aspect-7/6 overflow-hidden bg-cloud', className)}>
      <span className="absolute -top-[3%] -left-[12.5%] block w-[125%] aspect-[488/688]">
        <Media image={photo} sizes={sizes} priority={priority} quality={quality} />
      </span>
    </span>
  );
}

/**
 * Портрет целиком, без печатного текста: кадр по самой фотографии на
 * плакате. Для модалки и персональной страницы преподавателя.
 */
export function TeacherPortrait({ photo, sizes, className, priority, quality }: Props) {
  return (
    <div className={cn('relative overflow-hidden bg-cloud', className)}>
      <div className="absolute -top-[4%] left-1/2 aspect-[476/692] h-[176%] -translate-x-1/2">
        <Media image={photo} sizes={sizes} priority={priority} quality={quality} />
      </div>
    </div>
  );
}
