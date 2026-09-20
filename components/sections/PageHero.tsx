import Link from 'next/link';
import type { ResolvedImage } from '@/types';
import { Media } from '@/components/ui/Media';
import { Eyebrow } from '@/components/ui/SectionHeading';
import { Parallax } from '@/components/animations/Parallax';
import { Reveal } from '@/components/animations/Reveal';

type PageHeroProps = {
  image: ResolvedImage;
  title: string;
  intro?: string;
  eyebrow?: { number: string; label: string };
  breadcrumb?: { label: string; href: string };
};

/** Компактный hero внутренних страниц: фотография, крошки, заголовок. */
export function PageHero({ image, title, intro, eyebrow, breadcrumb }: PageHeroProps) {
  return (
    <section className="relative flex min-h-[clamp(460px,68vh,720px)] items-end overflow-hidden bg-black text-white">
      <Parallax strength={0.1} className="absolute inset-0">
        <div data-parallax-target className="absolute inset-0 scale-110">
          <Media image={image} sizes="100vw" priority quality={85} />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-black/55 via-black/25 via-40% to-black/80"
        />
      </Parallax>

      <div className="relative mx-auto w-full max-w-site px-gutter pb-[clamp(52px,7vh,92px)]">
        {breadcrumb ? (
          <nav
            aria-label="Хлебные крошки"
            className="mb-6 flex items-center gap-2.5 text-[12.5px] text-white/70"
          >
            <Link href="/" className="border-b border-transparent hover:border-white/60 hover:text-white">
              Главная
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={breadcrumb.href}
              className="border-b border-transparent hover:border-white/60 hover:text-white"
            >
              {breadcrumb.label}
            </Link>
          </nav>
        ) : null}

        <Reveal>
          {eyebrow ? (
            <Eyebrow
              number={eyebrow.number}
              label={eyebrow.label}
              tone="light"
              className="mb-[clamp(20px,3vw,34px)]"
            />
          ) : null}

          <h1 className="mb-4 text-h1">{title}</h1>

          {intro ? (
            <p className="max-w-[34ch] text-lead text-white/85">{intro}</p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}

/** Текстовый hero внутренних страниц — без фотографии. */
export function InnerHero({
  title,
  text,
  eyebrow
}: {
  title: readonly string[] | string;
  text?: string;
  eyebrow?: { number: string; label: string };
}) {
  const lines = Array.isArray(title) ? title : [title as string];

  return (
    <section className="border-b border-line pt-[calc(92px+clamp(40px,5vw,84px))] pb-[clamp(32px,4vw,56px)]">
      <div className="mx-auto w-full max-w-site px-gutter">
        <Reveal>
          {eyebrow ? (
            <Eyebrow
              number={eyebrow.number}
              label={eyebrow.label}
              className="mb-[clamp(24px,3vw,40px)]"
            />
          ) : null}

          <h1 className="mb-5 text-h1">
            {lines.map((line, index) => (
              <span key={line} className="block">
                {line}
                {index < lines.length - 1 ? ' ' : null}
              </span>
            ))}
          </h1>

          {text ? <p className="max-w-[46ch] text-lead text-muted">{text}</p> : null}
        </Reveal>
      </div>
    </section>
  );
}
