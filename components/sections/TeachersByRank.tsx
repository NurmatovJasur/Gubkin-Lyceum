'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import type { ResolvedImage, Teacher, TeacherRank } from '@/types';
import { TeacherCard } from '@/components/ui/TeacherCard';

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
 * преподавателя, затем специалисты лицея. Клик по карточке ведёт на
 * персональную страницу /teachers/<slug>.
 *
 * Поиск по ФИО: каждое слово запроса должно быть началом фамилии, имени
 * или отчества, порядок не важен («Наиля Абдул» найдёт «Абдулхаликова
 * Наиля Ранилевна», а «аб» не найдёт «Атабекову»). Пустые группы скрываются.
 */
export function TeachersByRank({ groups }: { groups: Group[] }) {
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
