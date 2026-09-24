import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type SlideArrowsProps = {
  /** CSS-класс кнопки «назад» для Swiper Navigation. */
  prevClass: string;
  /** CSS-класс кнопки «вперёд» для Swiper Navigation. */
  nextClass: string;
  className?: string;
};

/**
 * Стрелки карусели: две круглые «стеклянные» кнопки в капсуле поверх кадра.
 * При наведении кнопка заливается синим, а стрелка сдвигается в сторону листания.
 */
export function SlideArrows({ prevClass, nextClass, className }: SlideArrowsProps) {
  return (
    <div
      className={cn(
        'absolute right-4 bottom-4 z-10 hidden gap-1 rounded-full bg-white/70 p-1 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] ring-1 ring-white/60 backdrop-blur-md lg:flex',
        className
      )}
    >
      <ArrowButton className={prevClass} label="Предыдущая фотография">
        <ArrowLeft
          aria-hidden="true"
          strokeWidth={1.75}
          className="size-[18px] transition-transform duration-300 ease-brand group-hover:-translate-x-0.5"
        />
      </ArrowButton>
      <ArrowButton className={nextClass} label="Следующая фотография">
        <ArrowRight
          aria-hidden="true"
          strokeWidth={1.75}
          className="size-[18px] transition-transform duration-300 ease-brand group-hover:translate-x-0.5"
        />
      </ArrowButton>
    </div>
  );
}

function ArrowButton({
  className,
  label,
  children
}: {
  className: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'group flex size-11 cursor-pointer items-center justify-center rounded-full bg-white text-black shadow-sm transition-[background-color,color,transform,box-shadow] duration-300 ease-brand hover:bg-blue hover:text-white hover:shadow-[0_6px_16px_-4px_rgba(36,87,214,0.6)] active:scale-90',
        className
      )}
    >
      {children}
    </button>
  );
}
