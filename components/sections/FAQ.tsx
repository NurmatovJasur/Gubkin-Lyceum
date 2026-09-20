'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { faq } from '@/data/faq';
import { Container, Section } from '@/components/ui/Container';
import { Lines } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/animations/Reveal';
import { cn } from '@/lib/utils';

/**
 * Частые вопросы — доступный accordion.
 *
 * Кнопка + aria-expanded + aria-controls: раскрытие работает с клавиатуры
 * (Enter/Space), состояние озвучивается скринридером. Ответ анимируется
 * через grid-template-rows, поэтому высота не считается скриптом.
 */
export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <Section id="faq">
      <Container>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-[clamp(28px,5vw,100px)]">
          <Reveal className="lg:sticky lg:top-[calc(76px+clamp(24px,4vw,56px))]">
            <h2 className="mb-4 text-h2">
              <Lines lines={['Частые', 'вопросы']} />
            </h2>
            <p className="max-w-[34ch] text-[15px] text-muted">
              Не нашли ответ? Позвоните в лицей — приёмная комиссия ответит на вопросы.
            </p>
          </Reveal>

          <div className="border-t border-line">
            {faq.map((item) => {
              const open = openId === item.id;
              const pending = item.answer.startsWith('[');

              return (
                <div key={item.id} className="border-b border-line">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={`faq-answer-${item.id}`}
                      id={`faq-question-${item.id}`}
                      onClick={() => setOpenId(open ? null : item.id)}
                      className="flex w-full items-center justify-between gap-6 py-[clamp(18px,2vw,26px)] text-left text-[clamp(16px,1.35vw,21px)] font-bold tracking-[-0.015em] transition-colors duration-200 ease-brand hover:text-blue"
                    >
                      <span>{item.question}</span>
                      <span aria-hidden="true" className="shrink-0">
                        {open ? (
                          <Minus strokeWidth={1.5} className="size-4" />
                        ) : (
                          <Plus strokeWidth={1.5} className="size-4" />
                        )}
                      </span>
                    </button>
                  </h3>

                  <div
                    id={`faq-answer-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-question-${item.id}`}
                    className={cn(
                      'grid transition-[grid-template-rows,opacity] duration-500 ease-out-brand',
                      open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    )}
                  >
                    <div className="overflow-hidden">
                      <p
                        className={cn(
                          'max-w-[62ch] pb-[clamp(18px,2vw,26px)] text-[15.5px] leading-[1.7]',
                          pending ? 'text-subtle' : 'text-muted'
                        )}
                      >
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
