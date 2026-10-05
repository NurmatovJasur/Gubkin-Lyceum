/**
 * Знаки направлений для карточек секции «Направления и программы».
 *
 * Рисунок повторяет манеру оригинала (newuu.uz): квадрат 70×70, сплошная
 * заливка без обводки у «тяжёлых» форм, толстые скруглённые линии — у
 * линейных. Цвет не задаётся здесь: `fill`/`color` приходят из
 * Programs.module.css (`.cardIcon svg`), поэтому знак одинаково работает
 * и на светлой подложке, и поверх фотографии.
 *
 * Сюжеты свои — направления лицея, а не университетские ступени оригинала.
 */

const VIEW_BOX = '0 0 70 70';

/** Экономика — столбцы показателей и линия роста. */
function EconomicsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={VIEW_BOX}>
      <path d="M63 6H49a2.5 2.5 0 0 0 0 5h7.96L41.4 26.56l-9.63-9.63a3 3 0 0 0-4.24 0L7.88 36.58a3 3 0 1 0 4.24 4.25L29.65 23.3l9.63 9.63a3 3 0 0 0 4.24 0L60.5 15.95v7.3a2.5 2.5 0 0 0 5 0V8.5A2.5 2.5 0 0 0 63 6Z" />
      <rect x="6" y="46" width="12" height="18" rx="3" />
      <rect x="29" y="38" width="12" height="26" rx="3" />
      <rect x="52" y="30" width="12" height="34" rx="3" />
    </svg>
  );
}

/** Техника — шестерня. */
function TechnologyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={VIEW_BOX}>
      <g>
        <rect x="30.5" y="1" width="9" height="14" rx="3" />
        <rect x="30.5" y="1" width="9" height="14" rx="3" transform="rotate(45 35 35)" />
        <rect x="30.5" y="1" width="9" height="14" rx="3" transform="rotate(90 35 35)" />
        <rect x="30.5" y="1" width="9" height="14" rx="3" transform="rotate(135 35 35)" />
        <rect x="30.5" y="1" width="9" height="14" rx="3" transform="rotate(180 35 35)" />
        <rect x="30.5" y="1" width="9" height="14" rx="3" transform="rotate(225 35 35)" />
        <rect x="30.5" y="1" width="9" height="14" rx="3" transform="rotate(270 35 35)" />
        <rect x="30.5" y="1" width="9" height="14" rx="3" transform="rotate(315 35 35)" />
      </g>
      <path
        fillRule="evenodd"
        d="M35 11a24 24 0 1 0 0 48 24 24 0 0 0 0-48Zm0 14a10 10 0 1 1 0 20 10 10 0 0 1 0-20Z"
      />
    </svg>
  );
}

/** Финансы — стопка монет. */
function FinanceIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={VIEW_BOX}>
      <ellipse cx="35" cy="16" rx="26" ry="9" />
      <path d="M61 25v8c0 4.97-11.64 9-26 9S9 37.97 9 33v-8c0 4.97 11.64 9 26 9s26-4.03 26-9Z" />
      <path d="M61 39v8c0 4.97-11.64 9-26 9S9 51.97 9 47v-8c0 4.97 11.64 9 26 9s26-4.03 26-9Z" />
      <path d="M61 53v4c0 4.97-11.64 9-26 9S9 61.97 9 57v-4c0 4.97 11.64 9 26 9s26-4.03 26-9Z" />
    </svg>
  );
}

/** IT — угловые скобки и слеш. */
function ItIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={VIEW_BOX}>
      <path d="M26.3 16.2a3.5 3.5 0 0 1 0 4.95L12.45 35 26.3 48.85a3.5 3.5 0 1 1-4.95 4.95L5.03 37.48a3.5 3.5 0 0 1 0-4.96L21.35 16.2a3.5 3.5 0 0 1 4.95 0Z" />
      <path d="M43.7 16.2a3.5 3.5 0 0 0 0 4.95L57.55 35 43.7 48.85a3.5 3.5 0 1 0 4.95 4.95l16.32-16.32a3.5 3.5 0 0 0 0-4.96L48.65 16.2a3.5 3.5 0 0 0-4.95 0Z" />
      <rect x="31.5" y="11" width="7" height="48" rx="3.5" transform="rotate(14 35 35)" />
    </svg>
  );
}

/**
 * Биоинженерия — лабораторная колба.
 *
 * Двойная спираль на 32px сливается в сплошное пятно (линии оказываются
 * ближе 2px друг к другу), поэтому знак сделан сплошной формой — в ту же
 * «плотность», что шестерня и монеты. Пузырьки вырезаны `evenodd`.
 */
function BioengineeringIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={VIEW_BOX}>
      <path
        fillRule="evenodd"
        d="M45 4H25a3.5 3.5 0 0 0 0 7h1.5v15.9a4 4 0 0 1-.6 2.1L7.2 56.6A7.5 7.5 0 0 0 13.5 68h43a7.5 7.5 0 0 0 6.3-11.4L44.1 29a4 4 0 0 1-.6-2.1V11H45a3.5 3.5 0 0 0 0-7ZM27 46a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm13.5 8a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"
      />
    </svg>
  );
}

const ICONS: Record<string, () => React.ReactElement> = {
  economics: EconomicsIcon,
  technology: TechnologyIcon,
  finance: FinanceIcon,
  it: ItIcon,
  bioengineering: BioengineeringIcon
};

/**
 * Знак направления по его `id`. Для неизвестного идентификатора ничего не
 * рисуется — карточка остаётся корректной, просто без иконки.
 */
export function ProgramIcon({ id }: { id: string }) {
  const Icon = ICONS[id];
  return Icon ? <Icon /> : null;
}
