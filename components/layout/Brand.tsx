import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/site.config';
import { cn } from '@/lib/utils';

/**
 * Знак лицея.
 * Если в `public/images/` лежит logo.svg или logo.png — используется он,
 * иначе выводится строгая служебная монограмма.
 */
export function Brand({
  logo,
  className,
  labelClassName,
  compact = false
}: {
  logo: string | null;
  className?: string;
  /** Классы для текстовой части — например, скрыть подпись на узких экранах. */
  labelClassName?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.fullName} — на главную`}
      className={cn('inline-flex min-w-0 items-center gap-2.5 text-current sm:gap-3.5', className)}
    >
      {logo ? (
        <Image
          src={logo}
          alt=""
          width={42}
          height={42}
          priority
          unoptimized={logo.endsWith('.svg')}
          className={cn('shrink-0', compact ? 'size-9' : 'size-[42px]')}
        />
      ) : (
        <span
          aria-hidden="true"
          className={cn('block shrink-0', compact ? 'size-9' : 'size-[42px]')}
        >
          <svg viewBox="0 0 44 44" focusable="false" role="presentation" className="size-full">
            <rect x="0.5" y="0.5" width="43" height="43" fill="none" stroke="currentColor" />
            <path d="M14 13h16v3.2H17.6V31H14V13z" fill="currentColor" />
          </svg>
        </span>
      )}

      {/*
        `min-w-0` + `truncate`: на экранах уже 340px название перестаёт
        помещаться рядом с языком и кнопкой меню. Вместо того чтобы
        вытолкнуть их за край, строка сокращается многоточием.
      */}
      <span className={cn('grid min-w-0 gap-0.5', labelClassName)}>
        <span className="truncate text-[10.5px] leading-tight font-bold tracking-[0.05em] uppercase sm:text-[13px] sm:tracking-[0.055em]">
          {site.nameLines[0]}
        </span>
        <span className="truncate text-[10px] leading-tight tracking-[0.03em] opacity-70 sm:text-xs sm:tracking-[0.035em]">
          {site.nameLines[1]}
        </span>
      </span>
    </Link>
  );
}
