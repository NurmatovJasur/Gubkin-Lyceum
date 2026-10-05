import type { SocialId } from '@/data/navigation';
import { cn } from '@/lib/utils';

/**
 * Знак Telegram.
 *
 * В lucide-react иконок брендов нет, поэтому фирменный «самолётик»
 * нарисован здесь. Цвет берётся у родителя (currentColor) — иконка
 * одинаково работает на тёмной и светлой шапке.
 */
function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M21.73 3.3 2.9 10.56c-1.1.44-1.1 1.07-.2 1.35l4.7 1.47 1.8 5.52c.22.6.4.83.83.83.33 0 .47-.15.65-.33l2.2-2.14 4.57 3.38c.84.46 1.45.22 1.66-.78l3-14.13c.3-1.22-.47-1.78-1.38-1.42Zm-3.12 3.3-8.6 7.86-.34 3.6-1.73-5.3 10.1-6.4c.44-.28.84-.13.57.24Z" />
    </svg>
  );
}

/**
 * Знак Instagram — контурная рамка, объектив и вспышка.
 *
 * Бренд-иконки из lucide-react убраны начиная с 1.x, поэтому знак
 * нарисован вручную в той же манере (обводка 1.6, currentColor), чтобы
 * стоять в одном ряду с Telegram без визуального перекоса.
 */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.4" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Иконка соцсети по её id из `data/navigation`. */
export function SocialIcon({ id, className }: { id: SocialId; className?: string }) {
  if (id === 'telegram') {
    return <TelegramIcon className={cn('size-[18px]', className)} />;
  }

  return <InstagramIcon className={cn('size-[17px]', className)} />;
}
