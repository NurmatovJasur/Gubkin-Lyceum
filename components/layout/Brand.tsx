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
  compact = false
}: {
  logo: string | null;
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.fullName} — на главную`}
      className={cn('inline-flex items-center gap-3.5 text-current', className)}
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

      <span className="grid gap-0.5">
        <span className="block text-[11.5px] leading-tight font-bold tracking-[0.055em] uppercase sm:text-[13px]">
          {site.nameLines[0]}
        </span>
        <span className="block text-[11px] leading-tight tracking-[0.035em] opacity-70 sm:text-xs">
          {site.nameLines[1]}
        </span>
      </span>
    </Link>
  );
}
