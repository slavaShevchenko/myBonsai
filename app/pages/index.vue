<template>
  <div class="container">
    <h1 class="page-title">Bonsai Collection</h1>

    <TagFilter
      :tags="tagsWithCounts"
      :selected-tag="selectedTag"
      @update:model-value="selectedTag = $event"
    />

    <div v-if="pending" class="loader">
      Loading...
    </div>

    <div v-else-if="filteredBonsais.length" class="bonsai__grid">
      <BonsaiCard
        v-for="bonsai in filteredBonsais"
        :key="bonsai.id"
        :bonsai="bonsai"
      />
    </div>

    <div v-else class="empty">
      No bonsai found
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NormalizedBonsai } from '../../shared/types/contentful'

useHead({
  title: 'Bonsai Shop — Premium Bonsai Collection',
  meta: [
    {
      name: 'description',
      content: 'Discover our curated collection of premium bonsai. Evergreen and deciduous specimens from Japan and Europe.',
    },
  ],
})

interface Tag {
  id: string
  label: string
  count: number
}

const { data, pending } = await useBonsais()
const selectedTag = ref<Tag | null>(null)

const bonsais = computed<NormalizedBonsai[]>(() => data.value?.items ?? [])

const tagsWithCounts = computed<Tag[]>(() => {
  const counts = new Map<string, number>()
  for (const item of bonsais.value) {
    for (const tag of item.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .map(([id, count]) => ({
      id,
      label: id.replace(/[_-]/g, ' '),
      count,
    }))
    .sort((a, b) => b.count - a.count)
})

const filteredBonsais = computed(() => {
  if (!selectedTag.value) return bonsais.value
  return bonsais.value.filter((item) => item.tags.includes(selectedTag.value!.id))
})
</script>

<style scoped>
.loader,
.empty {
  text-align: center;
  padding: 60px 0;
  font-size: 18px;
  color: #666;
}
</style>