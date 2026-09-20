import Link from 'next/link';
import { admission } from '@/data/content';
import { site } from '@/site.config';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/animations/MagneticButton';
import { Reveal } from '@/components/animations/Reveal';

/** Тёмная CTA-секция «Поступление». */
export function AdmissionCTA() {
  return (
    <section id="admission" className="bg-navy py-[clamp(60px,6.6vw,104px)] text-white">
      <Container>
        <div className="grid items-start gap-9 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-[clamp(36px,5vw,100px)]">
          <Reveal>
            <h2 className="mb-4 text-[clamp(30px,4vw,58px)] leading-[1.04] font-bold tracking-[-0.032em]">
              {admission.heading}
            </h2>
            <p className="mb-8 max-w-[44ch] text-[clamp(15px,1.15vw,18px)] text-white/70">
              {admission.text}
            </p>
            <div className="flex flex-wrap gap-3.5">
              <MagneticButton className="max-sm:w-full">
                <Button href="/contacts" size="lg" className="max-sm:w-full">
                  Поступить в лицей
                </Button>
              </MagneticButton>
              <MagneticButton className="max-sm:w-full">
                <Button
                  href={site.contacts.phoneHref}
                  variant="dark-ghost"
                  size="lg"
                  arrow={false}
                  className="max-sm:w-full"
                >
                  Задать вопрос
                </Button>
              </MagneticButton>
            </div>
          </Reveal>

          <Reveal as="ul" delay={140} className="grid border-t border-white/20">
            <li className="grid gap-4 border-b border-white/20 py-5 sm:grid-cols-[110px_minmax(0,1fr)] sm:items-baseline">
              <span className="text-label text-white/45 uppercase">Телефон</span>
              <a
                href={site.contacts.phoneHref}
                className="text-[clamp(15px,1.15vw,18px)] font-bold tracking-[-0.01em] transition-colors duration-200 hover:text-blue-light"
              >
                {site.contacts.phone}
              </a>
            </li>

            <li className="grid gap-4 border-b border-white/20 py-5 sm:grid-cols-[110px_minmax(0,1fr)] sm:items-baseline">
              <span className="text-label text-white/45 uppercase">Telegram</span>
              {site.contacts.telegram ? (
                <a
                  href={site.contacts.telegram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[clamp(15px,1.15vw,18px)] font-bold tracking-[-0.01em] transition-colors duration-200 hover:text-blue-light"
                >
                  {site.contacts.telegram.label}
                </a>
              ) : (
                /* [ТРЕБУЕТСЯ УТОЧНЕНИЕ] — официальный Telegram лицея */
                <span className="text-[clamp(15px,1.15vw,18px)] text-white/45">
                  [ТРЕБУЕТСЯ УТОЧНЕНИЕ]
                </span>
              )}
            </li>

            <li className="grid gap-4 border-b border-white/20 py-5 sm:grid-cols-[110px_minmax(0,1fr)] sm:items-baseline">
              <span className="text-label text-white/45 uppercase">Адрес</span>
              <Link
                href="/contacts"
                className="text-[clamp(15px,1.15vw,18px)] font-bold tracking-[-0.01em] transition-colors duration-200 hover:text-blue-light"
              >
                {site.contacts.addressFull}
              </Link>
            </li>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
