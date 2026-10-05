import { cn } from '@/lib/utils';

type SlideDotsProps = {
  count: number;
  active: number;
  onSelect: (index: number) => void;
  /** Существительное для aria-label: «Фотография 2 из 6», «Раздел 2 из 5». */
  item?: string;
  /** 'pill' — активная точка вытягивается в полоску (макет «Жизнь в лицее»). */
  variant?: 'dot' | 'pill';
  className?: string;
};

/**
 * Точки-индикатор под каруселью, как в Instagram: сколько всего фото и на
 * каком ты сейчас. Активная точка — синяя и чуть крупнее. Каждая точка —
 * кнопка с увеличенной зоной нажатия для пальца.
 */
export function SlideDots({
  count,
  active,
  onSelect,
  item = 'Фотография',
  variant = 'dot',
  className
}: SlideDotsProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`${item} ${index + 1} из ${count}`}
          aria-current={index === active}
          onClick={() => onSelect(index)}
          className="flex h-6 min-w-6 items-center justify-center px-[3px]"
        >
          <span
            aria-hidden="true"
            className={cn(
              'block rounded-full transition-all duration-300 ease-brand',
              index === active
                ? variant === 'pill'
                  ? 'h-[6px] w-[22px] bg-campus-dot'
                  : 'size-[7px] bg-blue'
                : 'size-[6px] bg-line-strong'
            )}
          />
        </button>
      ))}
    </div>
  );
}
