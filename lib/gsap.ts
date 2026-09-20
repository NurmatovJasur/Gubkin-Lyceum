'use client';

import { useLayoutEffect, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Единая точка входа в GSAP.
 *
 * Плагины регистрируются один раз и только в браузере — на сервере GSAP
 * не выполняется. Все анимации создаются внутри `gsap.context()` и
 * уничтожаются в cleanup, поэтому memory leaks и «залипшие» ScrollTrigger
 * при навигации App Router не появляются.
 */
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/** На сервере useLayoutEffect предупреждает — подменяем на useEffect. */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** Пользователь попросил уменьшить движение. */
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Точка, с которой включаются «тяжёлые» эффекты (parallax, magnetic). */
export const DESKTOP_QUERY = '(min-width: 900px)';

export { gsap, ScrollTrigger };
