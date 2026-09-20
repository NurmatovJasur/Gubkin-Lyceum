import type { ResolvedImage } from '@/types';
import { site } from '@/site.config';
import { Media } from '@/components/ui/Media';
import { Button } from '@/components/ui/Button';
import { Lines } from '@/components/ui/SectionHeading';
import { MagneticButton } from '@/components/animations/MagneticButton';
import { HeroIntro } from '@/components/sections/HeroIntro';

/**
 * Главный экран.
 *
 * Server Component: разметка и LCP-изображение приходят с сервера сразу,
 * а анимацию поверх готового HTML включает клиентский HeroIntro.
 */
export function Hero({ image }: { image: ResolvedImage }) {
  return (
    <HeroIntro className="relative flex min-h-svh max-h-[1100px] items-end overflow-hidden bg-black text-white">
      <div data-hero-media className="absolute inset-0">
        {/*
          Кадр обрезается по высоте экрана (object-cover), поэтому на вертикальных
          экранах картинка шире вьюпорта примерно в (высота / ширина) * 4/3 раз.
          Обычный sizes="100vw" занижал бы нужную ширину втрое — телефон получал
          768px-файл и растягивал его, отсюда «мыло». Проценты ниже описывают
          реальную ширину кадра, а не ширину экрана.
        */}
        <Media
          image={image}
          sizes="(max-width: 480px) 300vw, (max-width: 899px) 200vw, 100vw"
          priority
          quality={85}
          imageClassName="scale-100 min-[900px]:scale-[1.06] object-[center_15%]!"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-black/50 via-black/20 via-30% to-black/80"
        />
      </div>

      <div className="relative mx-auto w-full max-w-site px-gutter pb-[clamp(104px,14vh,168px)]">
        <div className="max-w-[1180px]">
          {/* Каждая строка — своя маска: текст выезжает из-под края (GSAP). */}
          <h1 className="mb-[clamp(28px,3.4vw,48px)]">
            <span className="mb-3 block overflow-hidden pb-[0.06em]">
              <span data-hero-line className="block text-display">
                Академический лицей{' '}
              </span>
            </span>
            <span className="block max-w-[44ch] text-[clamp(17px,2.05vw,34px)] leading-[1.3] font-normal tracking-[-0.014em] text-white/90">
              <span className="block overflow-hidden">
                <span data-hero-line className="block">
                  при филиале РГУ нефти и газа{' '}
                </span>
              </span>
              <span className="block overflow-hidden">
                <span data-hero-line className="block">
                  имени И.М.&nbsp;<em className="font-bold text-blue-light not-italic">Губкина</em>{' '}
                </span>
              </span>
              <span className="block overflow-hidden">
                <span data-hero-line className="block">
                  в Ташкенте
                </span>
              </span>
            </span>
          </h1>

          <div
            data-hero-meta
            className="mb-8 flex flex-wrap items-center gap-3 text-[clamp(14px,1.05vw,16px)] sm:gap-[clamp(16px,2.4vw,36px)]"
          >
            <p className="w-full border-white/30 pr-0 leading-snug text-white/80 sm:w-auto sm:border-r sm:pr-[clamp(16px,2.4vw,36px)]">
              <Lines lines={site.contacts.addressLines} />
            </p>
            <a
              href={site.contacts.phoneHref}
              className="border-b border-white/35 pb-0.5 text-[clamp(16px,1.25vw,19px)] font-bold tracking-[-0.01em] transition-colors duration-200 ease-brand hover:border-white"
            >
              {site.contacts.phone}
            </a>
          </div>

          <div data-hero-actions className="flex flex-wrap gap-3.5">
            <MagneticButton className="max-sm:w-full">
              <Button href="/admission" size="lg" className="max-sm:w-full">
                Поступить в лицей
              </Button>
            </MagneticButton>
            <MagneticButton className="max-sm:w-full">
              <Button href="/directions" variant="light-ghost" size="lg" className="max-sm:w-full">
                Направления
              </Button>
            </MagneticButton>
          </div>
        </div>
      </div>
    </HeroIntro>
  );
}
