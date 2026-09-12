<template>
  <div class="container">
    <div class="content error-page">
      <h1 class="main__header">
        <div class="main__header-wrap">
          {{ title }}
          <NavigationIcon :size="48" />
        </div>
      </h1>

      <div class="error-page__code">{{ error.statusCode }}</div>

      <p class="error-page__message">{{ message }}</p>

      <div class="error-page__actions">
        <button class="error-page__button" @click="goHome">
          <span>←</span> Back to home
        </button>
        <button class="error-page__button error-page__button--ghost" @click="goCatalog">
          Browse bonsai <span>→</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const title = computed(() =>
  props.error.statusCode === 404 ? 'Page not found' : 'Something went wrong'
)

const message = computed(() => {
  if (props.error.statusCode === 404) {
    return 'The page you are looking for does not exist or has been moved.'
  }
  return (
    props.error.statusMessage ||
    'An unexpected error occurred. Please try again later.'
  )
})

useHead({
  title: title,
  meta: [{ name: 'robots', content: 'noindex' }],
})

const goHome = () => clearError({ redirect: '/' })
const goCatalog = () => clearError({ redirect: '/bonsai' })
</script>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 60dvh;
}

.error-page__code {
  font-size: 96px;
  font-weight: 800;
  line-height: 1;
  color: var(--accent-color, #BC002D);
  margin-bottom: 16px;
}

.error-page__message {
  max-width: 480px;
  font-size: 18px;
  line-height: 1.6;
  color: var(--text-muted, #666);
  margin: 0 0 32px;
}

.error-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.error-page__button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: var(--border-radius-8, 8px);
  background: var(--accent-color, #BC002D);
  color: var(--white-color, #fff);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.error-page__button:hover {
  opacity: 0.85;
}

.error-page__button--ghost {
  background: transparent;
  color: var(--primary-color, #111813);
  border: 1px solid var(--primary-color, #111813);
}

.error-page__button--ghost:hover {
  color: var(--accent-color, #BC002D);
  border-color: var(--accent-color, #BC002D);
}
</style>