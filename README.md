# Академический лицей имени И.М. Губкина — сайт

Production-ready сайт лицея на Next.js (App Router) с TypeScript, Tailwind CSS,
GSAP + ScrollTrigger, Swiper и next/image. Готов к деплою на Vercel.

## Стек

| Технология | Зачем |
| --- | --- |
| **Next.js 16 (App Router)** | маршрутизация, Server Components, статическая генерация, Metadata API |
| **React 19 + TypeScript** | типизированные компоненты, весь код на TS |
| **Tailwind CSS 4** | дизайн-система в `app/globals.css` (`@theme`), утилиты вместо CSS-файлов |
| **GSAP + ScrollTrigger** | hero, text/image reveal, stagger, parallax, count-up, magnetic buttons |
| **Swiper** | галерея «О лицее», карусель преподавателей (стрелки, свайп, клавиатура, a11y) |
| **lucide-react** | интерфейсные иконки (тонкие, единый стиль) |
| **next/image** | AVIF/WebP, responsive srcset, lazy loading, приоритет для hero |

Шрифт — системный Arial. Внешние шрифт-провайдеры не подключаются.

## Запуск

```bash
npm install
```

```bash
npm run dev
```

Откроется `http://localhost:3000`.

Остальные команды:

```bash
npm run build
```

```bash
npm run lint
```

```bash
npm run typecheck
```

## Структура

```
app/                    маршруты App Router
  layout.tsx            общий каркас: шапка, подвал, метаданные, JSON-LD
  page.tsx              главная
  globals.css           ДИЗАЙН-СИСТЕМА: цвета, типографика, ритм, движение
  about/                /about
  directions/           /directions и /directions/[slug]
  admission/            /admission
  teachers/             /teachers
  news/                 /news и /news/[slug]
  contacts/             /contacts
  privacy/              /privacy
  sitemap.ts robots.ts  sitemap.xml и robots.txt
components/
  layout/               Navbar, Footer, FloatingHelp, Brand
  sections/             секции страниц (Hero, About, Directions, News…)
  ui/                   Button, SectionHeading, Media, карточки
  animations/           Reveal, ImageReveal, Parallax, MagneticButton, CountUp
data/                   контент: направления, преподаватели, новости, FAQ, статистика
lib/                    images (разрешение путей к фото), gsap, utils
types/                  Direction, Teacher, NewsArticle, FAQItem, Contact, Statistic
site.config.ts          контакты, SEO, домен, карта
public/images/          сюда кладутся настоящие фотографии
```

### Маршруты

| Путь | Страница |
| --- | --- |
| `/` | Главная |
| `/about` | О лицее |
| `/directions` | Направления |
| `/directions/economics` `/technology` `/finance` `/it` | Страницы направлений |
| `/admission` | Поступление |
| `/teachers` | Преподаватели |
| `/news`, `/news/[slug]` | Новости и материал новости |
| `/contacts` | Контакты |
| `/privacy` | Политика конфиденциальности |

Страницы направлений и новостей генерируются из `data/` через
`generateStaticParams()` — один шаблон вместо дублирующихся файлов.

## Server и Client Components

По умолчанию всё — Server Components. `"use client"` стоит только там, где
нужен браузерный JavaScript: шапка с мобильным меню, FAQ-аккордеон, Swiper,
карта по клику, плавающая кнопка помощи и GSAP-анимации.

GSAP-компоненты не создают разметку: они оборачивают уже отрендеренный
сервером HTML, поэтому контент и LCP-изображение приходят сразу. Каждая
анимация живёт внутри `gsap.context()` и уничтожается в cleanup
(`context.revert()`), ScrollTrigger'ы не накапливаются при навигации.
На мобильных «тяжёлые» эффекты (parallax, magnetic) отключены через
`gsap.matchMedia()`, при `prefers-reduced-motion` анимации не запускаются.

## Фотографии

На сайте **не используются стоковые и сгенерированные изображения**. Пока
настоящей фотографии нет, на её месте выводится нейтральная заглушка с
подписью, какой кадр нужен и как назвать файл.

Чтобы поставить настоящее фото — положите файл с нужным именем в
`public/images/`. Ничего в коде менять не нужно. Полный список требуемых
файлов — в `public/images/README.md`.

Логотип: положите `public/images/logo.svg` (или `logo.png`) — он автоматически
заменит служебный знак в шапке и подвале.

## Данные, которые должна подтвердить администрация

В коде намеренно не выдуманы факты. Все неподтверждённые места помечены
видимыми placeholder'ами и комментариями:

| Что | Где заполнить |
| --- | --- |
| Количество учащихся, процент поступления | `data/statistics.ts` |
| Предметы, олимпиады, вузы по направлениям | `data/directions.ts` |
| Преподаватели: имена, предметы, должности, фото | `data/teachers.ts` |
| Новости: заголовки, даты, тексты | `data/news.ts` |
| Ответы на частые вопросы | `data/faq.ts` |
| Telegram, e-mail | `site.config.ts` |
| Порядок приёма, документы, сроки | `app/admission/page.tsx` |
| Текст политики конфиденциальности | `app/privacy/page.tsx` |

Поиск по проекту: `[ТРЕБУЕТСЯ УТОЧНЕНИЕ]`, `[ЗАМЕНИТЬ НА ФАКТИЧЕСКИЕ ДАННЫЕ]`,
`[ОТВЕТ АДМИНИСТРАЦИИ]`, `[УТОЧНИТЬ]`, `[ПРЕДМЕТЫ НАПРАВЛЕНИЯ]`.

Важно: цифру «90% поступаемости» и любые другие показатели публиковать только
после подтверждения администрацией.

## Деплой на Vercel

1. Импортировать репозиторий в Vercel — фреймворк определится автоматически
   (`npm run build`, вывод `.next`).
2. Задать переменную окружения `NEXT_PUBLIC_SITE_URL` с реальным доменом
   (см. `.env.example`) — она используется в canonical, Open Graph и
   `sitemap.xml`. Без неё подставляется placeholder `https://example.uz`.
3. Загрузить фотографии в `public/images/` и заполнить данные из таблицы выше.

Секретов в коде нет. Локальные значения — в `.env.local` (в git не попадает).

## Дизайн-система

Все токены — в `app/globals.css` в блоке `@theme`, оттуда они доступны как
обычные Tailwind-утилиты:

- палитра: `#FFFFFF`, `#0A0A0A`, `#1A1A1A`, `#F5F5F5`, `#E7E7E7`, `#2457D6`
  (+ служебные оттенки текста и тёмно-синий для CTA);
- типографика: `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-lead`,
  `text-body`, `text-eyebrow`, `text-label` — все размеры на `clamp()`;
- сетка: `max-w-site` (1440px), `px-gutter`, `py-section`;
- движение: `ease-brand`, `ease-out-brand`;
- точки перелома: `sm 560`, `md 768`, `lg 900`, `xl 1180`, `2xl 1440`.

## Доступность

Семантическая разметка, ссылка «Перейти к содержанию», видимый фокус,
`aria-label` у интерактивных элементов. Мобильное меню и FAQ работают с
клавиатуры (Esc закрывает меню и возвращает фокус на кнопку), карусели
используют Swiper A11y и Keyboard, у всех изображений есть `alt`,
`prefers-reduced-motion` отключает анимации.

## Производительность

Статическая генерация всех страниц, минимум клиентского JavaScript,
`optimizePackageImports` для иконок, изображения в AVIF/WebP с `sizes` под
реальную сетку, `priority` только для hero, карта Яндекса подгружается
исключительно по клику пользователя.
