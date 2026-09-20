import { statistics } from '@/data/statistics';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/animations/Reveal';
import { CountUp } from '@/components/animations/CountUp';

/**
 * Лицей в цифрах.
 *
 * Если цифра не подтверждена администрацией (value === null) — выводится
 * видимый placeholder «[УТОЧНИТЬ]». Никаких выдуманных значений.
 * [ЗАМЕНИТЬ НА ФАКТИЧЕСКИЕ ДАННЫЕ] — data/statistics.ts
 */
export function Statistics() {
  return (
    <section
      aria-label="Лицей в цифрах"
      className="bg-black py-[clamp(52px,5.6vw,88px)] text-white"
    >
      <Container>
        <Reveal
          as="ul"
          stagger={0.09}
          childSelector=":scope > li"
          className="grid border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4"
        >
          {statistics.map((item) => (
            <li
              key={item.id}
              className="border-b border-white/15 py-[clamp(24px,3.2vw,48px)] sm:border-r sm:pr-[clamp(14px,2vw,34px)] sm:nth-[2n]:border-r-0 sm:nth-[2n]:pl-[clamp(14px,2vw,34px)] lg:border-b-0 lg:nth-[2n]:border-r lg:nth-[2n]:pl-0 lg:not-first:pl-[clamp(14px,2vw,34px)] lg:last:border-r-0"
            >
              {item.value ? (
                <p className="mb-3 text-[clamp(40px,5vw,86px)] leading-none font-bold tracking-[-0.042em]">
                  <CountUp value={item.value} />
                </p>
              ) : (
                <p className="mb-3 py-[clamp(8px,1.6vw,26px)] text-[clamp(18px,1.7vw,26px)] text-white/40">
                  [УТОЧНИТЬ]
                </p>
              )}
              <p className="max-w-[22ch] text-[clamp(13px,0.95vw,15px)] leading-snug text-white/70">
                {item.label}
              </p>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
