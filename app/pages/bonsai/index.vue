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
import type { NormalizedBonsai } from '../../../shared/types/contentful'
import { allStylesData } from '../../../shared/data/styles'

const config = useRuntimeConfig()

// Убираем "| My Bonsai" из конца, так как titleTemplate добавит его сам
const pageTitle = 'Bonsai Trees for Sale | All Traditional Japanese Styles'
const pageDescription = allStylesData.metaDescription

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
    { property: 'og:url', content: `${config.public.siteUrl}/bonsai` },
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
      href: `${config.public.siteUrl}/bonsai`,
    },
  ],
})

const { data, pending } = await useBonsais()
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
  font-size: 18px;
  line-height: 1.6;
  color: var(--text-muted, #666);
}

@media (max-width: 767px) {
  .page-title {
    font-size: 32px;
  }
}
</style>