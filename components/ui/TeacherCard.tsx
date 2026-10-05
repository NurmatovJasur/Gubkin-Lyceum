import type { ResolvedImage, Teacher } from '@/types';
import { TeacherFace } from '@/components/ui/TeacherPortrait';
import { cn } from '@/lib/utils';

type TeacherCardProps = {
  teacher: Teacher;
  photo: ResolvedImage;
  sizes: string;
  className?: string;
};

/** Длина анонса: обрезаем по границе слова и ставим многоточие. */
const LIMIT = 76;

const excerpt = (text: string): string => {
  if (text.length <= LIMIT) return text;
  const cut = text.slice(0, LIMIT);
  const space = cut.lastIndexOf(' ');
  return `${(space > 40 ? cut.slice(0, space) : cut).replace(/[.,;:—-]$/, '')}…`;
};

/**
 * Карточка преподавателя: тёмный плакат с кадром «лицо крупно», который
 * растворяется в фоне карточки, и подписью внизу — начало справки, ФИО
 * и предмет градиентом.
 *
 * Справка обрезана многоточием: это намёк, что карточка кликабельна и
 * целиком текст — на персональной странице преподавателя.
 *
 * Сама карточка не кликабельна: её оборачивают в <Link> на
 * /teachers/<slug>. Эффект наведения живёт на родителе через `group`.
 */
export function TeacherCard({ teacher, photo, sizes, className }: TeacherCardProps) {
  return (
    <span
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-media bg-black text-left text-white',
        'transition-colors duration-300 ease-brand group-hover:bg-ink',
        className
      )}
    >
      <span className="relative block overflow-hidden rounded-media">
        <TeacherFace
          photo={photo}
          sizes={sizes}
          className="aspect-5/4 transition-transform duration-500 ease-brand group-hover:scale-105"
        />
        {/* Низ кадра растворяется в чёрном — граница фотографии не читается. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 block h-2/5 bg-linear-to-t from-black to-transparent"
        />
      </span>

      <span className="flex flex-1 flex-col px-3.5 pb-3.5">
        {/* line-clamp держится на display: -webkit-box, а прямой ребёнок flex-контейнера
            его теряет (блокификация) — поэтому обрезаемый текст лежит во вложенном span. */}
        <span className="block border-b border-white/20 pb-3">
          <span className="line-clamp-2 text-[12.5px] leading-[1.5] text-white/80">
            {excerpt(teacher.bio ?? teacher.role)}
          </span>
        </span>

        <span className="mt-auto block pt-3 text-[14px] leading-[1.3] font-bold">
          {teacher.name}
        </span>
        <span className="mt-1 block bg-linear-to-r from-blue-light via-[#a9c4f5] to-blue-hover bg-clip-text text-[12px] font-bold text-transparent">
          {teacher.subject}
        </span>
      </span>
    </span>
  );
}
