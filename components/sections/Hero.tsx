import Image from 'next/image';
import type { ResolvedImage } from '@/types';
import { site } from '@/site.config';
import { Media } from '@/components/ui/Media';
import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/animations/MagneticButton';
import { HeroIntro } from '@/components/sections/HeroIntro';

/**
 * Главный экран.
 *
 * Строгая симметричная композиция: знак лицея по центру, под ним название
 * и одна кнопка целевого действия. Всё выровнено по центральной оси —
 * никаких вспомогательных блоков по бокам, чтобы первый экран читался
 * как титульный лист, а не как рекламный баннер.
 *
 * Server Component: разметка и LCP-изображение приходят с сервера сразу,
 * а анимацию поверх готового HTML включает клиентский HeroIntro.
 */
export function Hero({ image, logo }: { image: ResolvedImage; logo: string | null }) {
  /*
   * Высота ровно в экран: `svh` считает видимую часть без панелей браузера
   * на телефоне, а `min-` оставляет запас на редкий случай, когда содержимое
   * всё же выше экрана (альбомная ориентация) — тогда блок растёт, а не
   * обрезает текст.
   */
  return (
    <HeroIntro className="relative flex min-h-svh items-center overflow-hidden bg-black text-white">
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
        {/* Два слоя: общее затемнение под текст + мягкая виньетка по краям. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-black/70 via-black/55 to-black/80"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(10,10,10,0.55)_100%)]"
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-site flex-col items-center px-gutter pt-[calc(var(--spacing-nav)+clamp(28px,4vh,56px))] pb-[clamp(72px,9vh,116px)] text-center">
        {logo ? (
          <Image
            data-hero-mark
            src={logo}
            alt=""
            width={240}
            height={240}
            priority
            unoptimized={logo.endsWith('.svg')}
            className="mb-[clamp(20px,3vh,36px)] size-[clamp(78px,8.4vw,108px)] drop-shadow-[0_18px_44px_rgba(0,0,0,0.55)]"
          />
        ) : null}

        <p
          data-hero-mark
          className="mb-[clamp(16px,2.2vh,26px)] text-eyebrow uppercase text-white/55"
        >
          {site.contacts.city}
        </p>

        {/* Каждая строка — своя маска: текст выезжает из-под края (GSAP). */}
        {/*
          Собственный размер, а не общий `text-display`: на десктопе
          заголовок стоит в одной колонке с логотипом, подписью и кнопкой,
          поэтому верхняя граница ниже (60px против 96px) — иначе первый
          экран перестаёт помещаться в высоту окна. Нижняя граница
          подобрана так, чтобы на телефоне название вставало в две
          строки целиком, а не рвалось на «имени» и «И.М. Губкина».
        */}
        <h1 className="max-w-[980px] text-[clamp(29px,4.6vw,60px)] leading-[1.03] font-bold tracking-[-0.035em]">
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hero-line className="block">
              {site.nameLines[0]}
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hero-line className="block">
              имени И.М.&nbsp;<em className="not-italic text-blue-light">Губкина</em>
            </span>
          </span>
        </h1>

        <div
          data-hero-meta
          className="mt-[clamp(22px,3vh,36px)] flex flex-col items-center gap-[clamp(18px,2.4vh,28px)]"
        >
          <span aria-hidden="true" className="block h-px w-14 bg-white/30" />
          <p className="max-w-[52ch] text-[clamp(14px,1.15vw,18px)] leading-[1.5] tracking-[-0.012em] text-white/75">
            при филиале Российского государственного университета нефти и газа
            (НИУ) имени И.М. Губкина в Ташкенте
          </p>
        </div>

        <div data-hero-actions className="mt-[clamp(30px,4vh,48px)] w-full max-sm:px-2 sm:w-auto">
          <MagneticButton className="max-sm:w-full">
            <Button href="/admission" size="lg" className="max-sm:w-full">
              Поступить в лицей
            </Button>
          </MagneticButton>
        </div>
      </div>

      {/* Подсказка о прокрутке — только декор, в поток чтения не попадает. */}
      <span
        aria-hidden="true"
        data-hero-actions
        className="absolute inset-x-0 bottom-[clamp(20px,3.4vh,38px)] mx-auto hidden h-10 w-px bg-linear-to-b from-transparent to-white/45 lg:block"
      />
    </HeroIntro>
  );
}
