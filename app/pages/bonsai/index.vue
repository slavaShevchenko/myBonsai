<template>
  <div>
    <h1 class="page-title">Bonsai Collection</h1>

    <p class="catalog-description">{{ allStylesData.description }}</p>

    <BonsaiCatalog
      :pending="pending"
      :filtered-bonsais="filteredBonsais"
      :available-tags="availableTags"
      :available-styles="availableStyles"
      :availability-options="availabilityOptions"
      v-model:selected-tag-id="selectedTagId"
      v-model:selected-style-id="selectedStyleId"
      v-model:selected-availability="selectedAvailability"
      empty-message="No bonsai found matching your filters"
    />
  </div>
</template>

<script setup lang="ts">
import type { NormalizedBonsai } from '#shared/types/contentful'
import { allStylesData } from '#shared/data/styles'

const config = useRuntimeConfig()
const baseUrl = config.public.siteUrl

const pageTitle = 'Bonsai Trees for Sale | All Traditional Japanese Styles'
const pageDescription = allStylesData.metaDescription
const pageUrl = `${baseUrl}/bonsai`

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: pageUrl },
    { property: 'og:image', content: `${baseUrl}/header-desktop.webp` },
    { property: 'og:site_name', content: 'My Bonsai' },
    { property: 'og:locale', content: 'en_IE' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDescription },
    { name: 'twitter:image', content: `${baseUrl}/header-desktop.webp` },
  ],
  link: [{ rel: 'canonical', href: pageUrl }],
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
} = useBonsaiFilters(allBonsais)

// ItemList JSON-LD — первые 50 бонсай из текущего отфильтрованного списка
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Bonsai Collection',
        description: allStylesData.description,
        numberOfItems: filteredBonsais.value.length,
        itemListElement: filteredBonsais.value.slice(0, 50).map((bonsai, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: bonsai.title,
          url: `${baseUrl}/bonsai/${bonsai.slug}`,
          image: bonsai.images[0]?.url || '',
        })),
      }),
    },
  ],
})
</script>

<style scoped>
.page-title {
  font-size: 48px;
  font-weight: 800;
  margin-top: 0;
  margin-bottom: 32px;
  text-align: center;
}

.catalog-description {
  max-width: 800px;
  margin: -16px auto 32px;
  text-align: center;
  font-size: 16px;
  line-height: 1.4;
  color: var(--text-muted, #666);
}

@media (max-width: 767px) {
  .page-title {
    font-size: 32px;
  }
}
</style>