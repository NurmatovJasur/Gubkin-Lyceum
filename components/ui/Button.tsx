import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'dark' | 'light' | 'ghost' | 'light-ghost' | 'dark-ghost';
type Size = 'sm' | 'md' | 'lg';

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Стрелка справа. Для телефонных ссылок обычно не нужна. */
  arrow?: boolean;
  block?: boolean;
  className?: string;
  'aria-label'?: string;
};

const base =
  'group inline-flex items-center justify-center gap-3 rounded-edge border border-transparent font-bold whitespace-nowrap ' +
  'transition-[background-color,color,border-color] duration-200 ease-brand';

const variants: Record<Variant, string> = {
  primary: 'bg-blue text-white hover:bg-blue-hover',
  dark: 'bg-black text-white hover:bg-ink',
  light: 'bg-white text-black hover:bg-cloud',
  ghost: 'border-line-strong text-black hover:border-black hover:bg-black hover:text-white',
  'light-ghost': 'border-white/55 text-white hover:border-white hover:bg-white hover:text-black',
  'dark-ghost': 'border-white/40 text-white hover:border-white hover:bg-white hover:text-black'
};

const sizes: Record<Size, string> = {
  sm: 'h-[42px] px-[18px] text-[13.5px]',
  md: 'h-[52px] px-6 text-[15px]',
  lg: 'h-[60px] px-[30px] text-base'
};

/**
 * Кнопка-ссылка. Внешние ссылки (tel:, http:) идут обычным <a>,
 * внутренние — через next/link для мгновенной навигации.
 */
export function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  arrow = true,
  block = false,
  className,
  ...rest
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], block && 'flex w-full', className);

  const content = (
    <>
      <span>{children}</span>
      {arrow ? (
        <ArrowRight
          aria-hidden="true"
          strokeWidth={1.5}
          className="size-[18px] transition-transform duration-500 ease-out-brand group-hover:translate-x-[5px]"
        />
      ) : null}
    </>
  );

  const isExternal = /^(https?:|tel:|mailto:)/.test(href);

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        {...(href.startsWith('http')
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}

/** Текстовая ссылка со стрелкой — для editorial-блоков. */
export function TextLink({
  href,
  children,
  className
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-[10px] border-b border-line-strong pb-1 text-[15px] font-bold',
        'transition-colors duration-200 ease-brand hover:border-blue hover:text-blue',
        className
      )}
    >
      <span>{children}</span>
      <ArrowRight
        aria-hidden="true"
        strokeWidth={1.5}
        className="size-4 transition-transform duration-500 ease-out-brand group-hover:translate-x-[5px]"
      />
    </Link>
  );
}
