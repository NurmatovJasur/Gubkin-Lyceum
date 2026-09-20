'use client';

import { useRef } from 'react';
import { manifesto } from '@/data/content';
import { Container } from '@/components/ui/Container';
import { gsap, useIsomorphicLayoutEffect } from '@/lib/gsap';

/**
 * Полноэкранная цитата-манифест.
 *
 * Строки проявляются по очереди при прокрутке — единственная причина,
 * по которой блок сделан клиентским.
 */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const element = root.current;
    if (!element) return;

    const context = gsap.context(() => {
      gsap.from('[data-manifesto-line]', {
        yPercent: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 75%', once: true }
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-label="Манифест лицея"
      className="py-[clamp(64px,8.5vw,132px)]"
    >
      <Container>
        <blockquote className="max-w-[1040px] text-[clamp(28px,3.7vw,54px)] leading-[1.2] font-bold tracking-[-0.032em] lg:pl-[clamp(0px,6vw,130px)]">
          {manifesto.lines.map((line) => (
            <span key={line.text} className="block overflow-hidden pb-[0.04em]">
              <span data-manifesto-line className="block">
                {line.text}
                {line.accent ? <em className="text-blue not-italic">{line.accent}</em> : null}
              </span>
            </span>
          ))}
        </blockquote>
      </Container>
    </section>
  );
}
