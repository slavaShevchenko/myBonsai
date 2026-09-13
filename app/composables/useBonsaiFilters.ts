import type { MaybeRefOrGetter } from 'vue'
import type { NormalizedBonsai } from '#shared/types/contentful'
import type { FilterItem } from '#shared/types/filter'
import { getAllStyles } from '#shared/data/styles'

interface UseBonsaiFiltersOptions {
  fixedStyle?: MaybeRefOrGetter<string | null | undefined>
}

function normalizeStyle(style?: string | null): string {
  return (style ?? '').trim().toLowerCase()
}

function styleLabel(id: string): string {
  return getAllStyles().find((s) => s.slug.toLowerCase() === id)?.title ?? id
}

export function useBonsaiFilters(
  allBonsais: Ref<NormalizedBonsai[]>,
  options: UseBonsaiFiltersOptions = {}
) {
  const router = useRouter()

  const fixedStyle = computed(() => normalizeStyle(toValue(options.fixedStyle)) || null)

  const selectedTagId = ref<string | null>(null)
  const selectedStyleId = ref<string | null>(fixedStyle.value)
  const selectedAvailability = ref<string | null>(null)

  const matchesStyle = (item: NormalizedBonsai, styleId: string | null) =>
    !styleId || normalizeStyle(item.style) === styleId

  const matchesTag = (item: NormalizedBonsai, tagId: string | null) =>
    !tagId || item.tags.includes(tagId)

  const matchesAvailability = (item: NormalizedBonsai, availability: string | null) => {
    if (availability === 'available') return !item.sold
    if (availability === 'sold') return item.sold
    return true
  }

  // Синхронизируем селект при смене стиля через навигацию
  watch(fixedStyle, (value) => {
    selectedStyleId.value = value
  })

  // База для подсчётов availability: стиль + тип, без availability
  const baseSubset = computed(() =>
    allBonsais.value.filter(
      (item) =>
        matchesStyle(item, fixedStyle.value) &&
        matchesStyle(item, selectedStyleId.value) &&
        matchesTag(item, selectedTagId.value)
    )
  )

  const availableTags = computed<FilterItem[]>(() => {
    const subset = allBonsais.value.filter(
      (item) =>
        matchesStyle(item, fixedStyle.value) &&
        matchesStyle(item, selectedStyleId.value) &&
        matchesAvailability(item, selectedAvailability.value)
    )

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

  const availableStyles = computed<FilterItem[]>(() => {
    const subset = allBonsais.value.filter(
      (item) =>
        matchesTag(item, selectedTagId.value) &&
        matchesAvailability(item, selectedAvailability.value)
    )

    const counts = new Map<string, number>()
    if (fixedStyle.value) {
      // На странице стиля показываем все 14 стилей (пустые — disabled)
      for (const style of getAllStyles()) {
        counts.set(style.slug.toLowerCase(), 0)
      }
    } else {
      // В каталоге — только стили, которые есть в данных
      for (const item of allBonsais.value) {
        const id = normalizeStyle(item.style)
        if (id && !counts.has(id)) counts.set(id, 0)
      }
    }
    for (const item of subset) {
      const id = normalizeStyle(item.style)
      if (id) counts.set(id, (counts.get(id) ?? 0) + 1)
    }

    return Array.from(counts.entries())
      .map(([id, count]) => ({ id, label: styleLabel(id), count }))
      .sort((a, b) => b.count - a.count)
  })

  const availabilityOptions = computed<FilterItem[]>(() => [
    { id: 'available', label: 'Available', count: baseSubset.value.filter((b) => !b.sold).length },
    { id: 'sold', label: 'Sold', count: baseSubset.value.filter((b) => b.sold).length },
  ])

  const filteredBonsais = computed(() =>
    allBonsais.value
      .filter(
        (item) =>
          matchesStyle(item, fixedStyle.value) &&
          matchesStyle(item, selectedStyleId.value) &&
          matchesTag(item, selectedTagId.value) &&
          matchesAvailability(item, selectedAvailability.value)
      )
      .sort((a, b) => {
        if (a.sold === b.sold) return 0
        return a.sold ? 1 : -1
      })
  )

  // Навигация при смене стиля в селекте
  watch(selectedStyleId, (newStyleId) => {
    if (fixedStyle.value) {
      if (newStyleId === null) {
        router.push('/bonsai')
        return
      }
      if (newStyleId !== fixedStyle.value) {
        router.push(`/bonsai/style/${newStyleId}`)
      }
    } else if (newStyleId) {
      router.push(`/bonsai/style/${newStyleId}`)
    }
  })

  return {
    selectedTagId,
    selectedStyleId,
    selectedAvailability,
    availableTags,
    availableStyles,
    availabilityOptions,
    filteredBonsais,
  }
}