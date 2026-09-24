'use client';

import { useRef } from 'react';
import { manifesto } from '@/data/content';
import { Container } from '@/components/ui/Container';
import { gsap, prefersReducedMotion, useIsomorphicLayoutEffect } from '@/lib/gsap';

/**
 * Цитата-манифест в редакционной вёрстке: без карточки, только линейки,
 * сетка и типографика. Слева — подпись раздела, справа — цитата.
 *
 * Своих вертикальных отступов у секции нет: ритм задают соседние секции.
 * Клиентский блок из-за анимации: линейка прочерчивается, слова поднимаются.
 */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);
  const { caption } = manifesto;

  useIsomorphicLayoutEffect(() => {
    const element = root.current;
    if (!element || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: element, start: 'top 70%', once: true }
      });

      timeline
        .from('[data-manifesto-rule]', { scaleX: 0, duration: 1, ease: 'power3.inOut' })
        .from(
          '[data-manifesto-word]',
          { yPercent: 110, duration: 0.8, stagger: 0.035, ease: 'power3.out' },
          '-=0.5'
        )
        .from('[data-manifesto-caption]', { opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.4');
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section ref={root} aria-label="Манифест лицея">
      <Container>
        <figure>
          <div data-manifesto-rule aria-hidden="true" className="h-px origin-left bg-black" />

          <div className="grid gap-y-6 py-[clamp(40px,5vw,80px)] lg:grid-cols-12 lg:gap-x-8">
            <p
              data-manifesto-caption
              className="text-label text-subtle uppercase lg:col-span-3"
            >
              {caption.label}
              <span className="mt-1 block">{caption.place}</span>
            </p>

            <div className="lg:col-span-9">
              <blockquote className="max-w-[1080px] text-[clamp(28px,3.7vw,56px)] leading-[1.16] font-bold tracking-[-0.032em] text-black">
                {manifesto.lines.map((line) => (
                  <span key={line.text} className="block">
                    <Words text={line.text} />
                    {line.accent ? (
                      <em className="text-blue not-italic">
                        <Words text={line.accent} />
                      </em>
                    ) : null}
                  </span>
                ))}
              </blockquote>

              <figcaption
                data-manifesto-caption
                className="mt-[clamp(24px,3vw,40px)] flex items-center gap-4 text-body text-muted"
              >
                <span aria-hidden="true" className="h-px w-10 bg-black" />
                {caption.source}
              </figcaption>
            </div>
          </div>

          <div aria-hidden="true" className="h-px bg-line-strong" />
        </figure>
      </Container>
    </section>
  );
}

/** Разбивает строку на слова в масках, сохраняя пробелы для переноса. */
function Words({ text }: { text: string }) {
  return text.split(/(\s+)/).map((part, index) =>
    part.trim() === '' ? (
      part
    ) : (
      <span key={index} className="inline-block overflow-hidden pb-[0.06em] align-top">
        <span data-manifesto-word className="inline-block">
          {part}
        </span>
      </span>
    )
  );
}
