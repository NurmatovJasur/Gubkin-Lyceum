import type { Metadata, Viewport } from 'next';
import { site } from '@/site.config';
import { getLogo } from '@/lib/images';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingHelp } from '@/components/layout/FloatingHelp';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.origin),
  title: {
    default: site.seo.title,
    template: `%s | ${site.name}`
  },
  description: site.seo.description,
  applicationName: site.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: site.seo.locale,
    title: site.seo.title,
    description: site.seo.description,
    url: '/'
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover'
};

/** Микроразметка организации — только подтверждённые данные. */
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: site.fullName,
  alternateName: site.name,
  url: site.origin,
  telephone: site.contacts.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'м-в Водник, 84',
    addressLocality: 'Ташкент',
    addressRegion: 'Бектемирский район',
    addressCountry: 'UZ'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const logo = getLogo();

  return (
    <html lang="ru">
      <head>
        {/* Без JavaScript блоки с reveal-анимацией должны остаться видимыми. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="absolute top-0 left-1/2 z-200 -translate-x-1/2 -translate-y-full bg-black px-6 py-3.5 text-[13px] tracking-[0.04em] text-white focus:translate-y-3"
        >
          Перейти к содержанию
        </a>

        <Navbar logo={logo} />
        <main id="main">{children}</main>
        <Footer logo={logo} />
        <FloatingHelp />
      </body>
    </html>
  );
}
