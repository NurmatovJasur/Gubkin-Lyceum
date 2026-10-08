import { socialLinks } from '@/data/navigation';
import { SocialIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

type Tone = 'dark' | 'light';

const tones: Record<Tone, string> = {
  /** Светлая шапка: тёмная иконка, при наведении круг заливается чёрным. */
  dark: 'border-line text-black/70 hover:border-black hover:bg-black hover:text-white',
  /** Прозрачная шапка поверх фотографии: белая иконка. */
  light: 'border-white/30 text-white/85 hover:border-white hover:bg-white hover:text-black'
};

/**
 * Иконки соцсетей.
 *
 * Список приходит из `data/navigation`. Сеть, адрес которой ещё не
 * подтверждён в site.config (Instagram), выводится без href: вид тот же,
 * клик ничего не делает — как в секциях «Соцсети» и «Партнёры».
 * Пустой список не рисует ничего — вёрстка не ломается.
 */
export function SocialLinks({
  tone = 'dark',
  className,
  itemClassName
}: {
  tone?: Tone;
  className?: string;
  itemClassName?: string;
}) {
  if (socialLinks.length === 0) return null;

  return (
    <ul className={cn('flex items-center gap-1.5', className)}>
      {socialLinks.map((social) => (
        <li key={social.id}>
          <a
            {...(social.href
              ? { href: social.href, target: '_blank', rel: 'noopener noreferrer' }
              : {})}
            aria-label={social.label}
            title={social.label}
            className={cn(
              'flex size-9 items-center justify-center rounded-full border',
              'transition-[background-color,border-color,color] duration-200 ease-brand',
              tones[tone],
              itemClassName
            )}
          >
            <SocialIcon id={social.id} />
          </a>
        </li>
      ))}
    </ul>
  );
}
