import type { ResolvedImage } from '@/types';
import { TeacherFace } from '@/components/ui/TeacherPortrait';
import { cn } from '@/lib/utils';

type PersonCardProps = {
  photo: ResolvedImage;
  /** Значение sizes для next/image — ширина кадра, не печатного листа. */
  sizes: string;
  /** Справка в две строки над линией: о преподавателе или о сотруднике. */
  note: string;
  /** ФИО — крупной строкой. */
  name: string;
  /** Нижняя строка градиентом: предмет у преподавателя, должность у администрации. */
  meta: string;
  className?: string;
  priority?: boolean;
  quality?: number;
};

/**
 * Карточка человека — один дизайн на весь сайт: преподаватели (/teachers и
 * лента на главной) и сотрудники администрации (/administration).
 *
 * Тёмный плакат: кадр «лицо крупно», который растворяется в фоне карточки,
 * и подписи внизу — справка, ФИО и строка градиентом. Печатные карточки
 * преподавателей и администрации свёрстаны по одному шаблону, поэтому обе
 * кадрируются одним и тем же `TeacherFace`.
 *
 * Сама карточка не кликабельна: её оборачивают в <Link> там, где у человека
 * есть персональная страница. Эффект наведения живёт на родителе через
 * `group`, поэтому карточка одинаково реагирует и внутри ссылки, и без неё.
 */
export function PersonCard({
  photo,
  sizes,
  note,
  name,
  meta,
  className,
  priority,
  quality
}: PersonCardProps) {
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
          priority={priority}
          quality={quality}
          className="aspect-5/4 transition-transform duration-500 ease-brand group-hover:scale-105"
        />
        {/* Низ кадра растворяется в чёрном — граница фотографии не читается. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 block h-2/5 bg-linear-to-t from-black to-transparent"
        />
      </span>

      <span className="flex flex-1 flex-col px-3.5 pt-1 pb-3.5">
        {/* line-clamp держится на display: -webkit-box, а прямой ребёнок flex-контейнера
            его теряет (блокификация) — поэтому обрезаемый текст лежит во вложенном span. */}
        <span className="block border-b border-white/20 pb-3">
          <span className="line-clamp-2 text-[12.5px] leading-[1.5] text-white/80">{note}</span>
        </span>

        <span className="mt-auto block pt-3 text-[14px] leading-[1.3] font-bold">{name}</span>
        <span className="mt-1 block bg-linear-to-r from-blue-light via-[#a9c4f5] to-blue-hover bg-clip-text text-[12px] font-bold text-transparent">
          {meta}
        </span>
      </span>
    </span>
  );
}
