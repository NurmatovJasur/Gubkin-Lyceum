import type { Metadata } from 'next';
import { site } from '@/site.config';
import { InnerHero } from '@/components/sections/PageHero';
import { Container, Section } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  description:
    'Политика конфиденциальности сайта академического лицея имени И.М. Губкина в Ташкенте.',
  alternates: { canonical: '/privacy' },
  robots: { index: false, follow: true }
};

/**
 * Политика конфиденциальности.
 * Юридический текст не выдумывается — его предоставляет лицей.
 */
export default function PrivacyPage() {
  return (
    <>
      <InnerHero title={['Политика', 'конфиденциальности']} />

      <Section>
        <Container>
          <div className="grid max-w-[64ch] gap-4.5 text-base leading-[1.75] text-muted">
            {/* [ОТВЕТ АДМИНИСТРАЦИИ] — официальный текст политики конфиденциальности */}
            <p className="text-subtle">[ТРЕБУЕТСЯ УТОЧНЕНИЕ]</p>
            <p>
              Текст политики конфиденциальности предоставляется администрацией лицея и
              размещается на этой странице без изменений.
            </p>
            <p>
              По вопросам обработки данных можно связаться с лицеем по телефону{' '}
              <a href={site.contacts.phoneHref} className="border-b border-current text-blue">
                {site.contacts.phone}
              </a>
              .
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
