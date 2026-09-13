<template>
  <nav v-if="items.length" class="breadcrumb" aria-label="Breadcrumb">
    <ol class="breadcrumb__list">
      <li class="breadcrumb__item">
        <NuxtLink to="/" class="breadcrumb__link">Home</NuxtLink>
      </li>
      <li v-for="(item, index) in items" :key="index" class="breadcrumb__item">
        <span class="breadcrumb__separator">/</span>
        <NuxtLink
          v-if="item.to && index < items.length - 1"
          :to="item.to"
          class="breadcrumb__link"
        >
          {{ item.label }}
        </NuxtLink>
        <span v-else class="breadcrumb__current">
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { getStyleBySlug } from '~~/shared/data/styles'

const route = useRoute()
const config = useRuntimeConfig()

interface BreadcrumbItem {
  label: string
  to?: string
}

const staticPages: Record<string, string> = {
  services: 'Services',
  gallery: 'Gallery',
  contacts: 'Contacts',
}

const items = computed<BreadcrumbItem[]>(() => {
  const parts = route.path.split('/').filter(Boolean)

  // Главная страница — крошки не нужны
  if (parts.length === 0) {
    return []
  }

  if (parts[0] === 'bonsai') {
    // Страница стиля: /bonsai/style/moyogi
    if (parts[1] === 'style' && parts[2]) {
      const style = getStyleBySlug(parts[2])
      return [
        { label: 'Bonsai', to: '/bonsai' },
        { label: style ? style.title : parts[2] },
      ]
    }

    // Страница товара: /bonsai/slug
    if (parts[1]) {
      return [
        { label: 'Bonsai', to: '/bonsai' },
        { label: (route.meta.breadcrumbTitle as string) || parts[1] },
      ]
    }

    // Каталог: /bonsai
    return [{ label: 'Bonsai Collection' }]
  }

    // Статические страницы: /services, /gallery, /contacts
  const firstSegment = parts[0]
  const staticLabel = firstSegment ? staticPages[firstSegment] : undefined
  if (staticLabel) {
    return [{ label: staticLabel }]
  }

  return []
})

// Генерация BreadcrumbList JSON-LD для Google
const breadcrumbJsonLd = computed(() => {
  if (!items.value.length) return null

  const baseUrl = config.public.siteUrl
  const listElements = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${baseUrl}/`,
    },
  ]

  items.value.forEach((item, index) => {
    const position = index + 2
    const listItem: any = {
      '@type': 'ListItem',
      position,
      name: item.label,
    }
    // Последний элемент не содержит "item" (это текущая страница)
    if (item.to && index < items.value.length - 1) {
      listItem.item = `${baseUrl}${item.to}`
    }
    listElements.push(listItem)
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: listElements,
  }
})

// Добавляем JSON-LD в <head> только когда есть данные
useHead({
  script: breadcrumbJsonLd.value
    ? [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(breadcrumbJsonLd.value),
        },
      ]
    : [],
})
</script>

<style scoped>
.breadcrumb {
  max-width: 1200px;
  margin: 0 auto 16px auto;
}

.breadcrumb__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 14px;
}

.breadcrumb__item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.breadcrumb__separator {
  color: var(--text-muted, #999);
}

.breadcrumb__link {
  color: var(--text-muted, #666);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb__link:hover {
  color: var(--accent-color, #BC002D);
}

.breadcrumb__current {
  color: var(--primary-color, #111813);
  font-weight: 600;
}
</style>