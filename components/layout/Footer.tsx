import Link from 'next/link';
import { site } from '@/site.config';
import { footerNav } from '@/data/navigation';
import { Brand } from '@/components/layout/Brand';
import { Container } from '@/components/ui/Container';

/** Большой подвал сайта. */
export function Footer({ logo }: { logo: string | null }) {
  return (
    <footer className="mt-[clamp(48px,5.5vw,88px)] bg-black pt-[clamp(56px,7vw,100px)] pb-[clamp(28px,3vw,40px)] text-white">
      <Container>
        <div className="grid gap-9 border-b border-white/15 pb-[clamp(40px,5vw,76px)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)] lg:gap-[clamp(36px,5vw,90px)]">
          <div>
            <Brand logo={logo} />
            <p className="mt-5 text-sm text-white/70">{site.contacts.city}</p>
          </div>

          <nav
            aria-label="Навигация в подвале"
            className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[clamp(24px,3vw,48px)]"
          >
            {footerNav.map((column) => (
              <div key={column.title}>
                <h2 className="mb-4 text-label font-normal text-white/45 uppercase">
                  {column.title}
                </h2>
                <ul className="grid gap-2.5 text-[15px]">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-white/70 transition-colors duration-200 ease-brand hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h2 className="mb-4 text-label font-normal text-white/45 uppercase">Контакты</h2>
              <ul className="grid gap-2.5 text-[15px]">
                <li>
                  <a
                    href={site.contacts.phoneHref}
                    className="text-white/70 transition-colors duration-200 ease-brand hover:text-white"
                  >
                    {site.contacts.phone}
                  </a>
                </li>
                <li>
                  <Link
                    href="/contacts"
                    className="text-white/70 transition-colors duration-200 ease-brand hover:text-white"
                  >
                    {site.contacts.addressFull}
                  </Link>
                </li>
                <li>
                  {site.contacts.telegram ? (
                    <a
                      href={site.contacts.telegram.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 transition-colors duration-200 ease-brand hover:text-white"
                    >
                      Telegram
                    </a>
                  ) : (
                    /* [ТРЕБУЕТСЯ УТОЧНЕНИЕ] — официальный Telegram лицея */
                    <span className="text-sm text-white/45">Telegram — [ТРЕБУЕТСЯ УТОЧНЕНИЕ]</span>
                  )}
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="flex flex-wrap justify-between gap-3 pt-6 pr-[clamp(0px,4vw,72px)] text-[13.5px] text-white/45">
          <p>
            © {site.copyrightYear} {site.name}
          </p>
          <Link
            href="/privacy"
            className="border-b border-transparent transition-colors duration-200 ease-brand hover:border-white/50 hover:text-white"
          >
            Политика конфиденциальности
          </Link>
        </div>
      </Container>
    </footer>
  );
}
