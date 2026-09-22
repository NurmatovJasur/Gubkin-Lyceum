'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { mainNav } from '@/data/navigation';
import { site } from '@/site.config';
import { Brand } from '@/components/layout/Brand';
import { cn } from '@/lib/utils';

/**
 * Шапка сайта: плавающая полупрозрачная капсула поверх контента —
 * один и тот же стеклянный стиль на любой странице и при любой
 * прокрутке (без переключения на сплошной белый фон).
 *
 * На мобильных и планшетах (< xl) капсула сжимается до логотипа и
 * кнопки-гамбургера; список ссылок раскрывается отдельной панелью
 * того же стиля прямо под капсулой.
 *
 * Client Component: нужен доступ к текущему маршруту и клавиатуре.
 */
export function Navbar({ logo }: { logo: string | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Esc, блокировка прокрутки и возврат фокуса.
  useEffect(() => {
    if (!open) return;

    document.body.dataset.locked = 'true';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    panelRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      delete document.body.dataset.locked;
    };
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-0 z-100">
      {/* Затемнение страницы под открытой мобильной панелью. */}
      <div
        hidden={!open}
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm xl:hidden"
      />

      <div className="relative mx-auto w-full max-w-site px-gutter pt-4 sm:pt-5 lg:pt-6">
        <div className="flex h-14 items-center gap-5 rounded-full border border-white/15 bg-black/55 px-5 text-white shadow-lg shadow-black/25 backdrop-blur-xl sm:h-16 sm:px-6 xl:gap-8">
          <Brand logo={logo} compact className="mr-auto" />

          <nav aria-label="Основная навигация" className="hidden items-center gap-5 xl:flex">
            {mainNav.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'group relative py-1.5 text-[14.5px] transition-opacity duration-200 ease-brand',
                  isActive(item.href)
                    ? 'font-bold text-blue-light opacity-100'
                    : 'opacity-80 hover:opacity-100'
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute inset-x-0 bottom-0 h-px origin-left bg-current transition-transform duration-500 ease-out-brand',
                    isActive(item.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  )}
                />
              </Link>
            ))}
          </nav>

          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            onClick={() => setOpen((value) => !value)}
            className="-mr-1.5 flex size-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 transition-colors duration-200 ease-brand hover:bg-white/15 xl:hidden"
          >
            {open ? (
              <X aria-hidden="true" strokeWidth={1.5} className="size-[18px]" />
            ) : (
              <Menu aria-hidden="true" strokeWidth={1.5} className="size-[18px]" />
            )}
          </button>
        </div>

        {/* Мобильная панель: та же стеклянная капсула, разворачивается под шапкой. */}
        <div
          ref={panelRef}
          id="mobile-menu"
          hidden={!open}
          className="mt-3 max-h-[calc(100svh-140px)] overflow-y-auto rounded-[28px] border border-white/15 bg-black/80 px-gutter pt-2 pb-[calc(28px+env(safe-area-inset-bottom,0px))] text-white shadow-lg shadow-black/25 backdrop-blur-xl xl:hidden"
        >
          <nav aria-label="Мобильная навигация" className="grid divide-y divide-white/15 border-b border-white/15">
            {mainNav.map((item, index) => (
              <Link
                key={item.id}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-baseline gap-4 py-[16px] text-[clamp(20px,6vw,26px)] font-bold tracking-[-0.02em] transition-colors duration-200',
                  isActive(item.href) && 'text-blue-light'
                )}
              >
                <span aria-hidden="true" className="text-xs font-normal tracking-[0.1em] text-white/50">
                  0{index + 1}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-6 grid gap-3.5">
            <a href={site.contacts.phoneHref} className="text-xl font-bold tracking-[-0.01em]">
              {site.contacts.phone}
            </a>
            <p className="text-sm text-white/70">{site.contacts.addressFull}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
