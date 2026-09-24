import type { Metadata } from 'next';
import { site } from '@/site.config';
import { InnerHero } from '@/components/sections/PageHero';
import { Contacts } from '@/components/sections/Contacts';
import { AdmissionCTA } from '@/components/sections/AdmissionCTA';

export const metadata: Metadata = {
  title: 'Контакты',
  description: `Контакты академического лицея имени И.М. Губкина в Ташкенте: ${site.contacts.addressFull}, телефон ${site.contacts.phone}.`,
  alternates: { canonical: '/contacts' },
  openGraph: {
    title: `Контакты | ${site.name}`,
    description: `${site.contacts.addressFull}. Телефон: ${site.contacts.phone}.`,
    url: '/contacts'
  }
};

export default function ContactsPage() {
  return (
    <>
      <InnerHero
        title={['Как нас найти', 'и связаться.']}
        text="Приёмная комиссия отвечает на вопросы о направлениях, поступлении и учебном процессе."
      />
      <Contacts heading="Контакты лицея" />
      <AdmissionCTA />
    </>
  );
}
