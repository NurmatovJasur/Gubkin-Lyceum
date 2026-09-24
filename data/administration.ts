import type { AdminLevel, AdminMember } from '@/types';

/**
 * Администрация лицея — по должностям сверху вниз.
 *
 * Фото — карточки целиком, как их предоставила администрация лицея
 * (`public/images/admin-NN.jpg`). Имя, должность и кабинет уже напечатаны
 * на карточке, поэтому те же данные собраны в alt.
 */
const member = (
  index: number,
  data: Omit<AdminMember, 'id' | 'photo'>
): AdminMember => {
  const id = `admin-${String(index).padStart(2, '0')}`;
  return {
    id,
    ...data,
    photo: {
      file: `${id}.jpg`,
      alt: [`${data.surname} ${data.givenNames}`, data.position, data.degree, data.cabinet && `кабинет ${data.cabinet}`]
        .filter(Boolean)
        .join(', '),
      note: `Карточка сотрудника администрации №${index}`,
      ratio: '3/4'
    }
  };
};

export const administrationIntro = {
  heading: ['Руководство', 'лицея.'],
  text: 'Кто отвечает за учебный процесс, работу с молодёжью и административные вопросы — и в каком кабинете их найти.'
} as const;

export const director = member(1, {
  surname: 'Рузикулов',
  givenNames: 'Номоз Арзикулович',
  position: 'Директор академического лицея',
  degree: 'Кандидат психологических наук (Ph.D)',
  cabinet: null
});

export const administrationLevels: AdminLevel[] = [
  {
    id: 'deputies',
    number: '02',
    title: 'Заместители директора',
    members: [
      member(2, {
        surname: 'Орипов',
        givenNames: 'Камолиддин Ўсарович',
        position: 'Заместитель директора по учебной работе',
        degree: null,
        cabinet: '208'
      }),
      member(3, {
        surname: 'Нуралиев',
        givenNames: 'Абдумурат Абдувалиевич',
        position: 'Заместитель директора по работе с молодёжью',
        degree: null,
        cabinet: '101'
      })
    ]
  },
  {
    id: 'services',
    number: '03',
    title: 'Административные службы',
    members: [
      member(4, {
        surname: 'Номозов',
        givenNames: 'Тоир Қорахонович',
        position: 'Главный бухгалтер',
        degree: null,
        cabinet: '104'
      }),
      member(5, {
        surname: 'Турсунова',
        givenNames: 'Сабохат Абдухамидовна',
        position: 'Инспектор отдела кадров',
        degree: null,
        cabinet: '108'
      })
    ]
  }
];
