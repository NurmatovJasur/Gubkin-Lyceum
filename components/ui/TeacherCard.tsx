import type { ResolvedImage, Teacher } from '@/types';
import { PersonCard } from '@/components/ui/PersonCard';

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
 * Карточка преподавателя: общий дизайн карточек людей (см. PersonCard) с
 * началом справки, ФИО и предметом градиентом.
 *
 * Справка обрезана многоточием: это намёк, что карточка кликабельна и
 * целиком текст — на персональной странице преподавателя.
 */
export function TeacherCard({ teacher, photo, sizes, className }: TeacherCardProps) {
  return (
    <PersonCard
      photo={photo}
      sizes={sizes}
      note={excerpt(teacher.bio ?? teacher.role)}
      name={teacher.name}
      meta={teacher.subject}
      className={className}
    />
  );
}
