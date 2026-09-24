import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/animations/Reveal';

/** Многострочный заголовок: перенос строк сохраняется по замыслу макета. */
export function Lines({ lines }: { lines: readonly string[] | string }) {
  const items = Array.isArray(lines) ? lines : [lines as string];
  return (
    <>
      {items.map((line, index) => (
        <span key={line} className="block">
          {line}
          {index < items.length - 1 ? ' ' : null}
        </span>
      ))}
    </>
  );
}

type SectionHeadingProps = {
  heading: readonly string[] | string;
  text?: string;
  /** Уровень заголовка: на внутренних страницах бывает h1. */
  level?: 1 | 2;
  /** Двухколоночная раскладка: заголовок слева, описание справа. */
  split?: boolean;
  tone?: 'dark' | 'light';
  className?: string;
  children?: ReactNode;
};

/** Заголовок секции — единый ритм для всех блоков сайта. */
export function SectionHeading({
  heading,
  text,
  level = 2,
  split = false,
  tone = 'dark',
  className,
  children
}: SectionHeadingProps) {
  const Tag = level === 1 ? 'h1' : 'h2';

  return (
    <Reveal
      as="header"
      className={cn(
        'mb-[clamp(40px,5vw,72px)]',
        split && 'lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-end lg:gap-20',
        className
      )}
    >
      <Tag
        className={cn(
          'text-h2',
          level === 1 && 'text-h1',
          tone === 'light' ? 'text-white' : 'text-black'
        )}
      >
        <Lines lines={heading} />
      </Tag>

      {text ? (
        <p
          className={cn(
            'mt-5 max-w-[46ch] text-body',
            tone === 'light' ? 'text-white/70' : 'text-muted',
            split && 'lg:mt-0 lg:pb-2'
          )}
        >
          {text}
        </p>
      ) : null}

      {children}
    </Reveal>
  );
}
