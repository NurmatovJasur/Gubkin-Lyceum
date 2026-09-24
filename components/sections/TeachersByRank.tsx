'use client';

import { useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import type { ResolvedImage, Teacher, TeacherRank } from '@/types';
import { Media } from '@/components/ui/Media';
import { TeacherModal } from '@/components/ui/TeacherModal';

type Card = { teacher: Teacher; photo: ResolvedImage };
type Group = { id: TeacherRank; label: string; cards: Card[] };

/**
 * Слова в нижнем регистре, «ё» → «е»: «Муравлева» найдёт «Муравлёва».
 * Дефис тоже разделяет слова — на случай двойных фамилий.
 */
const toWords = (text: string) =>
  text.toLowerCase().replace(/ё/g, 'е').split(/[\s-]+/).filter(Boolean);

/**
 * Страница /teachers: преподаватели по званиям — от профессора до
 * преподавателя, затем специалисты лицея. Клик по портрету открывает
 * ту же карточку, что и в бегущей ленте на главной (TeacherModal).
 *
 * Поиск по ФИО: каждое слово запроса должно быть началом фамилии, имени
 * или отчества, порядок не важен («Наиля Абдул» найдёт «Абдулхаликова
 * Наиля Ранилевна», а «аб» не найдёт «Атабекову»). Пустые группы скрываются.
 */
export function TeachersByRank({ groups }: { groups: Group[] }) {
  const [active, setActive] = useState<Card | null>(null);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const visible = useMemo(() => {
    const words = toWords(query);
    if (words.length === 0) return groups;
    return groups
      .map((group) => ({
        ...group,
        cards: group.cards.filter((card) => {
          const name = toWords(card.teacher.name);
          return words.every((word) => name.some((part) => part.startsWith(word)));
        })
      }))
      .filter((group) => group.cards.length > 0);
  }, [groups, query]);

  return (
    <div className="flex flex-col gap-[clamp(56px,7vw,112px)]">
      <div role="search" className="relative max-w-[520px]">
        <Search
          aria-hidden="true"
          strokeWidth={1.5}
          className="pointer-events-none absolute top-1/2 left-0 size-5 -translate-y-1/2 text-subtle"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск по ФИО преподавателя"
          aria-label="Поиск по ФИО преподавателя"
          className="w-full border-b border-line-strong bg-transparent py-3 pr-10 pl-8 text-body text-black outline-none transition-colors duration-200 ease-brand placeholder:text-subtle focus:border-black [&::-webkit-search-cancel-button]:hidden"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Очистить поиск"
            className="absolute top-1/2 right-0 flex size-9 -translate-y-1/2 items-center justify-center text-subtle transition-colors duration-200 ease-brand hover:text-black"
          >
            <X aria-hidden="true" strokeWidth={1.5} className="size-[18px]" />
          </button>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <p aria-live="polite" className="text-body text-muted">
          По запросу «{query.trim()}» никого не нашлось.
        </p>
      ) : null}

      {visible.map((group) => (
        <section key={group.id} aria-labelledby={`rank-${group.id}`}>
          <header className="mb-[clamp(24px,3vw,40px)] flex items-end justify-between gap-6 border-b border-line pb-5">
            <h2 id={`rank-${group.id}`} className="text-h3">
              {group.label}
            </h2>
            <p className="shrink-0 text-sm text-subtle">{group.cards.length}</p>
          </header>

          <ul className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {group.cards.map((card) => (
              <li key={card.teacher.id}>
                <button
                  type="button"
                  aria-label={card.teacher.name}
                  onClick={() => setActive(card)}
                  className="group block w-full outline-offset-4"
                >
                  {/* ФИО и звание напечатаны на самой карточке; пропорции и срез каймы — как в TeachersMarquee. */}
                  <span className="relative block aspect-[488/688] overflow-hidden bg-cloud">
                    <span className="absolute -inset-1 block transition-transform duration-500 ease-brand group-hover:scale-[1.03]">
                      <Media image={card.photo} sizes="(max-width: 640px) 50vw, 260px" />
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {active ? (
        <TeacherModal
          teacher={active.teacher}
          photo={active.photo}
          onClose={() => setActive(null)}
        />
      ) : null}
    </div>
  );
}
