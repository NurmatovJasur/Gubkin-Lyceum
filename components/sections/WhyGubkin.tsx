import { why } from '@/data/content';
import { Container, Section } from '@/components/ui/Container';
import { Lines } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/animations/Reveal';

/** Секция «Почему Губкина?» — крупный текстовый блок на светлом фоне. */
export function WhyGubkin() {
  return (
    <Section id="why" className="bg-cloud">
      <Container>
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-[clamp(28px,5vw,110px)]">
          <Reveal>
            <h2 className="text-h2">{why.heading}</h2>
          </Reveal>

          <div className="grid max-w-[58ch] gap-4 lg:gap-6">
            {why.paragraphs.map((text, index) => (
              <Reveal key={text} delay={index * 90}>
                <p
                  className={
                    index === 0
                      ? 'text-[clamp(19px,1.85vw,28px)] leading-[1.4] tracking-[-0.015em] text-black'
                      : 'text-[clamp(16px,1.25vw,20px)] leading-relaxed text-ink'
                  }
                >
                  {text}
                </p>
              </Reveal>
            ))}

            <Reveal delay={300}>
              <p className="mt-[clamp(18px,2.4vw,34px)] border-t border-line pt-[clamp(20px,2.4vw,34px)] text-[clamp(19px,1.9vw,30px)] leading-[1.3] font-bold tracking-[-0.02em] text-blue">
                <Lines lines={why.closing} />
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
