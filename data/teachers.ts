import type { Teacher } from '@/types';

/**
 * Преподаватели.
 *
 * СЕЙЧАС ЗДЕСЬ PLACEHOLDER-ДАННЫЕ. Имена, предметы, должности и фотографии
 * не выдумываются — их предоставляет администрация лицея.
 *
 * Как заполнить:
 *   1. Заменить поля name / subject / role на реальные данные.
 *   2. Положить фото в public/images/ с именем из photo.file
 *      (прямоугольный кадр 3/4, ~800×1060px).
 *   3. bio — короткая справка, появляется при наведении (необязательно).
 */
const placeholder = (index: number): Teacher => ({
  id: `teacher-${index}`,
  name: '[ИМЯ ФАМИЛИЯ]',
  subject: '[ПРЕДМЕТ]',
  role: '[ДОЛЖНОСТЬ]',
  bio: '[ТРЕБУЕТСЯ УТОЧНЕНИЕ]',
  photo: {
    file: `teacher-${String(index).padStart(2, '0')}.jpg`,
    alt: 'Портрет преподавателя академического лицея имени И.М. Губкина',
    note: `Портрет преподавателя №${index} (прямоугольный кадр 3/4)`,
    ratio: '3/4'
  }
});

// [ЗАМЕНИТЬ НА ФАКТИЧЕСКИЕ ДАННЫЕ]
export const teachers: Teacher[] = Array.from({ length: 8 }, (_, i) => placeholder(i + 1));
