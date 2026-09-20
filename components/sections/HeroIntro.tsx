'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, useIsomorphicLayoutEffect, DESKTOP_QUERY } from '@/lib/gsap';

/**
 * Анимация главного экрана.
 *
 * Обёртка над готовой серверной разметкой: GSAP не создаёт ни одного узла,
 * поэтому LCP-изображение и заголовок попадают в HTML сразу. Строки
 * заголовка выезжают из-под маски, кадр медленно «отъезжает» (parallax
 * только на desktop), всё живёт внутри gsap.context() и корректно
 * уничтожается при уходе со страницы.
 */
export function HeroIntro({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const element = root.current;
    if (!element) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

      timeline
        .from('[data-hero-line]', {
          yPercent: 110,
          opacity: 0,
          duration: 1.1,
          stagger: 0.09
        })
        .from('[data-hero-meta]', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
        .from('[data-hero-actions]', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6');

      // Медленный отъезд кадра при прокрутке — только на больших экранах.
      gsap.matchMedia().add(DESKTOP_QUERY, () => {
        gsap.to('[data-hero-media]', {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section ref={root} id="hero" className={className}>
      {children}
    </section>
  );
}
