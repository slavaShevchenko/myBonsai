<template>
  <div v-if="styleData">
    <div class="style-header">
      <h1 class="style-title">{{ styleData.title }} Bonsai</h1>
      <p class="style-description">{{ styleData.description }}</p>
    </div>

    <div class="filters">
      <SelectFilter
        :items="availableTags"
        v-model="selectedTagId"
        all-label="All Types"
        label="Type"
      />
      <SelectFilter
        :items="availableStyles"
        v-model="selectedStyleId"
        all-label="All Styles"
        label="Style"
      />
      <SelectFilter
        :items="availabilityOptions"
        v-model="selectedAvailability"
        all-label="All Bonsai"
        label="Availability"
      />
    </div>

    <div v-if="pending" class="loader">Loading...</div>

    <div v-else-if="filteredBonsais.length" class="bonsai__grid">
      <BonsaiCard
        v-for="bonsai in filteredBonsais"
        :key="bonsai.id"
        :bonsai="bonsai"
      />
    </div>

    <div v-else class="empty">
      No {{ styleData.title }} bonsai found matching your filters
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NormalizedBonsai } from '../../../shared/types/contentful'
import type { FilterItem } from '../../../shared/types/filter'
import { getStyleBySlug, getAllStyles } from '../../../shared/data/styles'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const slug = String(route.params.slug || '').toLowerCase()

const styleData = getStyleBySlug(slug)

if (!styleData) {
  throw createError({ statusCode: 404, statusMessage: 'Style not found' })
}

// Убираем "| My Bonsai" из конца — titleTemplate добавит его сам
const pageTitle = styleData.metaTitle.replace(/\s*\|\s*My Bonsai$/, '')
const pageDescription = styleData.metaDescription
const pageUrl = `${config.public.siteUrl}/bonsai/style/${slug}`

useHead({
  title: pageTitle,
  meta: [
    {
      name: 'description',
      content: pageDescription,
    },
    // OpenGraph
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: pageUrl },
    { property: 'og:image', content: `${config.public.siteUrl}/header-desktop.webp` },
    { property: 'og:site_name', content: 'My Bonsai' },
    { property: 'og:locale', content: 'en_IE' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDescription },
    { name: 'twitter:image', content: `${config.public.siteUrl}/header-desktop.webp` },
  ],
  link: [
    {
      rel: 'canonical',
      href: pageUrl,
    },
  ],
})

const { data, pending } = await useBonsais()
const selectedStyleId = ref<string | null>(slug)
const selectedTagId = ref<string | null>(null)
const selectedAvailability = ref<string | null>(null)

const allBonsais = computed<NormalizedBonsai[]>(() => data.value?.items ?? [])

const availableStyles = computed<FilterItem[]>(() => {
  const subset = allBonsais.value.filter((item) => {
    if (selectedTagId.value && !item.tags.includes(selectedTagId.value)) return false
    if (selectedAvailability.value === 'available' && item.sold) return false
    if (selectedAvailability.value === 'sold' && !item.sold) return false
    return true
  })

  const counts = new Map<string, number>()
  for (const style of getAllStyles()) {
    counts.set(style.slug.toLowerCase(), 0)
  }
  for (const item of subset) {
    if (item.style) {
      const styleLower = item.style.toLowerCase()
      counts.set(styleLower, (counts.get(styleLower) ?? 0) + 1)
    }
  }

  return Array.from(counts.entries())
    .map(([id, count]) => {
      const styleInfo = getAllStyles().find((s) => s.slug.toLowerCase() === id)
      return {
        id,
        label: styleInfo ? styleInfo.title : id,
        count,
      }
    })
    .sort((a, b) => b.count - a.count)
})

const availableTags = computed<FilterItem[]>(() => {
  const subset = allBonsais.value.filter((item) => {
    if (item.style?.toLowerCase() !== slug) return false
    if (selectedAvailability.value === 'available' && item.sold) return false
    if (selectedAvailability.value === 'sold' && !item.sold) return false
    return true
  })

  const counts = new Map<string, number>()
  for (const item of allBonsais.value) {
    for (const tag of item.tags) {
      if (!counts.has(tag)) counts.set(tag, 0)
    }
  }
  for (const item of subset) {
    for (const tag of item.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }

  return Array.from(counts.entries())
    .map(([id, count]) => ({ id, label: id.replace(/[_-]/g, ' '), count }))
    .sort((a, b) => b.count - a.count)
})

const availabilityOptions = computed<FilterItem[]>(() => {
  const subset = allBonsais.value.filter((b) => {
    if (b.style?.toLowerCase() !== slug) return false
    if (selectedTagId.value && !b.tags.includes(selectedTagId.value)) return false
    return true
  })

  return [
    { id: 'available', label: 'Available', count: subset.filter((b) => !b.sold).length },
    { id: 'sold', label: 'Sold', count: subset.filter((b) => b.sold).length },
  ]
})

const filteredBonsais = computed(() => {
  return allBonsais.value.filter((item) => {
    if (item.style?.toLowerCase() !== slug) return false
    if (selectedTagId.value && !item.tags.includes(selectedTagId.value)) return false
    if (selectedAvailability.value === 'available' && item.sold) return false
    if (selectedAvailability.value === 'sold' && !item.sold) return false
    return true
  }).sort((a, b) => {
    if (a.sold === b.sold) return 0
    return a.sold ? 1 : -1
  })
})

watch(selectedStyleId, (newStyleId) => {
  if (newStyleId === null) {
    router.push('/bonsai')
    return
  }
  if (newStyleId !== slug) {
    router.push(`/bonsai/style/${newStyleId}`)
  }
})
</script>

<style scoped>
.style-header {
  max-width: 800px;
  margin: 0 auto 40px;
  text-align: center;
}

.style-title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 24px;
  color: var(--primary-color, #111813);
}

.style-description {
  font-size: 18px;
  line-height: 1.6;
  color: var(--text-muted, #666);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
  margin-bottom: 32px;
}

.bonsai__grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
}

.loader,
.empty {
  text-align: center;
  padding: 60px 0;
  font-size: 18px;
  color: var(--text-muted, #666);
}

@media (max-width: 1679px) {
  .bonsai__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1299px) {
  .bonsai__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 991px) {
  .bonsai__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .style-title {
    font-size: 32px;
  }
  .style-description {
    font-size: 16px;
  }
  .bonsai__grid {
    grid-template-columns: 1fr;
  }
  .filters {
    display: block;
  }
}
</style>