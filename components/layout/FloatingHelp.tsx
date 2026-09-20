'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { HelpCircle, X } from 'lucide-react';
import { site } from '@/site.config';
import { cn } from '@/lib/utils';

/**
 * Плавающая кнопка помощи: телефон, Telegram, переход к контактам.
 * Закрывается по Esc и по клику вне меню, фокус возвращается на кнопку.
 */
export function FloatingHelp() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onClick = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    };

    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={root}
      className="fixed right-4 bottom-[calc(16px+env(safe-area-inset-bottom,0px))] z-120 flex flex-col items-end gap-3 sm:right-8 sm:bottom-8"
    >
      <div
        id="help-menu"
        hidden={!open}
        className="w-[min(280px,calc(100vw-32px))] border border-line bg-white shadow-[0_18px_50px_rgba(10,10,10,0.14)]"
      >
        <a
          href={site.contacts.phoneHref}
          className="grid gap-[3px] border-b border-line p-4 transition-colors duration-200 hover:bg-cloud"
        >
          <span className="text-label text-subtle uppercase">Позвонить</span>
          <span className="text-[15px] font-bold tracking-[-0.01em]">{site.contacts.phone}</span>
        </a>

        {site.contacts.telegram ? (
          <a
            href={site.contacts.telegram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="grid gap-[3px] border-b border-line p-4 transition-colors duration-200 hover:bg-cloud"
          >
            <span className="text-label text-subtle uppercase">Telegram</span>
            <span className="text-[15px] font-bold tracking-[-0.01em]">
              {site.contacts.telegram.label}
            </span>
          </a>
        ) : (
          /* [ТРЕБУЕТСЯ УТОЧНЕНИЕ] — официальный Telegram лицея */
          <span className="grid gap-[3px] border-b border-line p-4">
            <span className="text-label text-subtle uppercase">Telegram</span>
            <span className="text-[15px] text-subtle">[ТРЕБУЕТСЯ УТОЧНЕНИЕ]</span>
          </span>
        )}

        <Link
          href="/contacts"
          className="grid gap-[3px] p-4 transition-colors duration-200 hover:bg-cloud"
        >
          <span className="text-label text-subtle uppercase">Задать вопрос</span>
          <span className="text-[15px] font-bold tracking-[-0.01em]">Контакты лицея</span>
        </Link>
      </div>

      <button
        ref={toggle}
        type="button"
        aria-expanded={open}
        aria-controls="help-menu"
        aria-label={open ? 'Закрыть меню помощи' : 'Помощь и контакты'}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'flex size-[50px] items-center justify-center rounded-edge text-white shadow-[0_10px_30px_rgba(10,10,10,0.18)] transition-colors duration-200 ease-brand sm:size-14',
          open ? 'bg-blue' : 'bg-black hover:bg-blue'
        )}
      >
        {open ? (
          <X aria-hidden="true" strokeWidth={1.5} className="size-5" />
        ) : (
          <HelpCircle aria-hidden="true" strokeWidth={1.5} className="size-6" />
        )}
      </button>
    </div>
  );
}
