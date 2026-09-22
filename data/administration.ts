import type { StaffMember } from '@/types';

/**
 * Администрация лицея.
 *
 * СЕЙЧАС ЗДЕСЬ PLACEHOLDER-ДАННЫЕ. Имена, должности и фотографии
 * не выдумываются — их предоставляет администрация лицея.
 *
 * Как заполнить:
 *   1. Заменить поля name / role на реальные данные.
 *   2. Положить фото в public/images/ с именем из photo.file
 *      (прямоугольный кадр 3/4, ~800×1060px).
 *   3. bio — короткая справка (необязательно).
 */
const placeholder = (index: number): StaffMember => ({
  id: `staff-${index}`,
  name: '[ИМЯ ФАМИЛИЯ]',
  role: '[ДОЛЖНОСТЬ]',
  bio: null,
  photo: {
    file: `staff-${String(index).padStart(2, '0')}.jpg`,
    alt: 'Портрет сотрудника администрации академического лицея имени И.М. Губкина',
    note: `Портрет сотрудника администрации №${index} (прямоугольный кадр 3/4)`,
    ratio: '3/4'
  }
});

// [ЗАМЕНИТЬ НА ФАКТИЧЕСКИЕ ДАННЫЕ] — количество карточек тоже условное.
export const administration: StaffMember[] = Array.from({ length: 4 }, (_, i) => placeholder(i + 1));
