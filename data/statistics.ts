import type { Statistic } from '@/types';
import { teachers } from '@/data/teachers';

/**
 * Лицей в цифрах.
 *
 * ПРАВИЛО: value === null означает, что цифра НЕ подтверждена администрацией.
 * В этом случае на сайте выводится видимый placeholder «[УТОЧНИТЬ]».
 * Никаких выдуманных цифр — заполнять только подтверждёнными данными.
 */
export const statistics: Statistic[] = [
  {
    id: 'students',
    // [ЗАМЕНИТЬ НА ФАКТИЧЕСКИЕ ДАННЫЕ] — точное количество учащихся
    value: null,
    label: 'учащихся лицея'
  },
  {
    id: 'group-size',
    // Подтверждено: в каждой группе не более 26 учеников
    value: '26',
    label: 'максимум учеников в группе'
  },
  {
    id: 'admission-rate',
    // [ЗАМЕНИТЬ НА ФАКТИЧЕСКИЕ ДАННЫЕ] — % выпускников, поступивших в вузы.
    // Цифру 90% использовать ТОЛЬКО после подтверждения администрацией.
    value: null,
    label: 'выпускников продолжают обучение в вузах'
  },
  {
    id: 'directions',
    // Подтверждено: 4 направления обучения
    value: '4',
    label: 'направления обучения'
  }
];

/**
 * Плитка счётчиков в секции «О лицее» на главной.
 *
 * Та же дисциплина, что и у `statistics`: `value === null` — цифра НЕ
 * подтверждена администрацией, на сайте выводится «[УТОЧНИТЬ]».
 *
 * `icon` выбирает глиф из набора секции (components/sections/AboutIcons.tsx).
 */
export type AboutCard = {
  id: string;
  icon: 'students' | 'staff' | 'schools' | 'faculty';
  /** Строка с цифрой; разделитель тысяч — пробел, как в оригинале. */
  value: string | null;
  label: string;
};

export const aboutCards: AboutCard[] = [
  {
    id: 'students',
    icon: 'students',
    // [ЗАМЕНИТЬ НА ФАКТИЧЕСКИЕ ДАННЫЕ] — точное количество учащихся
    value: null,
    label: 'учащихся'
  },
  {
    id: 'teachers',
    icon: 'staff',
    // Подтверждено: столько преподавателей перечислено в data/teachers.ts
    value: String(teachers.length),
    label: 'преподавателей'
  },
  {
    id: 'directions',
    icon: 'schools',
    // Подтверждено: 4 направления обучения
    value: '4',
    label: 'направления'
  },
  {
    id: 'group-size',
    icon: 'faculty',
    // Подтверждено: в каждой группе не более 26 учеников
    value: '26',
    label: 'учеников в группе'
  }
];
