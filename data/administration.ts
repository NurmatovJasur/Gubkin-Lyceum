import type { AdminLevel, AdminMember } from '@/types';

/**
 * Администрация лицея — по должностям сверху вниз.
 *
 * Фотографии в `public/images/admin-NN.jpg` (у специалистов лицея —
 * `teacher-NN.jpg` из того же набора) — это готовые печатные карточки:
 * портрет занимает верхние ~60% листа, ниже напечатаны ФИО, должность и
 * кабинет. На сайте из листа вырезается только портрет (см.
 * `components/ui/AdminPortrait.tsx`), а подписи набираются вёрсткой из
 * полей ниже: так текст переводится, читается поисковиками и экранными
 * дикторами и не мылится на retina-экранах.
 *
 * ПОЛЕ `scope` — ЧЕРНОВИК. Это короткий перечень вопросов, с которыми
 * обращаются к сотруднику; он выведен из должности и должен быть
 * подтверждён администрацией лицея перед публикацией.
 */
const member = (
  index: number,
  data: Omit<AdminMember, 'id' | 'photo'>,
  /**
   * Имя файла в `public/images/`, если печатная карточка сотрудника лежит
   * не в нумерации `admin-NN.jpg`: у специалистов лицея карточки свёрстаны
   * по тому же шаблону, но пришли в наборе преподавателей.
   */
  photoFile?: string
): AdminMember => {
  const id = `admin-${String(index).padStart(2, '0')}`;
  return {
    id,
    ...data,
    photo: {
      file: photoFile ?? `${id}.jpg`,
      alt: [`${data.surname} ${data.givenNames}`, data.position, data.degree]
        .filter(Boolean)
        .join(', '),
      note: `Карточка сотрудника администрации №${index}`,
      ratio: '3/4'
    }
  };
};

export const administrationIntro = {
  eyebrow: 'Администрация',
  heading: ['Руководство', 'лицея.'],
  text: 'Кто отвечает за учебный процесс, работу с молодёжью и административные вопросы лицея.'
} as const;

export const director = member(1, {
  surname: 'Рузикулов',
  givenNames: 'Номоз Арзикулович',
  position: 'Директор академического лицея',
  degree: 'Кандидат психологических наук (Ph.D)',
  cabinet: null,
  scope: ['Общее руководство', 'Кадровая политика', 'Внешние связи']
});

export const administrationLevels: AdminLevel[] = [
  {
    id: 'deputies',
    number: '02',
    title: 'Заместители директора',
    caption: 'Учебный процесс и работа с учащимися',
    members: [
      member(2, {
        surname: 'Орипов',
        givenNames: 'Камолиддин Ўсарович',
        position: 'Заместитель директора по учебной работе',
        degree: null,
        cabinet: '208',
        scope: ['Учебный план', 'Расписание занятий', 'Успеваемость']
      }),
      member(3, {
        surname: 'Нуралиев',
        givenNames: 'Абдумурат Абдувалиевич',
        position: 'Заместитель директора по работе с молодёжью',
        degree: null,
        cabinet: '101',
        scope: ['Воспитательная работа', 'Кружки и секции', 'Мероприятия лицея']
      })
    ]
  },
  {
    id: 'services',
    number: '03',
    title: 'Административные службы',
    caption: 'Документы, расчёты и приём обращений',
    members: [
      member(4, {
        surname: 'Номозов',
        givenNames: 'Тоир Қорахонович',
        position: 'Главный бухгалтер',
        degree: null,
        cabinet: '104',
        scope: ['Оплата обучения', 'Справки и расчёты', 'Финансовые документы']
      }),
      member(5, {
        surname: 'Турсунова',
        givenNames: 'Сабохат Абдухамидовна',
        position: 'Инспектор отдела кадров',
        degree: null,
        cabinet: '108',
        scope: ['Личные дела', 'Приём документов', 'Трудоустройство']
      })
    ]
  },
  {
    id: 'specialists',
    number: '04',
    title: 'Специалисты лицея',
    caption: 'Психология, спорт и информационные ресурсы',
    members: [
      member(
        6,
        {
          surname: 'Зурдунова',
          givenNames: 'Равшана Турсуновна',
          position: 'Психолог академического лицея',
          degree: 'Удостоверение №0765, Ассоциация психологов Узбекистана',
          cabinet: null,
          scope: ['Психологическая поддержка', 'Адаптация учащихся', 'Беседы с родителями']
        },
        'teacher-10.jpg'
      ),
      member(
        7,
        {
          surname: 'Киршин',
          givenNames: 'Юрий Евгеньевич',
          position: 'Руководитель физического воспитания',
          degree: 'Мастер спорта по лёгкой атлетике',
          cabinet: null,
          scope: ['Физическое воспитание', 'Спортивные секции', 'Соревнования']
        },
        'teacher-14.jpg'
      ),
      member(
        8,
        {
          surname: 'Худайбердиева',
          givenNames: 'Матлуба Мухамедалиевна',
          position: 'Руководитель информационно-ресурсного центра',
          degree: null,
          cabinet: null,
          scope: ['Учебная литература', 'Читальный зал', 'Электронные ресурсы']
        },
        'teacher-29.jpg'
      )
    ]
  }
];

/** Все сотрудники одним списком — для JSON-LD и общих подсчётов. */
export const administrationAll: AdminMember[] = [
  director,
  ...administrationLevels.flatMap((level) => level.members)
];
