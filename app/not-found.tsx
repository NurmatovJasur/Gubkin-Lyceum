import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Страница не найдена',
  robots: { index: false, follow: true }
};

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center pt-nav">
      <Container>
        <p className="mb-5 text-label text-subtle uppercase">Ошибка 404</p>
        <h1 className="mb-5 max-w-[16ch] text-h1">Такой страницы нет.</h1>
        <p className="mb-8 max-w-[42ch] text-lead text-muted">
          Возможно, ссылка устарела или адрес введён с ошибкой.
        </p>
        <div className="flex flex-wrap gap-3.5">
          <Button href="/">На главную</Button>
          <Button href="/directions" variant="ghost">
            Направления
          </Button>
        </div>
      </Container>
    </section>
  );
}
