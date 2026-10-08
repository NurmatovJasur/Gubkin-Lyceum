'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Menu, Phone, X } from 'lucide-react';
import { mainNav } from '@/data/navigation';
import { site, mapLink } from '@/site.config';
import { Brand } from '@/components/layout/Brand';
import { NavDropdown } from '@/components/layout/NavDropdown';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { LangSwitcher } from '@/components/ui/LangSwitcher';
import { cn } from '@/lib/utils';

/**
 * Шапка сайта.
 *
 * Симметричная раскладка в три зоны: слева разделы, по центру знак лицея,
 * справа соцсети, телефон и выбор языка. Центр держится на сетке
 * `1fr auto 1fr` — знак стоит ровно по оси страницы независимо от того,
 * сколько места заняли ссылки.
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
  const tone = solid ? 'dark' : 'light';

  /*
   * Размер ссылок подобран под самую узкую десктопную ширину (1180px):
   * на ней пять пунктов должны уместиться слева от центрального знака,
   * не задев его. С 1440px места хватает на обычные 14px.
   */
  const navLink = 'text-[12.5px] 2xl:text-[14px]';

  /*
   * Круглые кнопки-иконки справа (карта, телефон). Вид тот же, что у
   * иконок соцсетей, поэтому весь ряд читается как один блок. Класс
   * display здесь не задаётся — у каждой кнопки свои точки показа.
   */
  const iconCircle = cn(
    'size-9 shrink-0 items-center justify-center rounded-full border',
    'transition-[background-color,border-color,color] duration-200 ease-brand',
    solid
      ? 'border-line text-black/70 hover:border-black hover:bg-black hover:text-white'
      : 'border-white/30 text-white/85 hover:border-white hover:bg-white hover:text-black'
  );

  /** В мобильной панели выпадающий список разворачивается в обычные строки. */
  const flatNav = mainNav.flatMap((item) => item.children ?? [item]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-100 border-b transition-[background-color,border-color,color] duration-500 ease-brand',
        solid ? 'border-line bg-white text-black' : 'border-white/15 bg-transparent text-white'
      )}
    >
      <div
        className={cn(
          'mx-auto grid w-full max-w-site grid-cols-[minmax(0,1fr)_auto] items-center gap-3',
          'px-gutter transition-[height] duration-500 ease-brand',
          'xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:gap-6',
          solid ? 'h-[76px]' : 'h-nav'
        )}
      >
        {/* Слева от центра: разделы сайта. */}
        <nav
          aria-label="Основная навигация"
          className="hidden items-center gap-x-[clamp(10px,1.1vw,22px)] xl:col-start-1 xl:row-start-1 xl:flex"
        >
          {mainNav.map((item) =>
            item.children ? (
              <NavDropdown
                key={item.id}
                item={item}
                tone={tone}
                solid={solid}
                isActive={isActive}
                linkClassName={navLink}
              />
            ) : (
              <Link
                key={item.id}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'group relative py-1.5 whitespace-nowrap transition-opacity duration-200 ease-brand',
                  navLink,
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
            )
          )}
        </nav>

        {/*
          Знак лицея. На десктопе он стоит на оси страницы, на телефоне —
          слева вместе с названием: в одиночку круглая эмблема повторяет
          такую же эмблему в первом экране, и шапка читается как дубль.
        */}
        <Brand
          logo={logo}
          compact={solid}
          className="col-start-1 row-start-1 justify-self-start xl:col-start-2 xl:justify-self-center"
          /* Уже 360px название не помещается рядом с языком и меню —
             там остаётся только знак, а не обрезанная многоточием строка. */
          labelClassName="max-[359px]:hidden"
        />

        {/* Справа: соцсети, телефон, язык и кнопка меню. */}
        <div className="col-start-2 row-start-1 flex items-center justify-end gap-2 xl:col-start-3 xl:gap-[clamp(10px,1.1vw,18px)]">
          <SocialLinks tone={tone} className="max-xl:hidden" />

          {/*
            Адрес лицея на карте — отдельная иконка после соцсетей:
            открывает Яндекс.Карты по тому же запросу, что секция контактов.
          */}
          <a
            href={mapLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Лицей на карте: ${site.contacts.addressFull}`}
            title={site.contacts.addressFull}
            className={cn('hidden xl:flex', iconCircle)}
          >
            <MapPin aria-hidden="true" strokeWidth={1.7} className="size-[16px]" />
          </a>

          {/*
            До 1440px полный номер не помещается рядом с семью разделами —
            вместо него круглая иконка с тем же tel:-адресом, чтобы связь
            оставалась в один клик на любой ширине.
          */}
          <a
            href={site.contacts.phoneHref}
            aria-label={`Позвонить: ${site.contacts.phone}`}
            className={cn('hidden xl:flex 2xl:hidden', iconCircle)}
          >
            <Phone aria-hidden="true" strokeWidth={1.7} className="size-[15px]" />
          </a>

          <a
            href={site.contacts.phoneHref}
            className={cn(
              'hidden border-b pb-0.5 text-[14px] font-bold tracking-[-0.01em] whitespace-nowrap',
              'transition-colors duration-200 ease-brand 2xl:block',
              solid ? 'border-line-strong hover:border-black' : 'border-white/35 hover:border-white'
            )}
          >
            {site.contacts.phone}
          </a>

          <LangSwitcher tone={tone} />

          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            onClick={() => setOpen((value) => !value)}
            className="-mr-2.5 flex size-11 shrink-0 items-center justify-center xl:hidden"
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
          {flatNav.map((item, index) => (
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

        <div className="grid gap-5">
          <div className="grid gap-3.5">
            <a href={site.contacts.phoneHref} className="text-xl font-bold tracking-[-0.01em]">
              {site.contacts.phone}
            </a>
            {/* Адрес в мобильной панели ведёт на ту же карту, что иконка в шапке. */}
            <a
              href={mapLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-sm text-muted"
            >
              <MapPin aria-hidden="true" strokeWidth={1.7} className="mt-px size-4 shrink-0" />
              <span>{site.contacts.addressFull}</span>
            </a>
          </div>
          <SocialLinks tone="dark" />
        </div>
      </div>
    </header>
  );
}
