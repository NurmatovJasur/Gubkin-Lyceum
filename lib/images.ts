import fs from 'node:fs';
import path from 'node:path';
import type { ResolvedImage, SiteImage } from '@/types';

/**
 * Разрешение путей к фотографиям.
 *
 * СЕРВЕРНЫЙ МОДУЛЬ: использует `node:fs` и вызывается только в Server
 * Components (на этапе сборки). Клиентские компоненты получают уже
 * разрешённые объекты `ResolvedImage` через props.
 *
 * На сайте не используются стоковые и сгенерированные изображения. Пока
 * настоящего файла нет, вместо фотографии выводится нейтральная заглушка
 * с подписью, какой кадр нужен (см. components/ui/Media.tsx).
 *
 * Чтобы поставить настоящее фото — положите файл с тем же именем в
 * `public/images/`. Ничего в коде менять не нужно.
 */

const imagesDir = path.join(process.cwd(), 'public', 'images');

const fileExists = (file: string): boolean => {
  try {
    return fs.statSync(path.join(imagesDir, file)).isFile();
  } catch {
    return false;
  }
};

export const resolveImage = (image: SiteImage): ResolvedImage => {
  const real = fileExists(image.file);
  return {
    ...image,
    src: `/images/${image.file}`,
    isPlaceholder: !real
  };
};

export const resolveImages = (images: SiteImage[]): ResolvedImage[] =>
  images.map(resolveImage);

/**
 * Официальный логотип лицея.
 * Положите `logo.svg` или `logo.png` в `public/images/` — он автоматически
 * заменит служебную монограмму в шапке и подвале.
 * [ЗАМЕНИТЬ НА ОФИЦИАЛЬНЫЙ ЛОГОТИП ЛИЦЕЯ]
 */
export const getLogo = (): string | null => {
  const candidate = ['logo.svg', 'logo.png'].find(fileExists);
  return candidate ? `/images/${candidate}` : null;
};
