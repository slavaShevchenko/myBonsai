<template>
  <div
    v-if="modelValue"
    ref="lightboxRef"
    class="lightbox"
    role="dialog"
    aria-modal="true"
    :aria-label="ariaLabel"
    @click.self="close"
    @keydown.esc="close"
  >
    <div class="lightbox__content">
      <button
        ref="closeButtonRef"
        class="lightbox__close"
        @click="close"
        aria-label="Close image preview"
      >
        &times;
      </button>
      <img
        :src="modelValue"
        :alt="alt"
        class="lightbox__image"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string | null
  alt?: string
  ariaLabel?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const lightboxRef = ref<HTMLElement | null>(null)
const closeButtonRef = ref<HTMLButtonElement | null>(null)
const triggerElement = ref<HTMLElement | null>(null)

const close = () => {
  emit('update:modelValue', null)
}

// Focus trap: при открытии фокус на кнопке закрытия, при закрытии — возврат на триггер
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      triggerElement.value = document.activeElement as HTMLElement
      nextTick(() => {
        closeButtonRef.value?.focus()
      })
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      if (triggerElement.value) {
        triggerElement.value.focus()
        triggerElement.value = null
      }
    }
  }
)

// Очистка при unmount
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.lightbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: var(--popup-bg, rgba(0, 0, 0, 0.9));
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.lightbox__content {
  position: relative;
  max-width: 90dvw;
  max-height: 90dvh;
}

.lightbox__image {
  width: 100%;
  height: 100%;
  max-width: 90dvw;
  max-height: 90dvh;
  border-radius: var(--border-radius-8, 8px);
  object-fit: contain;
}

.lightbox__close {
  background: none;
  border: none;
  color: white;
  font-size: 32px;
  -webkit-text-stroke: 1px black;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  z-index: 1001;
  padding: 8px;
  line-height: 1;
}

.lightbox__close:hover {
  color: var(--accent-color, #BC002D);
}

.lightbox__close:focus {
  outline: 2px solid var(--accent-color, #BC002D);
  outline-offset: 2px;
}
</style>