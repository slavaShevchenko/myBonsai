<template>
  <div v-if="styleData">
    <div class="style-header">
      <h1 class="style-title">{{ styleData.title }} Bonsai</h1>
      <p class="style-description">{{ styleData.description }}</p>
    </div>

    <BonsaiCatalog
      :pending="pending"
      :filtered-bonsais="filteredBonsais"
      :available-tags="availableTags"
      :available-styles="availableStyles"
      :availability-options="availabilityOptions"
      v-model:selected-tag-id="selectedTagId"
      v-model:selected-style-id="selectedStyleId"
      v-model:selected-availability="selectedAvailability"
      :empty-message="`No ${styleData.title} bonsai found matching your filters`"
    />
  </div>
</template>

<script setup lang="ts">
import type { NormalizedBonsai } from '~~/shared/types/contentful'
import { getStyleBySlug } from '~~/shared/data/styles'

const route = useRoute()
const config = useRuntimeConfig()

// Реактивный slug — обновляется при навигации между стилями без перезагрузки
const slug = computed(() => String(route.params.slug || '').toLowerCase())
const styleData = computed(() => getStyleBySlug(slug.value))

if (!styleData.value) {
  throw createError({ statusCode: 404, statusMessage: 'Style not found' })
}

const pageTitle = computed(() =>
  (styleData.value?.metaTitle ?? '').replace(/\s*\|\s*My Bonsai$/, '')
)
const pageDescription = computed(() => styleData.value?.metaDescription ?? '')
const pageUrl = computed(() => `${config.public.siteUrl}/bonsai/style/${slug.value}`)

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

const { data, pending, error } = await useBonsais()

if (error.value) {
  throw createError({ statusCode: 500, statusMessage: 'Failed to load bonsai collection' })
}

const allBonsais = computed<NormalizedBonsai[]>(() => data.value?.items ?? [])

const {
  selectedTagId,
  selectedStyleId,
  selectedAvailability,
  availableTags,
  availableStyles,
  availabilityOptions,
  filteredBonsais,
} = useBonsaiFilters(allBonsais, { fixedStyle: slug })
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

@media (max-width: 767px) {
  .style-title {
    font-size: 32px;
  }
  .style-description {
    font-size: 16px;
  }
}
</style>