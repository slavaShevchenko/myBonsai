<template>
  <div class="tag-filter">
    <button
      type="button"
      class="tag-filter__btn"
      :class="{ 'tag-filter__btn--active': !selectedTag }"
      @click="$emit('update:modelValue', null)"
    >
      All
    </button>
    <button
      v-for="tag in tags"
      :key="tag.id"
      type="button"
      class="tag-filter__btn"
      :class="{ 'tag-filter__btn--active': selectedTag?.id === tag.id }"
      @click="$emit('update:modelValue', tag)"
    >
      {{ tag.label }}
      <span v-if="tag.count" class="tag-filter__count">{{ tag.count }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Tag {
  id: string
  label: string
  count: number
}

defineProps<{
  tags: Tag[]
  selectedTag: Tag | null
}>()

defineEmits<{
  (event: 'update:modelValue', value: Tag | null): void
}>()
</script>

<style scoped>
.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 32px;
  justify-content: center;
}

.tag-filter__btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: 2px solid #ddd;
  background: #fff;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: capitalize;
}

.tag-filter__btn:hover {
  border-color: #BC002D;
  color: #BC002D;
}

.tag-filter__btn--active {
  background: #BC002D;
  border-color: #BC002D;
  color: #fff;
}

.tag-filter__count {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 8px;
  border-radius: 100px;
  font-size: 12px;
}

.tag-filter__btn--active .tag-filter__count {
  background: rgba(255, 255, 255, 0.25);
}
</style>