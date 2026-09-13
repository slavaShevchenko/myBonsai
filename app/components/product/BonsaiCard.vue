<template>
  <NuxtLink :to="`/bonsai/${bonsai.slug}`" class="bonsai-card">
    <div v-if="bonsai.images.length" class="bonsai-card__image">
      <img
        :src="contentfulImageUrl(bonsai.images[0].url, { w: 600, h: 450 })"
        :alt="bonsai.title"
        loading="lazy"
      />
      <span v-if="bonsai.sold" class="bonsai-card__sold">SOLD</span>
    </div>
    <div class="bonsai-card__body">
      <h3 class="bonsai-card__title">{{ bonsai.title }}</h3>
      
      <div class="bonsai-card__specs">
        <div v-if="bonsai.style" class="bonsai-card__spec">
          <span class="bonsai-card__spec-label">Style:</span>
          <span class="bonsai-card__spec-value">{{ bonsai.style }}</span>
        </div>
        <div v-if="bonsai.age" class="bonsai-card__spec">
          <span class="bonsai-card__spec-label">Age:</span>
          <span class="bonsai-card__spec-value">{{ bonsai.age }} years</span>
        </div>
        <div v-if="bonsai.height" class="bonsai-card__spec">
          <span class="bonsai-card__spec-label">Height:</span>
          <span class="bonsai-card__spec-value">{{ bonsai.height }} cm</span>
        </div>
      </div>

      <div v-if="bonsai.price" class="bonsai-card__price">
        {{ bonsai.price }}
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { NormalizedBonsai } from '#shared/types/contentful'
import { contentfulImageUrl } from '#shared/utils/contentful-image'

defineProps<{
  bonsai: NormalizedBonsai
}>()
</script>

<style scoped>
.bonsai-card {
  background: var(--white-color, #fff);
  border-radius: var(--border-radius-16, 16px);
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  color: inherit;
  text-decoration: none;
}

.bonsai-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.bonsai-card__image {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.bonsai-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bonsai-card__sold {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--accent-color);
  color: var(--white-color, #fff);
  padding: 4px 12px;
  border-radius: var(--border-radius-4);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  line-height: 1;
}

.bonsai-card__body {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.bonsai-card__title {
  font-size: 22px;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 12px;
}

.bonsai-card__specs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;
  margin-bottom: 12px;
}

.bonsai-card__spec {
  display: flex;
  gap: 8px;
  font-size: 13px;
  line-height: 1.4;
}

.bonsai-card__spec-label {
  color: var(--text-muted);
  font-weight: 500;
  font-size: 16px;
}

.bonsai-card__spec-value {
  color: var(--primary-color);
  font-weight: 600;
  font-size: 16px;
}

.bonsai-card__price {
  font-size: 20px;
  font-weight: 700;
  color: var(--accent-color);
  margin-top: auto;
}
</style>