'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { NavItem } from '@/types';
import { cn } from '@/lib/utils';

type Tone = 'dark' | 'light';

const panel: Record<Tone, string> = {
  dark: 'border-line bg-white text-black',
  light: 'border-white/15 bg-black/85 text-white backdrop-blur-md'
};

const option: Record<Tone, string> = {
  dark: 'hover:bg-cloud',
  light: 'hover:bg-white/10'
};

/** Задержка перед закрытием: курсор успевает дойти от пункта до списка. */
const CLOSE_DELAY = 140;

/**
 * Пункт шапки с выпадающим списком.
 *
 * Открывается тремя способами: наведением (desktop), нажатием (тач-экраны,
 * где hover не существует) и с клавиатуры — Tab заводит фокус внутрь,
 * Esc закрывает и возвращает фокус на кнопку. Закрытый список скрыт
 * через `visibility`, поэтому его ссылки выпадают из порядка табуляции.
 *
 * Триггер — кнопка, а не ссылка: собственная страница раздела идёт первой
 * строкой списка, так что по ней всё равно можно перейти, а по нажатию на
 * пункт не происходит неожиданного перехода вместо раскрытия.
 */
export function NavDropdown({
  item,
  tone,
  solid,
  isActive,
  linkClassName
}: {
  item: NavItem;
  tone: Tone;
  solid: boolean;
  isActive: (href: string) => boolean;
  linkClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const children = item.children ?? [];
  const active = children.some((child) => isActive(child.href));

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  // Таймер закрытия не должен пережить размонтирование компонента.
  useEffect(() => clearTimer, []);

  // Esc закрывает список и возвращает фокус на кнопку.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => {
        clearTimer();
        setOpen(true);
      }}
      onMouseLeave={() => {
        clearTimer();
        timerRef.current = setTimeout(() => setOpen(false), CLOSE_DELAY);
      }}
      onBlur={(event) => {
        // Фокус ушёл за пределы пункта — список больше не нужен.
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'group relative flex items-center gap-1 py-1.5 whitespace-nowrap',
          'transition-opacity duration-200 ease-brand',
          active ? cn('font-bold opacity-100', solid && 'text-blue') : 'opacity-80 hover:opacity-100',
          linkClassName
        )}
      >
        {item.label}
        <ChevronDown
          aria-hidden="true"
          strokeWidth={2}
          className={cn(
            'size-3.5 opacity-70 transition-transform duration-300 ease-brand',
            open && 'rotate-180'
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-x-0 bottom-0 h-px origin-left bg-current transition-transform duration-500 ease-out-brand',
            active || open ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
          )}
        />
      </button>

      {/* Отступ сверху — «мостик» под курсор между пунктом и списком. */}
      <div
        className={cn(
          'absolute top-full left-0 z-10 pt-3.5',
          'transition-[opacity,transform] duration-250 ease-brand',
          open
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-1 opacity-0'
        )}
      >
        <ul
          className={cn(
            'min-w-[214px] overflow-hidden rounded-xl border py-1.5',
            'shadow-[0_22px_48px_rgba(10,10,10,0.2)]',
            panel[tone]
          )}
        >
          {children.map((child) => (
            <li key={child.id}>
              <Link
                href={child.href}
                aria-current={isActive(child.href) ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  'block px-4 py-2.5 text-[14px] whitespace-nowrap transition-colors duration-200 ease-brand',
                  option[tone],
                  isActive(child.href) && cn('font-bold', tone === 'dark' ? 'text-blue' : 'text-blue-light')
                )}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
