'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { languages, type Language } from '@/data/navigation';
import { cn } from '@/lib/utils';

type Tone = 'dark' | 'light';

const trigger: Record<Tone, string> = {
  dark: 'border-line text-black hover:border-black',
  light: 'border-white/30 text-white hover:border-white'
};

const panel: Record<Tone, string> = {
  dark: 'border-line bg-white text-black',
  light: 'border-white/15 bg-black/85 text-white backdrop-blur-md'
};

/** Ключ выбранного языка в localStorage. */
const STORAGE_KEY = 'gubkin:lang';

/*
 * Выбранный язык — внешнее для React хранилище: он переживает переходы
 * между страницами и один на все копии переключателя (шапка, подвал,
 * соседняя вкладка). Поэтому компонент не держит его в useState, а
 * подписывается на localStorage через useSyncExternalStore: на сервере
 * снимок всегда `null`, и разметка первого рендера совпадает с клиентской.
 */
const subscribers = new Set<() => void>();

const notify = () => subscribers.forEach((callback) => callback());

function subscribeToLanguage(callback: () => void) {
  subscribers.add(callback);
  // События storage приходят из других вкладок — там свой экземпляр Set.
  window.addEventListener('storage', callback);

  return () => {
    subscribers.delete(callback);
    window.removeEventListener('storage', callback);
  };
}

function readStoredLanguage(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Доступ к хранилищу закрыт настройками браузера.
    return null;
  }
}

/** На сервере выбора ещё нет — отдаём язык по умолчанию. */
const readServerLanguage = () => null;

const option: Record<Tone, string> = {
  dark: 'hover:bg-cloud',
  light: 'hover:bg-white/10'
};

/**
 * Переключатель языка в шапке.
 *
 * ВНИМАНИЕ: сейчас это только интерфейс. Переводов на сайте ещё нет,
 * поэтому выбор лишь запоминается в localStorage и не меняет контент —
 * выдуманные маршруты `/uz` и `/en` не создаются. Когда появятся локали,
 * достаточно дописать в `select` переход по маршруту языка
 * (см. комментарий к `languages` в data/navigation.ts).
 *
 * Client Component: нужны открытие списка, клавиатура и клик вне меню.
 */
export function LangSwitcher({ tone = 'dark', className }: { tone?: Tone; className?: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const storedCode = useSyncExternalStore(
    subscribeToLanguage,
    readStoredLanguage,
    readServerLanguage
  );

  const current: Language =
    languages.find((language) => language.code === storedCode) ?? languages[0];

  const select = (language: Language) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, language.code);
    } catch {
      // Приватный режим браузера: запись недоступна, выбор не сохраняется.
    }
    notify();
  };

  // Клик вне меню и Esc закрывают список, фокус возвращается на кнопку.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Язык сайта: ${current.label}`}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'flex h-9 items-center gap-1.5 rounded-full border pr-2 pl-2.5',
          'text-[12px] font-bold tracking-[0.08em] uppercase',
          'transition-[background-color,border-color,color] duration-200 ease-brand',
          trigger[tone]
        )}
      >
        <Globe aria-hidden="true" strokeWidth={1.6} className="size-[15px] opacity-80" />
        <span>{current.short}</span>
        <ChevronDown
          aria-hidden="true"
          strokeWidth={2}
          className={cn(
            'size-3.5 opacity-70 transition-transform duration-300 ease-brand',
            open && 'rotate-180'
          )}
        />
      </button>

      <div
        role="menu"
        aria-label="Язык сайта"
        hidden={!open}
        className={cn(
          'absolute top-[calc(100%+10px)] right-0 z-10 min-w-[168px] overflow-hidden',
          'rounded-xl border py-1 shadow-[0_20px_44px_rgba(10,10,10,0.18)]',
          panel[tone]
        )}
      >
        {languages.map((language) => {
          const active = language.code === current.code;

          return (
            <button
              key={language.code}
              type="button"
              role="menuitemradio"
              aria-checked={active}
              onClick={() => {
                select(language);
                setOpen(false);
                buttonRef.current?.focus();
              }}
              className={cn(
                'flex w-full items-center justify-between gap-5 px-3.5 py-2.5 text-left text-[14px]',
                'transition-colors duration-200 ease-brand',
                option[tone],
                active && 'font-bold'
              )}
            >
              <span className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="w-[30px] shrink-0 text-[11px] tracking-[0.1em] uppercase opacity-55"
                >
                  {language.short}
                </span>
                {language.label}
              </span>
              {active ? (
                <Check
                  aria-hidden="true"
                  strokeWidth={2}
                  className={cn('size-4', tone === 'dark' ? 'text-blue' : 'text-blue-light')}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
