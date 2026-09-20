/** Склейка классов без внешних зависимостей. */
export const cn = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');

/** Соотношение сторон '16/9' → CSS-значение для aspect-ratio. */
export const aspect = (ratio: string): string => ratio.replace('/', ' / ');
