'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { ResolvedImage, Teacher } from '@/types';
import { Media } from '@/components/ui/Media';

type TeacherModalProps = {
  teacher: Teacher;
  photo: ResolvedImage;
  onClose: () => void;
};

/**
 * Карточка преподавателя на весь экран: открывается по клику на карточку
 * в бегущей ленте (см. TeachersMarquee), закрывается по Esc, клику на фон
 * или на крестик. Логика фокуса и блокировки прокрутки — как в мобильном
 * меню (components/layout/Navbar.tsx).
 */
export function TeacherModal({ teacher, photo, onClose }: TeacherModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.dataset.locked = 'true';
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      delete document.body.dataset.locked;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={teacher.name}
      className="fixed inset-0 z-120 flex items-center justify-center bg-black/80 p-gutter"
      onClick={onClose}
    >
      <div
        className="relative grid max-h-[86vh] w-full max-w-[720px] grid-cols-1 overflow-y-auto bg-white sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-3 right-3 z-10 flex size-10 items-center justify-center bg-white/90 text-black transition-colors duration-200 ease-brand hover:bg-black hover:text-white"
        >
          <X aria-hidden="true" strokeWidth={1.5} className="size-[18px]" />
        </button>

        {/* Фото — карточка-плакат: сверху портрет (~60% высоты), ниже ФИО и
            справка, которые и так есть справа. Увеличиваем карточку так,
            чтобы в колонку попадал только портрет. */}
        <div className="relative aspect-4/5 overflow-hidden bg-cloud sm:aspect-auto sm:min-h-[420px]">
          <div className="absolute -top-[4%] left-1/2 aspect-[476/692] h-[176%] -translate-x-1/2">
            <Media image={photo} sizes="(max-width: 640px) 150vw, 480px" />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 p-[clamp(24px,4vw,40px)]">
          <h3 className="text-h3">{teacher.name}</h3>
          <p className="text-sm text-blue">{teacher.subject}</p>
          <p className="text-[13.5px] text-subtle">{teacher.role}</p>
          {teacher.bio ? (
            <p className="mt-2 text-[15px] leading-[1.65] text-muted">{teacher.bio}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
