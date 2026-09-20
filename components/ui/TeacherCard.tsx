import type { ResolvedImage, Teacher } from '@/types';
import { Media } from '@/components/ui/Media';
import { cn } from '@/lib/utils';

type TeacherCardProps = {
  teacher: Teacher;
  photo: ResolvedImage;
  sizes?: string;
};

/**
 * Карточка преподавателя: прямоугольный портрет, краткая справка при
 * наведении. Карточка фокусируется с клавиатуры — справка появляется
 * и по focus-visible, а на мобильных видна всегда.
 */
export function TeacherCard({
  teacher,
  photo,
  sizes = '(max-width: 560px) 60vw, (max-width: 900px) 33vw, 22vw'
}: TeacherCardProps) {
  const pending = teacher.name.startsWith('[');

  return (
    <article tabIndex={0} className="group outline-offset-4">
      <div className="relative mb-4 aspect-3/4 overflow-hidden bg-cloud">
        <Media
          image={photo}
          sizes={sizes}
          imageClassName="transition-transform duration-700 ease-out-brand group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
        />
        {teacher.bio ? (
          <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/80 to-transparent p-4 opacity-100 transition-opacity duration-500 ease-brand lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100">
            <p className="text-[13px] leading-snug text-white lg:translate-y-2 lg:text-sm lg:transition-transform lg:duration-700 lg:ease-out-brand lg:group-hover:translate-y-0 lg:group-focus-visible:translate-y-0">
              {teacher.bio}
            </p>
          </div>
        ) : null}
      </div>

      <h3
        className={cn(
          'mb-1.5 text-[clamp(16px,1.15vw,18px)] leading-tight font-bold tracking-[-0.015em]',
          pending && 'text-subtle'
        )}
      >
        {teacher.name}
      </h3>
      <p className="mb-0.5 text-sm text-blue">{teacher.subject}</p>
      <p className="text-[13.5px] text-subtle">{teacher.role}</p>
    </article>
  );
}
