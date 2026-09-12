<template>
  <div class="select-filter" ref="selectRef">
    <label v-if="label" class="select-label-text">{{ label }}</label>
    <button
      type="button"
      class="select-trigger"
      :class="{ 'select-trigger--active': modelValue !== null }"
      @click="isOpen = !isOpen"
      :aria-expanded="isOpen"
    >
      <span class="select-label">{{ currentLabel }}</span>
      <svg class="select-arrow" :class="{ 'select-arrow--open': isOpen }" viewBox="0 0 12 12" fill="none">
        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <Transition name="dropdown">
      <div v-if="isOpen" class="select-dropdown">
        <button
          type="button"
          class="select-option"
          :class="{ 'select-option--active': modelValue === null }"
          @click="select(null)"
        >
          {{ allLabel }}
        </button>
        <button
          v-for="item in items"
          :key="item.id"
          type="button"
          class="select-option"
          :class="{
            'select-option--active': modelValue === item.id,
            'select-option--disabled': item.count === 0 && modelValue !== item.id,
          }"
          :disabled="item.count === 0 && modelValue !== item.id"
          @click="select(item.id)"
        >
          <span>{{ item.label }}</span>
          <span class="select-count">{{ item.count }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { FilterItem } from '../../../shared/types/filter'

const props = defineProps<{
  items: FilterItem[]
  modelValue: string | null
  allLabel?: string
  label?: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | null): void
}>()

const isOpen = ref(false)
const selectRef = ref<HTMLElement | null>(null)

const currentLabel = computed(() => {
  if (!props.modelValue) return props.allLabel ?? 'All'
  const item = props.items.find((i) => i.id === props.modelValue)
  return item?.label ?? props.allLabel ?? 'All'
})

const select = (value: string | null) => {
  emit('update:modelValue', value)
  isOpen.value = false
}

const closeOnOutsideClick = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeOnOutsideClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeOnOutsideClick)
})
</script>

<style scoped>
.select-filter {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.select-label-text {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted, #666);
  margin-bottom: 8px;
}

.select-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 2px solid #ddd;
  background: var(--white-color, #fff);
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--primary-color, #111813);
  min-width: 160px;
  justify-content: space-between;
}

.select-trigger:hover {
  border-color: var(--accent-color, #BC002D);
}

.select-trigger--active {
  background: var(--accent-color, #BC002D);
  border-color: var(--accent-color, #BC002D);
  color: var(--white-color, #fff);
}

.select-arrow {
  width: 12px;
  height: 12px;
  transition: transform 0.2s;
}

.select-arrow--open {
  transform: rotate(180deg);
}

.select-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 100%;
  background: var(--white-color, #fff);
  border: 2px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 300px;
  overflow-y: auto;
}

.select-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px 20px;
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  color: var(--primary-color, #111813);
  text-align: left;
}

.select-option:hover {
  background: #f5f5f5;
}

.select-option--active {
  background: var(--accent-color, #BC002D);
  color: var(--white-color, #fff);
}

.select-option--active:hover {
  background: var(--accent-color, #BC002D);
}

.select-count {
  background: rgba(0, 0, 0, 0.08);
  padding: 2px 8px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
}

.select-option--active .select-count {
  background: rgba(255, 255, 255, 0.25);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.select-option--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.select-option--disabled:hover {
  background: none;
}

@media (max-width: 767px) {
  .select-filter {
    display: flex;
  }
}
</style>