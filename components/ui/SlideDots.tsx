import { cn } from '@/lib/utils';

type SlideDotsProps = {
  count: number;
  active: number;
  onSelect: (index: number) => void;
  className?: string;
};

/**
 * Точки-индикатор под каруселью, как в Instagram: сколько всего фото и на
 * каком ты сейчас. Активная точка — синяя и чуть крупнее. Каждая точка —
 * кнопка с увеличенной зоной нажатия для пальца.
 */
export function SlideDots({ count, active, onSelect, className }: SlideDotsProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Фотография ${index + 1} из ${count}`}
          aria-current={index === active}
          onClick={() => onSelect(index)}
          className="flex size-6 items-center justify-center"
        >
          <span
            aria-hidden="true"
            className={cn(
              'block rounded-full transition-all duration-300 ease-brand',
              index === active ? 'size-[7px] bg-blue' : 'size-[6px] bg-line-strong'
            )}
          />
        </button>
      ))}
    </div>
  );
}
