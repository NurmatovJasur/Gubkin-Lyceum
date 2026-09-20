import { advantages } from '@/data/content';
import { Container, Section } from '@/components/ui/Container';
import { Reveal } from '@/components/animations/Reveal';

/** Четыре преимущества — крупные editorial-строки без «карточек». */
export function Advantages() {
  return (
    <Section aria-label="Преимущества лицея">
      <Container>
        <ol className="border-b border-line">
          {advantages.map((item) => (
            <Reveal
              as="li"
              key={item.number}
              className="grid grid-cols-[52px_minmax(0,1fr)] items-start gap-x-5 gap-y-3.5 border-t border-line py-[clamp(30px,3.6vw,56px)] lg:grid-cols-[72px_minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-[clamp(16px,3vw,64px)]"
            >
              <span
                aria-hidden="true"
                className="pt-1.5 text-[13px] font-bold tracking-[0.12em] text-blue"
              >
                {item.number}
              </span>

              <div>
                <h3 className="mb-3 text-h3">{item.title}</h3>
                <p className="max-w-[34ch] text-[clamp(16px,1.25vw,19px)] leading-normal text-ink">
                  {item.lead}
                </p>
              </div>

              <p className="col-start-2 max-w-[52ch] text-muted lg:col-start-3 lg:max-w-[44ch] lg:pt-3">
                {item.text}
              </p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
