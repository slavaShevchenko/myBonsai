<template>
  <div>
    <div class="filters">
      <SelectFilter
        :items="availableTags"
        :model-value="selectedTagId"
        @update:model-value="$emit('update:selectedTagId', $event)"
        all-label="All Types"
        label="Type"
      />

      <SelectFilter
        :items="availableStyles"
        :model-value="selectedStyleId"
        @update:model-value="$emit('update:selectedStyleId', $event)"
        all-label="All Styles"
        label="Style"
      />

      <SelectFilter
        :items="availabilityOptions"
        :model-value="selectedAvailability"
        @update:model-value="$emit('update:selectedAvailability', $event)"
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
      {{ emptyMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NormalizedBonsai } from '#shared/types/contentful'
import type { FilterItem } from '#shared/types/filter'

defineProps<{
  pending: boolean
  filteredBonsais: NormalizedBonsai[]
  availableTags: FilterItem[]
  availableStyles: FilterItem[]
  availabilityOptions: FilterItem[]
  selectedTagId: string | null
  selectedStyleId: string | null
  selectedAvailability: string | null
  emptyMessage?: string
}>()

defineEmits<{
  'update:selectedTagId': [value: string | null]
  'update:selectedStyleId': [value: string | null]
  'update:selectedAvailability': [value: string | null]
}>()
</script>

<style scoped>
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
  .bonsai__grid {
    grid-template-columns: 1fr;
  }
  .filters {
    display: block;
  }
}
</style>