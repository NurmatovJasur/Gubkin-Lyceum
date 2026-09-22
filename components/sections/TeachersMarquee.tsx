'use client';

import { Children, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type TeachersMarqueeProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Бесконечная лента карточек преподавателей — как блок с результатами
 * на сайтах языковых школ (карусель IELTS-сертификатов и т.п.): лента
 * едет сама, курсор её останавливает.
 *
 * Остановка при наведении и при фокусе с клавиатуры — чтобы карточку
 * можно было рассмотреть или дочитать до конца. На сенсорных экранах,
 * где наведения не существует, тот же эффект даёт касание: лента стоит,
 * пока палец на карточке, и снова едет, когда его убрали.
 */
export function TeachersMarquee({ children, className }: TeachersMarqueeProps) {
  const [paused, setPaused] = useState(false);
  const cards = Children.toArray(children);
  // Лента продублирована: при сдвиге ровно на -50% стык между копиями незаметен.
  const track = [...cards, ...cards];
  const duration = Math.max(cards.length * 4.5, 18);

  const pause = () => setPaused(true);
  const resume = () => setPaused(false);

  return (
    <div
      className={cn('relative w-full overflow-hidden', className)}
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)'
      }}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
      onTouchCancel={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <div
        className="flex w-max gap-[clamp(14px,1.6vw,28px)]"
        style={{
          animationName: 'marquee',
          animationDuration: `${duration}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationPlayState: paused ? 'paused' : 'running'
        }}
      >
        {track.map((card, index) => {
          const isClone = index >= cards.length;
          return (
            <div
              key={index}
              className="w-[70vw] shrink-0 sm:w-[300px] lg:w-[280px]"
              aria-hidden={isClone}
              inert={isClone}
            >
              {card}
            </div>
          );
        })}
      </div>
    </div>
  );
}
