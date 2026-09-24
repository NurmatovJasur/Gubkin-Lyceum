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
 * Шапка сайта.
 *
 * Прозрачная поверх тёмного hero и белая после прокрутки. Мобильное меню
 * полностью доступно с клавиатуры: Esc закрывает, фокус возвращается на
 * кнопку, фон страницы блокируется от прокрутки.
 *
 * Client Component: нужен доступ к скроллу, текущему маршруту и клавиатуре.
 */
export function Navbar({ logo }: { logo: string | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  /** Страницы с тёмным полноэкранным hero — шапка над ними прозрачная. */
  const overlay = pathname === '/' || /^\/directions\/[^/]+$/.test(pathname);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Фон шапки после небольшой прокрутки.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  const solid = !overlay || scrolled || open;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-100 border-b transition-[background-color,border-color,color] duration-500 ease-brand',
        solid ? 'border-line bg-white text-black' : 'border-transparent bg-transparent text-white'
      )}
    >
      <div
        className={cn(
          'mx-auto flex w-full max-w-site items-center gap-5 px-gutter transition-[height] duration-500 ease-brand xl:gap-8',
          solid ? 'h-[76px]' : 'h-nav'
        )}
      >
        <Brand logo={logo} className="mr-auto" compact={solid} />

        <nav aria-label="Основная навигация" className="hidden items-center gap-5 xl:flex">
          {mainNav.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cn(
                'group relative py-1.5 text-[14.5px] transition-opacity duration-200 ease-brand',
                isActive(item.href)
                  ? cn('font-bold opacity-100', solid && 'text-blue')
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

        <div className="flex items-center gap-3.5 xl:hidden">
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            onClick={() => setOpen((value) => !value)}
            className="-mr-2.5 flex size-11 items-center justify-center xl:hidden"
          >
            {open ? (
              <X aria-hidden="true" strokeWidth={1.5} className="size-6" />
            ) : (
              <Menu aria-hidden="true" strokeWidth={1.5} className="size-6" />
            )}
          </button>
        </div>
      </div>

      {/* Мобильная панель */}
      <div
        ref={panelRef}
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-[76px] bottom-0 z-110 flex flex-col justify-between gap-8 overflow-y-auto bg-white px-gutter pt-8 pb-[calc(32px+env(safe-area-inset-bottom,0px))] text-black xl:hidden"
      >
        <nav aria-label="Мобильная навигация" className="grid border-t border-line">
          {mainNav.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-baseline gap-4 border-b border-line py-[18px] text-[clamp(22px,6vw,30px)] font-bold tracking-[-0.02em] transition-colors duration-200',
                isActive(item.href) && 'text-blue'
              )}
            >
              <span aria-hidden="true" className="text-xs font-normal tracking-[0.1em] text-subtle">
                0{index + 1}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="grid gap-3.5">
          <a href={site.contacts.phoneHref} className="text-xl font-bold tracking-[-0.01em]">
            {site.contacts.phone}
          </a>
          <p className="text-sm text-muted">{site.contacts.addressFull}</p>
        </div>
      </div>
    </header>
  );
}
