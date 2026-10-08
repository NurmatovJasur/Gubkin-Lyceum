import type { ElementType, ReactNode } from 'react';
import type { PolymorphicTag } from '@/types';
import { cn } from '@/lib/utils';

/** Контейнер сетки: max-width 1440px + боковые поля из дизайн-системы. */
export function Container({
  children,
  className,
  as = 'div'
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const Tag = as as PolymorphicTag;

  return (
    <Tag className={cn('mx-auto w-full max-w-site px-gutter', className)}>{children}</Tag>
  );
}

/** Секция с вертикальным ритмом дизайн-системы. */
export function Section({
  children,
  className,
  id,
  'aria-label': ariaLabel,
  as = 'section'
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  'aria-label'?: string;
  as?: ElementType;
}) {
  const Tag = as as PolymorphicTag;

  return (
    <Tag id={id} aria-label={ariaLabel} className={cn('py-section', className)}>
      {children}
    </Tag>
  );
}
