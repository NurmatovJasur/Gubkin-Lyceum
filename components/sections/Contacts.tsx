import { site, mapLink } from '@/site.config';
import { Container, Section } from '@/components/ui/Container';
import { Lines } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/animations/Reveal';
import { MapEmbed } from '@/components/sections/MapEmbed';

/** Контакты + карта (подгружается по клику). */
export function Contacts({ heading = 'Контакты' }: { heading?: string }) {
  return (
    <Section id="contacts">
      <Container>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-[clamp(32px,4.5vw,90px)]">
          <Reveal>
            <h2 className="mb-6 text-h2">{heading}</h2>

            <p className="mb-8 max-w-[34ch] text-[clamp(16px,1.25vw,19px)] leading-normal text-ink">
              <Lines
                lines={[
                  'Академический лицей при филиале',
                  'РГУ нефти и газа имени И.М. Губкина',
                  'в Ташкенте'
                ]}
              />
            </p>

            <dl className="mb-8 border-t border-line">
              <div className="grid grid-cols-[96px_minmax(0,1fr)] items-baseline gap-4 border-b border-line py-5 lg:grid-cols-[120px_minmax(0,1fr)]">
                <dt className="text-label text-subtle uppercase">Адрес</dt>
                <dd className="text-[clamp(15px,1.2vw,18px)] leading-normal font-bold tracking-[-0.01em]">
                  <Lines lines={[...site.contacts.addressLines, site.contacts.city]} />
                </dd>
              </div>

              <div className="grid grid-cols-[96px_minmax(0,1fr)] items-baseline gap-4 border-b border-line py-5 lg:grid-cols-[120px_minmax(0,1fr)]">
                <dt className="text-label text-subtle uppercase">Телефон</dt>
                <dd className="text-[clamp(15px,1.2vw,18px)] font-bold tracking-[-0.01em]">
                  <a
                    href={site.contacts.phoneHref}
                    className="border-b border-transparent transition-colors duration-200 ease-brand hover:border-blue hover:text-blue"
                  >
                    {site.contacts.phone}
                  </a>
                </dd>
              </div>

              <div className="grid grid-cols-[96px_minmax(0,1fr)] items-baseline gap-4 border-b border-line py-5 lg:grid-cols-[120px_minmax(0,1fr)]">
                <dt className="text-label text-subtle uppercase">Telegram</dt>
                <dd className="text-[clamp(15px,1.2vw,18px)] font-bold tracking-[-0.01em]">
                  {site.contacts.telegram ? (
                    <a
                      href={site.contacts.telegram.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-b border-transparent transition-colors duration-200 ease-brand hover:border-blue hover:text-blue"
                    >
                      {site.contacts.telegram.label}
                    </a>
                  ) : (
                    /* [ТРЕБУЕТСЯ УТОЧНЕНИЕ] — официальный Telegram лицея */
                    <span className="font-normal text-subtle">[ТРЕБУЕТСЯ УТОЧНЕНИЕ]</span>
                  )}
                </dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-3.5">
              <Button href={site.contacts.phoneHref} arrow={false} className="max-sm:w-full">
                Позвонить
              </Button>
              <Button href={mapLink()} variant="ghost" className="max-sm:w-full">
                Открыть карту
              </Button>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <MapEmbed />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
