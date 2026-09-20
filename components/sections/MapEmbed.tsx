'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { site, mapEmbed } from '@/site.config';

/**
 * Карта подгружается только по клику пользователя.
 *
 * Так страница не тянет стороннего скрипта при первой загрузке: это
 * заметно лучше и для скорости (LCP/INP), и для приватности посетителя.
 */
export function MapEmbed() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-3/2 overflow-hidden border border-line bg-cloud lg:aspect-4/3">
      {loaded ? (
        <iframe
          src={mapEmbed()}
          title="Карта: расположение академического лицея имени И.М. Губкина"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="size-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[18px] bg-[linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] bg-size-[56px_56px] bg-center p-6 text-center">
          {/* [ТРЕБУЕТСЯ УТОЧНЕНИЕ] точных координат для более точной метки */}
          <p className="max-w-[24ch] bg-white px-4 py-2.5 text-[clamp(15px,1.2vw,18px)] font-bold tracking-[-0.01em]">
            {site.contacts.addressFull}
          </p>
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="inline-flex h-[52px] items-center gap-[10px] rounded-edge bg-black px-6 text-[15px] font-bold text-white transition-colors duration-200 ease-brand hover:bg-blue"
          >
            <MapPin aria-hidden="true" strokeWidth={1.5} className="size-[18px]" />
            <span>Показать карту</span>
          </button>
        </div>
      )}
    </div>
  );
}
