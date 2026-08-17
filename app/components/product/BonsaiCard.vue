<template>
  <NuxtLink :to="`/bonsai/${bonsai.slug}`" class="bonsai-card">
    <div v-if="bonsai.images.length" class="bonsai-card__image">
      <img :src="bonsai.images[0].url" :alt="bonsai.title" />
      <span v-if="bonsai.price?.sold" class="bonsai-card__sold">SOLD</span>
    </div>
    <div class="bonsai-card__body">
      <h3 class="bonsai-card__title">{{ bonsai.title }}</h3>
      <p v-if="bonsai.description" class="bonsai-card__desc">
        {{ bonsai.description }}
      </p>
      <div v-if="bonsai.price?.display" class="bonsai-card__price">
        {{ bonsai.price.display }}
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { NormalizedBonsai } from '../../../shared/types/contentful'

defineProps<{
  bonsai: NormalizedBonsai
}>()
</script>

<style scoped>
.bonsai-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  color: inherit;
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
  background: #BC002D;
  color: #fff;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
}

.bonsai-card__body {
  padding: 16px 20px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.bonsai-card__title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 8px;
}

.bonsai-card__desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.5;
  flex: 1;
}

.bonsai-card__price {
  font-size: 20px;
  font-weight: 700;
  color: #111813;
  margin-top: auto;
}
</style>