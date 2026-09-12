<template>
  <div>
    <h1 class="main__header">
      <div class="main__header-wrap">
        Services
        <NavigationIcon :size="48" />
      </div>
    </h1>

    <div v-if="pending" class="loader">Loading...</div>

    <div v-else class="services__grid">
      <div v-for="service in services" :key="service.id" class="services__grid-item">
        <div v-if="service.imageUrl" class="services__item-image">
          <img
            :src="contentfulImageUrl(service.imageUrl, { w: 800, h: 533 })"
            :alt="service.title"
            loading="lazy"
          />
        </div>
        <div class="services__item-content">
          <div>
            <div class="services__item-title">{{ service.title }}</div>
            <div class="services__item-description">{{ service.description }}</div>
          </div>
          <div v-if="service.price" class="services__item-price">
            <span>Price:</span>
            {{ service.price }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { contentfulImageUrl } from '../../shared/utils/contentful-image'
const config = useRuntimeConfig()
const pageUrl = `${config.public.siteUrl}/services`
const pageTitle = 'Bonsai Care & Maintenance Services'
const pageDescription = 'Professional bonsai care, pruning, repotting, styling and maintenance services. Keep your bonsai healthy with expert care.'

useHead({
  title: pageTitle,
  meta: [
    {
      name: 'description',
      content: pageDescription,
    },
    // OpenGraph
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: pageUrl },
    { property: 'og:image', content: `${config.public.siteUrl}/header-desktop.webp` },
    { property: 'og:site_name', content: 'My Bonsai' },
    { property: 'og:locale', content: 'en_IE' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDescription },
    { name: 'twitter:image', content: `${config.public.siteUrl}/header-desktop.webp` },
  ],
  link: [
    {
      rel: 'canonical',
      href: pageUrl,
    },
  ],
})

const { data, pending } = await useServices()
const services = computed(() => data.value?.items ?? [])
</script>

<style scoped>
.loader {
  text-align: center;
  padding: 60px 0;
  font-size: 18px;
  color: var(--text-muted);
}

.services__grid {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.services__grid-item {
  display: flex;
  gap: 16px;
  background: var(--white-color);
  padding: 16px;
  border-radius: var(--border-radius-16);
  box-shadow: 0 2px 10px var(--shadow-light);
}

.services__grid-item + .services__grid-item {
  margin-top: 16px;
}

.services__item-image {
  width: 50%;
  max-width: 50%;
  min-width: 50%;
  aspect-ratio: 1.5 / 1;
  overflow: hidden;
  border-radius: var(--border-radius-8);
}

.services__item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.services__item-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
}

.services__item-title {
  margin-bottom: 8px;
  font-weight: 700;
  font-size: 28px;
  letter-spacing: 1px;
  color: var(--primary-color);
}

.services__item-description {
  color: var(--text-muted);
  line-height: 1.5;
}

.services__item-price {
  color: var(--text-muted);
}

.services__item-price span {
  font-weight: 700;
  color: var(--accent-color);
}

@media (max-width: 767px) {
  .services__grid-item {
    display: block;
  }
  .services__item-image {
    width: 100%;
    max-width: 100%;
    min-width: 100%;
    margin-bottom: 16px;
  }
  .services__item-title {
    font-size: 24px;
  }
}
</style>