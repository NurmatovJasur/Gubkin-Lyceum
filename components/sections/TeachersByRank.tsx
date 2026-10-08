import Link from 'next/link';
import type { ResolvedImage, Teacher, TeacherRank } from '@/types';
import { TeacherCard } from '@/components/ui/TeacherCard';

type Card = { teacher: Teacher; photo: ResolvedImage };
type Group = { id: TeacherRank; label: string; cards: Card[] };

/**
 * Страница /teachers: преподаватели по званиям — от профессоров до
 * старших преподавателей. Клик по карточке ведёт на персональную
 * страницу /teachers/<slug>.
 *
 * Пустые группы на страницу не попадают — их отбрасывает
 * app/teachers/page.tsx, здесь остаётся только вывод.
 */
export function TeachersByRank({ groups }: { groups: Group[] }) {
  return (
    <div className="flex flex-col gap-[clamp(56px,7vw,112px)]">
      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`rank-${group.id}`}>
          <header className="mb-[clamp(24px,3vw,40px)] flex items-end justify-between gap-6 border-b border-line pb-5">
            <h2 id={`rank-${group.id}`} className="text-h3">
              {group.label}
            </h2>
            <p className="shrink-0 text-sm text-subtle">{group.cards.length}</p>
          </header>

          <ul className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
            {group.cards.map((card) => (
              <li key={card.teacher.id} className="h-full">
                <Link
                  href={`/teachers/${card.teacher.slug}`}
                  aria-label={card.teacher.name}
                  className="group block h-full outline-offset-4"
                >
                  <TeacherCard
                    teacher={card.teacher}
                    photo={card.photo}
                    sizes="(max-width: 560px) 50vw, (max-width: 900px) 33vw, 300px"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
