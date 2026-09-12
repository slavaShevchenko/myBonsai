<template>
  <div>
    <h1 class="page-title">Bonsai Collection</h1>

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
      No bonsai found matching your filters
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NormalizedBonsai } from '../../shared/types/contentful'
import type { FilterItem } from '~/components/product/SelectFilter.vue'

useHead({
  title: 'Bonsai Shop — Premium Bonsai Collection',
  meta: [
    {
      name: 'description',
      content: 'Discover our curated collection of premium bonsai. Evergreen and deciduous specimens from Japan and Europe.',
    },
  ],
})

const { data, pending } = await useBonsais()
const selectedTagId = ref<string | null>(null)
const selectedStyleId = ref<string | null>(null)
const selectedAvailability = ref<string | null>(null)

const allBonsais = computed<NormalizedBonsai[]>(() => data.value?.items ?? [])

const availabilityOptions: FilterItem[] = [
  { id: 'available', label: 'Available', count: 0 },
  { id: 'sold', label: 'Sold', count: 0 },
]

const baseSubset = computed(() => {
  return allBonsais.value.filter((item) => {
    if (selectedTagId.value && !item.tags.includes(selectedTagId.value)) return false
    if (selectedStyleId.value && item.style !== selectedStyleId.value) return false
    return true
  })
})

const availableTags = computed<FilterItem[]>(() => {
  const subset = allBonsais.value.filter((item) => {
    if (selectedStyleId.value && item.style !== selectedStyleId.value) return false
    if (selectedAvailability.value === 'available' && item.sold) return false
    if (selectedAvailability.value === 'sold' && !item.sold) return false
    return true
  })

  const counts = new Map<string, number>()
  for (const item of subset) {
    for (const tag of item.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .map(([id, count]) => ({ id, label: id.replace(/[_-]/g, ' '), count }))
    .sort((a, b) => b.count - a.count)
})

const availableStyles = computed<FilterItem[]>(() => {
  const subset = allBonsais.value.filter((item) => {
    if (selectedTagId.value && !item.tags.includes(selectedTagId.value)) return false
    if (selectedAvailability.value === 'available' && item.sold) return false
    if (selectedAvailability.value === 'sold' && !item.sold) return false
    return true
  })

  const counts = new Map<string, number>()
  for (const item of subset) {
    if (item.style) {
      counts.set(item.style, (counts.get(item.style) ?? 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .map(([id, count]) => ({ id, label: id, count }))
    .sort((a, b) => b.count - a.count)
})

const availabilityWithCounts = computed(() => {
  const available = baseSubset.value.filter((b) => !b.sold).length
  const sold = baseSubset.value.filter((b) => b.sold).length

  return [
    { id: 'available', label: 'Available', count: available },
    { id: 'sold', label: 'Sold', count: sold },
  ]
})

const filteredBonsais = computed(() => {
  const filtered = baseSubset.value.filter((item) => {
    if (selectedAvailability.value === 'available' && item.sold) return false
    if (selectedAvailability.value === 'sold' && !item.sold) return false
    return true
  })

  // Сортировка: доступные (not sold) всегда перед проданными (sold)
  return filtered.sort((a, b) => {
    if (a.sold === b.sold) return 0
    return a.sold ? 1 : -1
  })
})

watch(availabilityWithCounts, (newVal) => {
  availabilityOptions.splice(0, availabilityOptions.length, ...newVal)
}, { immediate: true })
</script>

<style scoped>
.page-title {
  font-size: 48px;
  font-weight: 800;
  margin-top: 0;
  margin-bottom: 32px;
  text-align: center;
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
  .page-title {
    font-size: 32px;
  }
  .bonsai__grid {
    grid-template-columns: 1fr;
  }
  .filters {
    flex-direction: column;
    align-items: center;
  }
}
</style>