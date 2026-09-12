# Аудит проекта My Bonsai

**Дата:** 12 сентября 2026  
**Проект:** my-bonsai.eu — каталог японских бонсай (Ирландия)  
**Стек:** Nuxt 4, Vue 3, TypeScript, Contentful, Pinia 4, Swiper 14

---

## Executive Summary

Главные находки и самые ценные возможности:

1. **🔴 `fetchBonsaiBySlug` загружает ВЕСЬ каталог** для показа одной страницы дерева — каждый визит на `/bonsai/:slug` делает запрос на 1000 записей из Contentful.
2. **🔴 Массовое дублирование логики фильтров** — `bonsai/index.vue` и `bonsai/style/[slug].vue` содержат ~100 строк идентичной логики (computed, watch, шаблоны фильтров и грида).
3. **🔴 XSS-риск в RichText.vue** — `v-html` с данными из Contentful без санитизации; если CMS будет скомпрометирован, вредоносный HTML отрендерится на сайте.
4. **🔴 Изображения не используют `@nuxt/image`** — модуль установлен, но нигде не применяется; все картинки загружаются в полном размере без lazy loading.
5. **🔴 Отсутствует BreadcrumbList JSON-LD** — на всех страницах есть визуальные хлебные крошки, но без структурированных данных для Google.
6. **🔴 Нет OG/Twitter мета-тегов** ни на одной странице кроме детальной страницы дерева — ссылки в соцсетях выглядят плохо.
7. **🟡 Попапы (лайтбокс) недоступны** — нет focus trap, нет закрытия по Escape, нет `role="dialog"`, нет `aria-modal`.
8. **🟡 SelectFilter не поддерживает клавиатуру** — нельзя navigать стрелками, нет `role="listbox"`, нет `aria-activedescendant`.
9. **🟡 Дублирование popup-логики** — `gallery.vue` и `bonsai/[slug].vue` содержат идентичные popup-компоненты (шаблон + стили + JS).
10. **🟡 `normalizeImage` дублируется** в трёх серверных утилитах (`bonsai.ts`, `gallery.ts`, `services.ts`).
11. **🟡 Искусственная задержка лоадера** — `loader.client.ts` добавляет 200ms `setTimeout` до и после навигации, замедляя UX.
12. **🟡 `siteUrl` по умолчанию = `localhost:3000`** — если env-переменная не задана, canonical URL и sitemap будут указывать на localhost.
13. **🟡 `_robots.txt` указывает `http://`** вместо `https://` для sitemap.
14. **🟡 Критические SEO-страницы отсутствуют** — нет `/about`, `/blog`, `/faq`, `/shipping`, `/care-guide`, страниц по породам деревьев.
15. **🟢 Пустой файл `shared/types/filter.ts`** — `FilterItem` определён в `contentful.ts`, но импорты ссылаются на `filter.ts`.
16. **🟢 Тестовый API-эндпоинт `test-contentful.ts`** доступен без авторизации и отдаёт весь каталог.

---

## 1. Дублирование кода и рефакторинг

### 1.1. Дублирование логики фильтров между `/bonsai` и `/bonsai/style/:slug`

**Где найдено:**
- `app/pages/bonsai/index.vue` (строки 50–175)
- `app/pages/bonsai/style/[slug].vue` (строки 55–180)

**Суть проблемы:**  
Оба файла содержат практически идентичную логику:
- `availableTags` computed — ~20 строк одинакового кода
- `availableStyles` computed — ~20 строк
- `availabilityWithCounts` computed — ~15 строк
- `filteredBonsais` computed — ~10 строк
- `availabilityOptions` массив + `watch` с `splice` — 5 строк
- `watch(selectedStyleId)` для навигации — 7 строк
- Шаблон с тремя `<SelectFilter>` + грид + empty state — ~25 строк

Различия минимальны: в `style/[slug].vue` стиль предзафиксирован (`selectedStyleId = ref(slug)`), а фильтрация добавляет `item.style?.toLowerCase() !== slug`.

**Приоритет:** 🔴 Критично  
**Рекомендация:**  
Вынести в композабл `useBonsaiFilters(allBonsais, options?)` в `app/composables/`. Композабл должен принимать массив бонсай и опциональные начальные фильтры, возвращать все computed + watch для навигации. Обе страницы будут использовать один композабл с разной конфигурацией. Шаблон фильтров + грид можно вынести в компонент `BonsaiCatalog.vue`.

---

### 1.2. Дублирование popup/лайтбокс

**Где найдено:**
- `app/pages/bonsai/[slug].vue` (template: popup div; script: `popupImage`, `openPopup`, `closePopup`; style: `.popup*`)
- `app/pages/gallery.vue` (идентичный popup)

**Суть проблемы:**  
Одинаковая логика лайтбокса (ref, open/close функции, template с `.popup`, `.popup__content`, `.popup__image`, `.popup__close`) и идентичные CSS-стили (~30 строк) дублируются в двух файлах.

**Приоритет:** 🟡 Средне  
**Рекомендация:**  
Создать компонент `ImageLightbox.vue` (или `ImagePopup.vue`) с props `modelValue` (url или null) и emit `update:modelValue`. Использовать в обоих местах.

---

### 1.3. Дублирование `normalizeImage` в серверных утилитах

**Где найдено:**
- `server/utils/bonsai.ts` (строки 15–30)
- `server/utils/gallery.ts` (строки 15–35)
- `server/utils/services.ts` (строки 15–35)

**Суть проблемы:**  
Функция `normalizeImage` (резолв linked asset из `includes`) повторяется три раза с минимальными вариациями. В `bonsai.ts` и `gallery.ts` она возвращает `NormalizedImage { id, url }`, в `services.ts` — просто `string | null` (только URL).

**Приоритет:** 🟡 Средне  
**Рекомендация:**  
Вынести универсальную `resolveImageAsset(image, includes)` в `server/utils/contentful.ts`. Вариант для services будет вызывать её и брать `.url`.

---

### 1.4. Дублирование CSS-стилей

**Где найдено:**
- `.bonsai__grid` — `bonsai/index.vue` и `style/[slug].vue` (identical 5-column grid + 4 breakpoints)
- `.filters` — оба файла (identical flex layout)
- `.loader`, `.empty` — оба файла (identical centering)
- `.popup*` — `gallery.vue` и `bonsai/[slug].vue` (уже покрыто в 1.2)
- `.main__header`, `.main__header-wrap` — `services.vue`, `gallery.vue`, `contacts.vue`, `[...slug].vue`, `bonsai/[slug].vue` (из `main.css`)

**Суть проблемы:**  
Грид каталога (`.bonsai__grid` с 5/4/3/2/1 колонками) и блок фильтров (`.filters`) полностью идентичны в двух файлах. При изменении breakpoint нужно менять в двух местах.

**Приоритет:** 🟡 Средне  
**Рекомендация:**  
При выносе в компонент `BonsaiCatalog.vue` (п. 1.1) стили переедут вместе с ним. Оставшиеся общие стили (`.loader`, `.empty`) уже частично в `main.css` — можно перенести полностью.

---

### 1.5. Дублирование Swiper-импортов

**Где найдено:**
- `app/pages/bonsai/[slug].vue` (строки 1–5)
- `app/pages/gallery.vue` (строки 1–5)

**Суть проблемы:**  
Одинаковый набор импортов Swiper (компоненты, модули, CSS-файлы) в двух файлах.

**Приоритет:** 🟢 Мелочь  
**Рекомендация:**  
Не критично — Swiper не поддерживает tree-shaking через реэкспорт. Можно оставить как есть или создать `composables/useSwiper.ts`, но выигрыш минимальный.

---

## 2. Архитектурные проблемы и несостыковки

### 2.1. `fetchBonsaiBySlug` загружает ВЕСЬ каталог для одного товара

**Где найдено:** `server/utils/bonsai.ts`, строка 82–84

```ts
export async function fetchBonsaiBySlug(slug: string): Promise<NormalizedBonsai | null> {
  const all = await fetchBonsais()
  return all.find((item) => item.slug === slug) ?? null
}
```

**Суть проблемы:**  
Для открытия страницы одного дерева делается запрос `getEntries({ content_type: 'bonsais', limit: 1000 })`, загружаются все assets через includes, нормализуются все записи, генерируются все слаги — и только потом находится одна. При 100+ деревьях это избыточно.

**Приоритет:** 🔴 Критично  
**Рекомендация:**  
Поскольку слаги вычисляются из title (не хранятся в Contentful), нельзя напрямую запросить по slug. Два варианта:
1. **Добавить поле `slug` в Contentful** — тогда можно делать `getEntries({ 'fields.slug': slug, limit: 1 })`.
2. **Без изменения CMS** — кэшировать результат `fetchBonsais()` на уровне сервера (Nuxt server cache / `cachedEventHandler`), чтобы повторные вызовы не делали запрос к Contentful.

Второй вариант проще и решает проблему для всех страниц сразу.

---

### 2.2. Мутация массива через `splice` в `watch`

**Где найдено:**
- `app/pages/bonsai/index.vue`, строки ~155–157
- `app/pages/bonsai/style/[slug].vue`, строки ~165–167

```ts
watch(availabilityWithCounts, (newVal) => {
  availabilityOptions.splice(0, availabilityOptions.length, ...newVal)
}, { immediate: true })
```

**Суть проблемы:**  
`availabilityOptions` объявлен как `const` массив, а затем мутирует через `splice` при каждом изменении `availabilityWithCounts`. Это антипаттерн — `SelectFilter` получает `items` как prop, и реактивность работает через ссылку. Паттерн с `splice` работает, но запутывает и ломается при рефакторинге.

**Приоритет:** 🟡 Средне  
**Рекомендация:**  
Заменить `availabilityOptions` на `computed`, передавать результат напрямую в `<SelectFilter :items="availabilityWithCounts">`. Убрать `watch` полностью.

---

### 2.3. Пустой файл `shared/types/filter.ts`

**Где найдено:** `shared/types/filter.ts`

**Суть проблемы:**  
Файл существует, но пуст. `FilterItem` определён в `shared/types/contentful.ts`. При этом обе страницы каталога импортируют `from '../../../shared/types/filter'`, что работает (Nuxt auto-import), но создаёт путаницу.

**Приоритет:** 🟢 Мелочь  
**Рекомендация:**  
Либо перенести `FilterItem` в `filter.ts` (логичнее по имени), либо удалить `filter.ts` и обновить импорты на `contentful.ts`.

---

### 2.4. Нekonсистентная обработка ошибок в API

**Где найдено:**
- `server/api/bonsais.get.ts` — возвращает `{ success: false, error, items: [] }`
- `server/api/bonsais/[slug].get.ts` — бросает `createError({ statusCode: 404 })`

**Суть проблемы:**  
Списочные эндпоинты ловят ошибки и возвращают `{ success: false }`, а одиночный — бросает HTTP-ошибку. Композаблы на фронте проверяют `data.value?.items ?? []`, но не проверяют `success: false`. Если Contentful вернёт ошибку, фронт покажет пустой список без сообщения.

**Приоритет:** 🟡 Средне  
**Рекомендация:**  
Унифицировать: либо все эндпоинты бросают `createError`, либо все возвращают `{ success, ... }`. Рекомендуется первый вариант — Nuxt корректно обрабатывает HTTP-ошибки на фронте через `error` из `useFetch`.

---

### 2.5. Тестовый эндпоинт `test-contentful.ts` в продакшене

**Где найдено:** `server/api/test-contentful.ts`

**Суть проблемы:**  
Эндпоинт `/api/test-contentful` отдаёт полный каталог бонсай без какой-либо авторизации. Дублирует `/api/bonsais`, но с дополнительным полем `total`. Не нужен в продакшене.

**Приоритет:** 🟡 Средне  
**Рекомендация:**  
Удалить файл или обернуть в проверку `if (!import.meta.dev) throw createError(404)`.

---

### 2.6. `siteUrl` по умолчанию = `localhost:3000`

**Где найдено:** `nuxt.config.ts`, строка 40

```ts
public: {
  siteUrl: 'http://localhost:3000',
},
```

**Суть проблемы:**  
Если env-переменная `NUXT_PUBLIC_SITE_URL` не задана, canonical URL, OG url и sitemap будут ссылаться на `localhost`. Это критично для SEO.

**Приоритет:** 🟡 Средне  
**Рекомендация:**  
Установить `siteUrl: 'https://my-bonsai.eu'` как значение по умолчанию. Localhost должен использоваться только в dev-режиме через `.env` файл.

---

### 2.7. Искусственная задержка лоадера (200ms + 200ms)

**Где найдено:** `app/plugins/loader.client.ts`, строки 8–14

```ts
router.beforeEach(async () => {
  loaderStore.setLoader(true)
  await new Promise((resolve) => setTimeout(resolve, 200))
})
router.afterEach(() => {
  setTimeout(() => { loaderStore.setLoader(false) }, 200)
})
```

**Суть проблемы:**  
Плагин добавляет минимум 400ms к каждому переходу между страницами (200ms до + 200ms после). Это замедляет UX без причины — лоадер должен показываться только если навигация занимает >100-200ms, а не добавляться искусственно.

**Приоритет:** 🟡 Средне  
**Рекомендация:**  
Показывать лоадер только если навигация длится дольше ~300ms (через `setTimeout` в `beforeEach`, который отменяется в `afterEach`). Убрать `await new Promise(200)` — это искусственная задержка.

---

### 2.8. `Navigation.vue` использует `<div>` вместо семантических элементов

**Где найдено:** `app/components/Navigation.vue`

**Суть проблемы:**  
Навигационные элементы обёрнуты в `<div class="navigation__item">` вместо использования `<nav>` + `<ul>/<li>` или хотя бы `<button>`. Нет `<nav>` элемента. CSS-подчёркивание при hover работает на div, а не на ссылке.

**Приоритет:** 🟡 Средне  
**Рекомендация:**  
Обернуть в `<nav>`, заменить `<div class="navigation__item">` на прямую стилизацию `<NuxtLink>`. Убрать лишние обёртки.

---

### 2.9. `StyleData` не импортируется в `styles.ts`

**Где найдено:** `shared/data/styles.ts`

**Суть проблемы:**  
Файл использует тип `StyleData` (в `Record<string, StyleData>` и в типе `allStylesData`), но не импортирует его из `shared/types/contentful.ts`. Это работает только потому, что Nuxt auto-imports подхватывает типы из `shared/types/`.

**Приоритет:** 🟢 Мелочь  
**Рекомендация:**  
Добавить явный импорт `import type { StyleData } from '../types/contentful'` для прозрачности.

---

### 2.10. `useLoaderStore` экспортирует лишнее

**Где найдено:** `app/stores/loader.ts`

**Суть проблемы:**  
Store экспортирует и `loaderState` (ref), и `isLoading` (computed от того же ref). Внешний код использует только `isLoading`. `loaderState` — лишнее.

**Приоритет:** 🟢 Мелочь  
**Рекомендация:**  
Убрать `loaderState` из return, оставить только `isLoading` и `setLoader`.

---

### 2.11. `@contentful/rich-text-plain-text-renderer` установлен, но не используется

**Где найдено:** `package.json`, строка 8

**Суть проблемы:**  
Пакет `@contentful/rich-text-plain-text-renderer` listed в dependencies, но нигде в проекте не импортируется.

**Приоритет:** 🟢 Мелочь  
**Рекомендация:**  
Удалить из `package.json` через `npm uninstall @contentful/rich-text-plain-text-renderer`.

---

### 2.12. CSS-опечатка: `Font-size` вместо `font-size`

**Где найдено:** `app/components/product/BonsaiCard.vue`, строка ~118

```css
.bonsai-card__spec-value {
  Font-size: 16px;  /* заглавная F */
}
```

**Суть проблемы:**  
CSS-свойство написано с заглавной буквы. CSS case-insensitive, так что это работает, но нарушает конвенцию и может confouse при linting.

**Приоритет:** 🟢 Мелочь  
**Рекомендация:**  
Исправить на `font-size`.

---

### 2.13. `isActiveBonsai` в Navigation — избыточный computed

**Где найдено:** `app/components/Navigation.vue`, строки ~30–34

**Суть проблемы:**  
`NuxtLink` автоматически добавляет класс `router-link-active` для совпадающих маршрутов. Код вручную добавляет этот класс через `:class="{ 'router-link-active': isActiveBonsai }"`, что дублирует встроенное поведение.

**Приоритет:** 🟢 Мелочь  
**Рекомендация:**  
Использовать `NuxtLink` с `exact-active-class` или встроенный `router-link-active` + CSS `:has()` (что уже частично сделано). Убрать `isActiveBonsai` computed.

---

## 3. SEO-аудит (технический)

### 3.1. Title template создаёт двойные суффиксы

**Где найдено:** `nuxt.config.ts` + `app/pages/bonsai/[slug].vue`

**Суть проблемы:**  
`titleTemplate: '%s | Bonsai Shop'` добавляет "| Bonsai Shop" ко всем title. Но `bonsai/[slug].vue` устанавливает `title: '${bonsai.value.title} | My Bonsai'`. Итоговый title: `"Tree Name | My Bonsai | Bonsai Shop"` — двойной суффикс, 45+ символов только на накладные расходы.

Аналогично, `index.vue` устанавливает `'Buy Bonsai Trees in Ireland & Europe | My Bonsai'` → итог: `"Buy Bonsai Trees in Ireland & Europe | My Bonsai | Bonsai Shop"`.

**Приоритет:** 🔴 Критично  
**Рекомендация:**  
Выбрать один подход:
- Либо убрать `titleTemplate` и добавлять суффикс вручную на каждой странице.
- Либо убрать суффикс из `useHead` на страницах и доверить `titleTemplate`.

Рекомендуется второй вариант: `titleTemplate: '%s | My Bonsai'`, а на страницах ставить просто `title: 'Tree Name'`.

---

### 3.2. Отсутствуют OpenGraph и Twitter Card мета-теги

**Где найдено:** Все страницы кроме `bonsai/[slug].vue`

**Суть проблемы:**  
Только детальная страница дерева имеет OG-теги. Остальные 6 страниц (home, catalog, services, gallery, contacts, 404) не имеют:
- `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

При шаринге в соцсетях ссылки будут без превью.

**Приоритет:** 🔴 Критично  
**Рекомендация:**  
Добавить OG-теги на каждую страницу через `useHead`. Для изображений использовать header-desktop.webp или первое изображение из каталога. Можно создать композабл `useSeoMeta(options)` для унификации.

---

### 3.3. Отсутствует BreadcrumbList JSON-LD

**Где найдено:** Все страницы

**Суть проблемы:**  
Визуальные хлебные крошки есть (компонент `Breadcrumb.vue`), но структурированные данные `BreadcrumbList` (Schema.org) не добавлены нигде. Google использует их для красивого отображения в сниппетах.

**Приоритет:** 🔴 Критично  
**Рекомендация:**  
Добавить генерацию `BreadcrumbList` JSON-LD в компонент `Breadcrumb.vue` или в layout. Данные уже есть в `items` computed — нужно просто сериализовать в JSON-LD формат.

---

### 3.4. Отсутствуют Organization/LocalBusiness JSON-LD

**Где найдено:** Главная страница, страница контактов

**Суть проблемы:**  
Нет структурированных данных о бизнесе (название, адрес, телефон, email, соцсети). Google использует `Organization` или `LocalBusiness` для knowledge panel.

**Приоритет:** 🟡 Средне  
**Рекомендация:**  
Добавить `Organization` JSON-LD на главную страницу и/или в layout (глобально). Включить: name, url, logo, sameAs (соцсети), contactPoint.

---

### 3.5. Отсутствуют CollectionPage и ItemList JSON-LD на каталоге

**Где найдено:** `app/pages/bonsai/index.vue`

**Суть проблемы:**  
Каталог — главная коммерческая страница, но не имеет `ItemList` JSON-LD для списка товаров. Google может отображать карусель товаров в поиске.

**Приоритет:** 🟡 Средне  
**Рекомендация:**  
Добавить `ItemList` JSON-LD с массивом `itemListElement` (каждый бонсай как `ListItem` с `position`, `name`, `url`, `image`).

---

### 3.6. `_robots.txt` указывает HTTP для sitemap

**Где найдено:** `public/_robots.txt`

```
Sitemap: http://my-bonsai.eu/sitemap.xml
```

**Суть проблемы:**  
Указан `http://` вместо `https://`. Также файл называется `_robots.txt` (с подчёркиванием) — если `@nuxtjs/robots` не обрабатывает его, то настоящий `robots.txt` может отсутствовать.

**Приоритет:** 🟡 Средне  
**Рекомендация:**  
Проверить, что `@nuxtjs/robots` модуль генерирует корректный `robots.txt`. Если используется `_robots.txt` как шаблон — исправить URL на `https://`.

---

### 3.7. Sitemap: `lastmod` = `new Date()` для всех URL

**Где найдено:** `server/api/__sitemap__/urls.ts`, строки 13, 24

**Суть проблемы:**  
Все URL в sitemap имеют `lastmod: new Date()` — т.е. текущую дату. Это означает, что при каждой генерации sitemap все страницы получают сегодняшнюю дату, независимо от реальных изменений. Google может расценить это как манипуляцию.

**Приоритет:** 🟡 Средне  
**Рекомендация:**  
Использовать дату последнего изменения записи в Contentful (`sys.updatedAt`) как `lastmod`. Для статических style-страниц — фиксированную дату.

---

### 3.8. Изображения: нет lazy loading, нет @nuxt/image

**Где найдено:**
- `app/pages/bonsai/[slug].vue` — `<img :src="img.url">`
- `app/pages/gallery.vue` — `<img :src="img.url">`
- `app/pages/services.vue` — `<img :src="service.imageUrl">`
- `app/components/product/BonsaiCard.vue` — `<img :src="bonsai.images[0].url">`
- `app/components/Header.vue` — `<img src="/header-desktop.webp">`

**Суть проблемы:**  
Модуль `@nuxt/image` установлен, но нигде не используется. Все изображения — обычные `<img>` с прямыми URL из Contentful. Нет:
- `loading="lazy"` — все картинки грузятся сразу
- Оптимизации формата/размера через NuxtImage
- Responsive images (srcset)
- Контроля качества/compression

**Приоритет:** 🔴 Критично  
**Рекомендация:**  
Заменить все `<img>` на `<NuxtImg>` (или `<NuxtPicture>` для Header). Добавить `loading="lazy"` для всех изображений ниже fold. NuxtImage автоматически оптимизирует формат и размер.

---

### 3.9. Alt-тексты: неуникальные в галерее

**Где найдено:** `app/pages/gallery.vue`, строка ~16

```html
<img :src="img.url" alt="Gallery image" />
```

**Суть проблемы:**  
Все изображения в галерее имеют одинаковый alt "Gallery image". Для SEO и доступности каждый alt должен описывать конкретное изображение.

**Приоритет:** 🟡 Средне  
**Рекомендация:**  
Добавить поле `alt` в Contentful для gallery items, или использовать `item.description` как alt. Если описания нет — хотя бы `"Gallery image {index}"`.

---

### 3.10. `<html lang="en">` — возможно некорректно

**Где найдено:** `nuxt.config.ts`, строка 22

**Суть проблемы:**  
`lang: 'en'` установлен глобально. Весь контент на английском — это корректно для англоязычного сайта. Но если планируется мультиязычность (ирландский/русский), потребуется `hreflang`.

**Приоритет:** 🟢 Мелочь  
**Рекомендация:**  
Если сайт только на английском — оставить `en`. Если планируется мультиязычность — заложить `hreflang` на этапе архитектуры.

---

### 3.11. H1 на страницах

**Где найдено:** Все страницы

**Анализ:**
| Страница | H1 | Статус |
|---|---|---|
| `/` | Нет H1 (RichText рендерит контент из CMS — неизвестно, есть ли там H1) | 🟡 Проверить |
| `/bonsai` | `<h1>Bonsai Collection</h1>` | ✅ |
| `/bonsai/:slug` | `<div class="main__header">` — это `<div>`, не `<h1>` | 🔴 Нет H1 |
| `/bonsai/style/:slug` | `<h1>{{ styleData.title }} Bonsai</h1>` | ✅ |
| `/services` | `<div class="main__header">Services</div>` — не H1 | 🔴 Нет H1 |
| `/gallery` | `<div class="main__header">Gallery</div>` — не H1 | 🔴 Нет H1 |
| `/contacts` | `<div class="main__header">Contacts</div>` — не H1 | 🔴 Нет H1 |

**Приоритет:** 🔴 Критично  
**Рекомендация:**  
Заменить `<div class="main__header">` на `<h1 class="main__header">` на страницах services, gallery, contacts. На странице `bonsai/:slug` — сделать title как `<h1>`. На главной — проверить, что RichText содержит H1.

---

## 4. SEO-аудит (содержательный)

### 4.1. Отсутствуют важные SEO-страницы

**Суть проблемы:**  
Сайт не имеет страниц, которые могли бы привлекать информационный трафик и повышать авторитет домена:

| Страница | Потенциал | Приоритет |
|---|---|---|
| `/about` | E-E-A-T сигнал для Google, история бизнеса | 🟡 Средне |
| `/blog` или `/articles` | Информационный трафик, длинные ключевые слова | 🟡 Средне |
| `/faq` | Featured snippets, длинные ключевые слова | 🟡 Средне |
| `/care-guide` или `/bonsai-care` | Информационный трафик, "how to care for bonsai" | 🟡 Средне |
| `/shipping` | Коммерческий трафик, "bonsai delivery Ireland" | 🟢 Мелочь |
| `/bonsai/types/pine`, `/bonsai/types/juniper` | Трафик по породам деревьев | 🟡 Средне |
| `/glossary` | Трафик по терминам бонсай | 🟢 Мелочь |

**Приоритет:** 🟡 Средне  
**Рекомендация:**  
Начать с `/about` и `/bonsai-care` (или `/faq`) — они дают максимальный E-E-A-T сигнал. Блог — долгосрочная стратегия. Страницы по породам — если есть деревья разных пород в каталоге.

---

### 4.2. SEO-описания стилей — качество

**Где найдено:** `shared/data/styles.ts`

**Суть проблемы:**  
Описания стилей хорошие — каждое содержит уникальные ключевые слова, упоминание "delivery across Europe", и конкретное описание формы. MetaTitle содержат "for Sale" и "My Bonsai" — хорошо для коммерческих запросов.

Однако:
- Все metaDescription следуют одному шаблону: "Buy/Shop/Browse/Discover [style] bonsai trees. [Description]. [Delivery CTA]." — это хорошо, но можно добавить уникальные детали (возраст, размер, цена).
- Нет внутренних ссылок между описаниями стилей (cross-linking).

**Приоритет:** 🟢 Мелочь  
**Рекомендация:**  
Добавить cross-linking между style-страницами в описаниях. Рассмотреть добавление конкретного диапазона возраста/цены в описания.

---

### 4.3. Дублирование текстов между страницами

**Суть проблемы:**  
Каталог (`/bonsai`) и style-страницы (`/bonsai/style/:slug`) показывают одинаковые карточки деревьев с одинаковыми описаниями. При этом `allStylesData.description` на каталоге частично пересекается с описаниями отдельных стилей.

Дублирование не критично (style-страницы имеют уникальный контент в виде описания стиля), но стоит следить за canonical.

**Приоритет:** 🟢 Мелочь  
**Рекомендация:**  
Убедиться, что style-страницы имеют `rel="canonical"` на себя. Добавить canonical на `/bonsai` и style-страницы (сейчас canonical есть только на `index.vue` и `bonsai/[slug].vue`).

---

## 5. UX и доступность (a11y)

### 5.1. Попапы: нет focus trap, Escape, aria-атрибутов

**Где найдено:**
- `app/pages/bonsai/[slug].vue` (popup section)
- `app/pages/gallery.vue` (popup section)

**Суть проблемы:**  
Лайтбокс-попапы:
- Нет `role="dialog"` и `aria-modal="true"`
- Нет focus trap — Tab уходит за попап
- Нет закрытия по Escape
- Нет возврата фокуса на триггер после закрытия
- Кнопка закрытия не имеет `aria-label`

**Приоритет:** 🟡 Средне  
**Рекомендация:**  
При создании компонента `ImageLightbox.vue` (п. 1.2) реализовать:
- `role="dialog"`, `aria-modal="true"`, `aria-label`
- Focus trap (через `@vueuse/integrations` или вручную)
- `@keydown.esc="close"`
- Сохранение `document.activeElement` перед открытием и возврат фокуса после

---

### 5.2. SelectFilter: нет keyboard navigation

**Где найдено:** `app/components/product/SelectFilter.vue`

**Суть проблемы:**  
Кастомный dropdown:
- Нет `role="listbox"` на контейнере
- Нет `role="option"` на элементах
- Нет `aria-activedescendant` для активной опции
- Нет навигации стрелками ↑↓
- Нет Home/End
- Нет `aria-expanded` на триггере (хотя `:aria-expanded` есть — ✅)
- Нет `aria-haspopup="listbox"`

**Приоритет:** 🟡 Средне  
**Рекомендация:**  
Добавить ARIA-атрибуты и keyboard handler: ArrowUp/ArrowDown для навигации, Enter/Space для выбора, Escape для закрытия, Home/End для перехода к первой/последней опции.

---

### 5.3. Контакты: текст вместо ссылок

**Где найдено:** `app/pages/contacts.vue`

**Суть проблемы:**  
Контактная информация (телефон, email) отображается как текст в `<div>`, а не как кликабельные ссылки `<a href="tel:...">` и `<a href="mailto:...">`. На мобильных устройствах пользователь не может тапнуть для звонка.

**Приоритет:** 🟡 Средне  
**Рекомендация:**  
Определять тип контакта (phone/email/web) и рендерить соответствующую ссылку. Или добавить поле `link` в Contentful content type `contacts`.

---

### 5.4. Контрастность цветов

**Где найдено:** `app/assets/css/variables.css`

**Анализ контрастности:**
| Пара | Контраст | WCAG AA (normal) | WCAG AA (large) |
|---|---|---|---|
| `#666666` on `#ffffff` (--text-muted on --white) | 5.74:1 | ✅ Pass | ✅ Pass |
| `#c46c64` on `#ffffff` (--link-color on --white) | 3.75:1 | ❌ Fail | ✅ Pass (large only) |
| `#444444` on `#ffffff` (nav links) | 9.29:1 | ✅ Pass | ✅ Pass |
| `#BC002D` on `#ffffff` (--accent on --white) | 4.63:1 | ✅ Pass (AA) | ✅ Pass |
| `#ffffff` on `#BC002D` (white on accent) | 4.63:1 | ✅ Pass (AA) | ✅ Pass |

**Суть проблемы:**  
`--link-color: #c46c64` не проходит WCAG AA для обычного текста (нужно минимум 4.5:1). Ссылки в описаниях и текстах могут быть неразличимы для людей с ослабленным зрением.

**Приоритет:** 🟡 Средне  
**Рекомендация:**  
Затемнить `--link-color` до `#b0554d` или подобного (контраст ~5:1). Или использовать `--accent-color` для ссылок.

---

### 5.5. Нет skip navigation link

**Где найдено:** `app/layouts/default.vue`

**Суть проблемы:**  
Нет ссылки "Skip to main content" для keyboard users. Пользователь, навигирующий с клавиатуры, вынужден проходить через Header и Navigation на каждой странице.

**Приоритет:** 🟢 Мелочь  
**Рекомендация:**  
Добвить скрытый `<a href="#main-content" class="skip-link">Skip to content</a>` в начало layout, с CSS `:focus` стилем для видимости.

---

### 5.6. Нет `prefers-reduced-motion` поддержки

**Где найдено:**
- `app/components/Loading.vue` (spin animation)
- `app/components/product/BonsaiCard.vue` (hover translateY)
- `app/components/product/SelectFilter.vue` (dropdown transition)
- `app/assets/css/main.css` (fade transition)

**Суть проблемы:**  
Анимации не учитывают `prefers-reduced-motion: reduce`. Для пользователей с вестибулярными расстройствами анимации могут вызывать дискомфорт.

**Приоритет:** 🟢 Мелочь  
**Рекомендация:**  
Добавить в `main.css`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### 5.7. `container` имеет `overflow: hidden`

**Где найдено:** `app/assets/css/main.css`, строка ~33

```css
.container {
  overflow: hidden;
}
```

**Суть проблемы:**  
`overflow: hidden` на корневом контейнере может обрезать контент, если что-то выходит за границы (например, dropdown фильтров, popup). Это также может мешать скроллу на некоторых устройствах.

**Приоритет:** 🟢 Мелочь  
**Рекомендация:**  
Заменить на `overflow-x: hidden` (скрыть только горизонтальный переполнение).

---

## 6. Производительность

### 6.1. Swiper импортируется на всех страницах каталога

**Где найдено:**
- `app/pages/bonsai/[slug].vue`
- `app/pages/gallery.vue`

**Суть проблемы:**  
Swiper — ~150KB (JS + CSS). Он импортируется только на двух страницах, что хорошо (Nuxt lazy-loads page chunks). Но на странице `/bonsai` и `/bonsai/style/:slug` карточки `BonsaiCard` не используют Swiper — он нужен только на детальной странице и в галерее.

Однако Swiper CSS (`swiper/css`, `swiper/css/navigation`, `swiper/css/pagination`) загружается глобально через импорты в page-файлах, и при переходе между страницами может не выгружаться.

**Приоритет:** 🟢 Мелочь  
**Рекомендация:**  
Убедиться, что Swiper CSS не попадает в global CSS. Оставить импорты только в page-компонентах, где он используется (уже так).

---

### 6.2. Изображения не оптимизируются через @nuxt/image

**Где найдено:** Все страницы с изображениями (покрыто в п. 3.8)

**Суть проблемы:**  
Contentful отдаёт изображения в оригинальном формате и размере. Без `@nuxt/image`:
- Нет автоматического WebP/AVIF
- Нет responsive srcset
- Нет lazy loading
- Нет resize/Crop на лету

Это главная проблема производительности — изображения могут весить 1-5MB каждое.

**Приоритет:** 🔴 Критично  
**Рекомендация:**  
Заменить `<img>` на `<NuxtImg>` с параметрами `width`, `height`, `format="webp"`, `loading="lazy"`, `sizes` для responsive. Для Contentful можно настроить `@nuxt/image` provider.

---

### 6.3. Нет серверного кэширования для Contentful

**Где найдено:** `server/utils/bonsai.ts`, `server/utils/contentful.ts`

**Суть проблемы:**  
Каждый запрос к `/api/bonsais` (и всем остальным) делает живой запрос к Contentful API. Нет кэширования на уровне сервера. При высоком трафике это:
- Замедляет ответ (Contentful API latency ~200-500ms)
- Может упереться в rate limits Contentful
- Загружает сервер при каждом SSR

**Приоритет:** 🟡 Средне  
**Рекомендация:**  
Использовать `cachedEventHandler` от Nuxt (или `defineCachedEventHandler`) для кэширования ответов API. TTL 5-15 минут для каталога, 1 час для статических данных. Это также решит проблему `fetchBonsaiBySlug` (п. 2.1).

---

### 6.4. Шрифты: нет preconnect для Google Fonts

**Где найдено:** `nuxt.config.ts`

**Суть проблемы:**  
Public Sans загружается с Google Fonts (видимо, через `<link>` в HTML или из CSS), но нет `preconnect` hint для `fonts.googleapis.com` и `fonts.gstatic.com`. Это добавляет ~100-300ms к загрузке шрифта.

**Приоритет:** 🟡 Средне  
**Рекомендация:**  
Добавить в `nuxt.config.ts` → `app.head.link`:
```ts
{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
{ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
```

Или лучше — self-host Public Sans через `@fontsource/public-sans`, чтобы убрать внешнюю зависимость.

---

### 6.5. Декоративные SVG 800px

**Где найдено:** `app/layouts/default.vue`, строки 9–12

```html
<div class="content__left-img">
  <NavigationIcon :size="800" />
</div>
<div class="content__right-img">
  <NavigationIcon :size="800" />
</div>
```

**Суть проблемы:**  
Два инлайн-SVG с 20+ сложными path-элементами, каждый 800×800px, рендерятся на каждой странице. SVG весит ~10KB каждый и парсится браузером. При opacity 0.05 они практически невидимы.

**Приоритет:** 🟢 Мелочь  
**Рекомендация:**  
Рассмотреть замену на PNG/WebP спрайт (растрированный SVG при 5% opacity неотличим от оригинала). Или упростить SVG path.

---

## 7. Безопасность

### 7.1. XSS через v-html в RichText.vue

**Где найдено:** `app/components/RichText.vue`, строка 2

```html
<div class="rich-text" v-html="html"></div>
```

**Суть проблемы:**  
`documentToHtmlString` из Contentful SDK конвертирует rich-text в HTML без санитизации. Если в Contentful попадёт вредоносный контент (через взломанный аккаунт редактора), `<script>` или `onerror` handlers отрендерятся на странице.

Также, в `BLOCKS.EMBEDDED_ASSET` handler:
```ts
const alt = node.data.target.fields.title || ''
return `<img src="https:${url}" alt="${alt}" />`
```
Если `alt` содержит `"`, это.break out из атрибута → XSS.

**Приоритет:** 🔴 Критично  
**Рекомендация:**  
Использовать DOMPurify (или `xss`) для санитизации HTML перед `v-html`. Или перейти на безопасный рендеринг через Vue-компоненты вместо `v-html`.

Минимальный фикс: экранировать `alt` и `url` перед вставкой в HTML-строку.

---

### 7.2. Нет CSP-заголовков

**Где найдено:** `nuxt.config.ts` (отсутствует конфигурация security headers)

**Суть проблемы:**  
Нет Content Security Policy заголовков. Сайт не защищён от inline-script инъекций, XSS через загружаемые скрипты, и data-exfiltration через form actions.

**Приоритет:** 🟡 Средне  
**Рекомендация:**  
Настроить CSP через Nuxt security module (`nuxt-security`) или через server middleware. Минимальная политика:
- `default-src 'self'`
- `script-src 'self'` (без `unsafe-inline` — но это потребует рефакторинга v-html)
- `img-src 'self' https://images.ctfassets.net`
- `font-src 'self' https://fonts.gstatic.com`
- `style-src 'self' 'unsafe-inline'` (Vue scoped CSS требует inline styles)

---

### 7.3. Contentful токены — только на сервере ✅

**Где найдено:** `nuxt.config.ts`, `runtimeConfig`

**Суть проблемы:**  
Отсутствует. Токены Contentful (`contentfulAccessToken`, `contentfulPreviewAccessToken`) находятся в `runtimeConfig` (не в `runtimeConfig.public`), что означает, что они доступны только на сервере. Это правильно.

**Приоритет:** ✅ Нет проблемы  
**Рекомендация:**  
Не трогать. Убедиться, что в `.env` файле токены не коммитятся (проверить `.gitignore`).

---

### 7.4. Нет rate limiting на API

**Где найдено:** Все `server/api/*.ts`

**Суть проблемы:**  
API-эндпоинты не имеют rate limiting. Злоумышленник может отправить тысячи запросов, что приведёт к:
- Исчерпанию rate limits Contentful
- Нагрузке на сервер
- Возможному DDoS

**Приоритет:** 🟡 Средне  
**Рекомендация:**  
Добавить rate limiting через `h3` middleware или Nuxt security module. Минимум: 60 запросов/минуту на IP для API-эндпоинтов.

---

### 7.5. Нет CORS-настройки

**Где найдено:** `nuxt.config.ts`

**Суть проблемы:**  
API-эндпоинты не имеют явных CORS-заголовков. По умолчанию H3 не устанавливает CORS, что означает, что API недоступен с других доменов. Для SSR-приложения это нормально (фронт обращается к API через server-side fetch). Но если планируется client-side fetching с другого домена — нужен CORS.

**Приоритет:** 🟢 Мелочь  
**Рекомендация:**  
Если API используется только внутренне (SSR) — не трогать. Если нужен доступ извне — настроить через `nitro.routeRules` или middleware.

---

## Что точно не трогать

Эти части проекта работают хорошо и не нуждаются в рефакторинге:

1. **CSS-переменные и система дизайна** — `variables.css` чистый, консистентный, с responsive overrides. Хорошая архитектура.

2. **Shared data для стилей** (`shared/data/styles.ts`) — 14 стилей с SEO-метаданными, helper-функции. Хорошо структурировано, легко расширять.

3. **Slugify utility** (`shared/utils/slugify.ts`) — Unicode-aware (NFD normalization), уникализация через `makeUniqueSlug`. Корректная реализация.

4. **Композаблы для data fetching** — `useBonsai`, `useBonsais`, `useContacts` и т.д. Чистые, типизированные, с правильными cache keys. Хороший паттерн.

5. **Breadcrumb.vue** — семантический `<nav>` + `<ol>`, `aria-label="Breadcrumb"`, корректная логика построения из `route.path`. Хорошо.

6. **SelectFilter.vue** — корректный outside-click handler, анимация dropdown, disabled states для zero-count options. Компонент хорошо спроектирован (кроме a11y, см. п. 5.2).

7. **Структура проекта** — разделение `server/utils` → `server/api` → `composables` → `pages` чистое и консистентное. Nuxt-конвенции соблюдаются.

8. **SSR через useFetch** — все данные фетчатся через `useFetch` с серверным API, что обеспечивает корректный SSR и hydration.

9. **Schema.org Product JSON-LD** на детальной странице дерева — корректная реализация с `offers`, `availability`, `image`.

10. **Responsive breakpoints** — система брейкпоинтов (1679/1299/1199/991/767) консистентна, гриды адаптируются корректно.

11. **Pinia loader store** — минимальный, делает одну вещь. Интеграция через plugin с router hooks — правильный подход.

12. **Contentful client factory** (`server/utils/contentful.ts`) — singleton pattern, preview client factory, typed exports. Чисто.

---

## Сводная таблица по приоритетам

| Приоритет | Количество | Ключевые проблемы |
|---|---|---|
| 🔴 Критично | 8 | XSS, дублирование фильтров, нет OG-тегов, нет H1, нет lazy loading, нет BreadcrumbList, title дубли, fetchBySlug |
| 🟡 Средне | 17 | Focus trap, keyboard nav, контраст, кэширование, CSP, rate limiting, canonical, sitemap lastmod, preconnect, contacts as links, popup дубли, normalizeImage дубли, error handling, test endpoint, siteUrl, loader delay, CollectionPage |
| 🟢 Мелочь | 12 | CSS typo, пустой файл, неиспользуемый пакет, skip link, reduced motion, overflow hidden, SVG 800px, CORS, hreflang, Swiper imports, StyleData import, loader store |

**Итого: 37 находок** (8 критичных, 17 средних, 12 мелких)
